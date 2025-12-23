import cookie from "cookie";

export default function handler(req, res) {console.log("cookie is:", cookie);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      expires: new Date(0),
      path: "/",
    })
  );
  res.status(200).json({ message: "Logged out" });
}
