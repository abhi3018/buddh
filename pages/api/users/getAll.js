import getDb from "../../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    //const db = await getDb();
    const db = await getDb();
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } }) // exclude password
      .toArray();

    res.status(200).json({ users });
  } catch (err) {
    //console.log("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
}
