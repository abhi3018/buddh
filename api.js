import axios from "axios";

export const loginUser = async (credentials) => {
  const res = await axios.post("/api/auth/login", credentials);
  return res.data;
};
export const insertUser = async (credentials) => {
  const res = await axios.post("/api/users/insertUser", credentials);
  return res.data;
};

// Accept optional cookieHeader for SSR
export const fetchProfile = async (cookieHeader = "") => {console.log("fetchProfile called with cookieHeader:", cookieHeader);
  try{const res = await axios.get("http://localhost:3000/api/auth/profile", {
    headers: { cookie: cookieHeader },
  });
  return res.data;
}catch(err){console.log("fetchProfile error:",err);}
}
