import jwt from "jsonwebtoken";
import getDb from "../../../utils/mongodb";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret123";

export default async function handler(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
   // const client = await clientPromise;
   // const db = client.db("local");
   const db = await getDb();
   console.log("decoded user:", decoded.user);
    const user = await db.collection("users").findOne({ username: decoded.user.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user: { username: user.username, name: user.name, email: user.email } });
  } catch (err) {console.log("JWT verify error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}
