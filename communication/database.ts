import { MongoClient, ObjectId } from "$atlas_sdk/mod.ts";

interface LinkSchema {
  _id?: ObjectId;
  title: string;
  url: string;
}

interface UserSchema {
  _id?: ObjectId;
  username: string;
  email: string;
  bio: string;
  linksList: Array<ObjectId>;
}

export class MongoDBDatabase {
  #client: MongoClient;
  #db: ReturnType<MongoClient["database"]>;
  #users;
  #links;

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
    this.#links = this.#db.collection<LinkSchema>("links");
  }

  async createUser(email: string) {
    const { insertedId } = await this.#users.insertOne({
      email,
      username: "",
      bio: "",
      linksList: [],
    });
    return insertedId;
  }

  async getUser(filter: { _id?: string; email?: string }) {
    const result = await this.#users.findOne(filter);
    return result;
  }

  async createLinkForUser(userId: string, title: string, url: string) {
    const { insertedId } = await this.#links.insertOne({
      title,
      url,
    });

    this.#users.countDocuments({ active: true });
    const result = await this.#users.updateOne({ _id: userId }, {
      $push: { linksList: insertedId },
    });

    return result;
  }
}

export const database = new MongoDBDatabase();
