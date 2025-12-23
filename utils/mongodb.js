// utils/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("❌ Missing MONGODB_URI");

let client;
let db;

export default async function getDb(dbName = "local") {
  if (db) return db; // return cached db

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ MongoDB connected");
  }

  db = client.db(dbName);
  return db;
}
