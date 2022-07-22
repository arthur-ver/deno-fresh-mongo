import { Values } from "$denodb/lib/data-types.ts";
import { Database, DataTypes, Model, PostgresConnector } from "$denodb/mod.ts";

import { ResourceLoader } from "../helpers/loader.ts";

export interface DatabaseUser extends Values {
  email: string;
  username: string;
  avatar_url: string;
}

export class PostgresDatabase {
  #connector: PostgresConnector;
  #db: Database;

  constructor() {
    this.#connector = new PostgresConnector({
      database: Deno.env.get("HEROKU_DB")!,
      host: Deno.env.get("HEROKU_HOST")!,
      username: Deno.env.get("HEROKU_USER")!,
      password: Deno.env.get("HEROKU_PASSWORD")!,
      port: 5432,
    });
    this.#db = new Database(this.#connector);
    this.#db.link([User]);
  }

  async sync() {
    await this.#db.sync();
  }

  async createUser(user: DatabaseUser) {
    const results = await User.create(user);
    return results;
  }

  async getUserByEmail(email: string) {
    const results = await User.where("email", email).first();
    return results;
  }

  async close() {
    await this.#db.close();
  }
}

class User extends Model {
  static table = "users";

  static fields = {
    id: {
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.TEXT,
    },
    avatar_url: {
      type: DataTypes.TEXT,
    },
  };
}

export const databaseLoader = new ResourceLoader<PostgresDatabase>({
  async load() {
    const postgresDatabase = new PostgresDatabase();
    await postgresDatabase.sync();
    return Promise.resolve(postgresDatabase);
  },
});
