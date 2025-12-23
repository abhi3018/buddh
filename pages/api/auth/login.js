import getDb from "../../../utils/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret123";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { username, password } = req.body;

  //const client = await clientPromise;
  //const db = client.db("");
const db = await getDb();
const allUsers = await db.collection("users").find().toArray();
console.log("ALL USERS:", allUsers);

  const user = await db.collection("users").findOne({ username });
  console.log(user)
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  //const match = await bcrypt.compare(password, user.password);
  const match = password === user.password;
  console.log("match:", match);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { user: { id: user._id, username: user.username, name: user.name, email: user.email } },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600,
      path: "/",
    })
  );

  res.status(200).json({ user: { username: user.username, name: user.name, email: user.email } });
}
