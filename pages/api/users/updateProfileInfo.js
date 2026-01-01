import getDb from "../../../utils/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret123";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end("Method not allowed");

  const { username, profileInfo } = req.body;
  try{
  console.log(profileInfo);
  const db = await getDb();
   const user = await db.collection("users").findOne({ username });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await db.collection("messages").insertOne({
        userId: user._id,
        profileInfo,
        createdAt: new Date()
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
}
