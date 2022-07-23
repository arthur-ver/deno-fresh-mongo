import { MongoClient, ObjectId } from "$atlas_sdk/mod.ts";
import { Collection, Database } from "$atlas_sdk/client.ts";
import { Document } from "$atlas_sdk/deps.ts";

interface LinkSchema {
  _id?: ObjectId;
  title: string;
  url: string;
}

interface UpdateSchema {
  _id?: ObjectId;
  title: string;
  date: Date;
  text: string;
  url?: string;
}

interface UserSchema {
  _id?: ObjectId;
  username: string;
  email: string;
  bio: string;
  linksList: Array<ObjectId>;
  updatesList: Array<ObjectId>;
}

export class MongoDBDatabase {
  #client: MongoClient;
  #db: Database;
  #users: Collection<Document>;
  #links: Collection<Document>;
  #updates: Collection<Document>;

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
    this.#updates = this.#db.collection<UpdateSchema>("updates");
  }

  async createUser(email: string) {
    let usernameExists;
    let username: string;

    do {
      const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
      username = email.split("@")[0].concat(randomNumber);
      usernameExists = await this.#users.findOne({ username });
    } while (usernameExists);

    const { insertedId } = await this.#users.insertOne({
      email,
      username,
      bio: "",
      linksList: [],
      updatesList: []
    });
    return insertedId;
  }

  async getUser(filter: { _id?: string; email?: string }) {
    const result = await this.#users.findOne(filter);
    return result;
  }

  async createLinkForUser(_id: string, title: string, url: string) {
    const { insertedId } = await this.#links.insertOne({
      title,
      url,
    });

    await this.#users.updateOne({ _id }, {
      $push: { linksList: insertedId },
    });
  }

  async createUpdateForUser(
    _id: string,
    title: string,
    date: Date,
    text: string,
    url?: string,
  ) {
    const { insertedId } = await this.#updates.insertOne({
      title,
      date,
      text,
      url,
    });

    await this.#users.updateOne({ _id }, {
      $push: { updatesList: insertedId },
    });
  }
}

export const database = new MongoDBDatabase();
