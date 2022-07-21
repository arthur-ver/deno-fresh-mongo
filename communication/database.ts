import { Values } from 'https://raw.githubusercontent.com/joeldesante/denodb/master/lib/data-types.ts';
import { Database, PostgresConnector, Model, DataTypes } from 'https://raw.githubusercontent.com/joeldesante/denodb/master/mod.ts';

import { ResourceLoader } from "../helpers/loader.ts"

interface DatabasePhoto extends Values {
    url: string;
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
            port: 5432
        });
        this.#db = new Database(this.#connector);
        this.#db.link([Photo]);
    }

    async sync() {
        await this.#db.sync();
    }

    async createPhoto(photo: DatabasePhoto) {
        const results = await Photo.create(photo);
        return results;
    }

    async allPhotos() {
        const results = await Photo.all();
        return results;
    }

    async close() {
        await this.#db.close();
    }
}

class Photo extends Model {
    static table = 'photos';

    static fields = {
        id: { primaryKey: true, autoIncrement: true },
        url: DataTypes.STRING
    };
}

export const databaseLoader = new ResourceLoader<PostgresDatabase>({
    async load() {
        const postgresDatabase = new PostgresDatabase();
        await postgresDatabase.sync();
        return Promise.resolve(postgresDatabase);
    },
});