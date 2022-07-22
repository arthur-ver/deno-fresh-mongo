import { MongoClient, ObjectId } from "$atlas_sdk/mod.ts";

interface UserSchema {
  _id?: ObjectId;
  username: string;
  email: string;
  bio: string;
}

export class MongoDBDatabase {
  #client: MongoClient;
  #db: ReturnType<MongoClient["database"]>;
  #users;

  constructor() {
    this.#client = new MongoClient({
      endpoint: `https://data.mongodb-api.com/app/${
        Deno.env.get("ATLAS_APP_ID")
      }/endpoint/data/v1`,
      dataSource: Deno.env.get("ATLAS_DATA_SOURCE") || "", // e.g. "Cluster0"
      auth: {
        apiKey: Deno.env.get("ATLAS_DATA_API_KEY") || "",
      },
    });
    this.#db = this.#client.database("database");
    this.#users = this.#db.collection<UserSchema>("users");
  }

  async createUser(email: string) {
    const result = await this.#users.insertOne({
      email,
      username: "",
      bio: "",
    });
    return result;
  }

  async getUserByEmail(email: string) {
    const result = await this.#users.findOne({ email });
    return result;
  }
}

export const database = new MongoDBDatabase();
