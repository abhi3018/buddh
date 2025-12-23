import getDb from "../../../utils/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { username, password, name, email } = req.body;

  if (!username || !password || !name || !email)
    return res.status(400).json({ message: "All fields required" });

  //const client = await clientPromise;
  //const db = client.db();
const db = await getDb();
  const existing = await db.collection("users").findOne({ username });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.collection("users").insertOne({
    username,
    password: hashed,
    name,
    email,
  });

  res.status(201).json({ message: "User created", userId: result.insertedId });
}
