import getDb from "../../../utils/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret123";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { username, password } = req.body;
try{
 // const client = await clientPromise;
 // const db = client.db("local");
 const db = await getDb();
const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }


    // Insert the new user
    const result = await db.collection("users").insertOne({
      username,
      password: password,
      createdAt: new Date()
    });

    res.status(200).json({ user: username});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

 

  res.status(200).json("inserted successfully");
}
