import { useState} from "react";
import Link from "next/link"; // ✅ correct

import { useMutation } from "@tanstack/react-query";
import { useDispatch,useSelector } from "react-redux";
import { setCredentials } from "../store";
import { loginUser } from "../api";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { users } = useSelector((state) => state.allUsers);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      //dispatch(setCredentials({ token: null, user: data.user }));
      router.push("/profile");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <>
    <h1>Login Page <Link href="/profile">profile</Link></h1>
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
    </>
  );
}
