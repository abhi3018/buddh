import { fetchProfile,insertUser } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout,setAllUsers,makeStore } from "../store";
import { useRouter } from "next/router";
import { useEffect,useState} from "react";
import Link from "next/link"; // ✅ correct
import { useQuery,useMutation } from "@tanstack/react-query";
import axios from "axios";

const getAllUsers = async () => {
  const res = await axios.get("/api/users/getAll");
  return res.data;
};

export default function Profile({ serverUser}) {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.allUsers);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); 
  const router = useRouter();
//console.log(users)
//  const { data, isLoading, error } = useQuery({
//     queryKey: ["allUsers"],
//     queryFn: getAllUsers,
//   });
// if(!isLoading){dispatch(setAllUsers({users:data.users}));;}
//   useEffect(() => {
//     if (serverUser && !user) {
//       dispatch(setCredentials({ token: null, user: serverUser }));
//     }
//   }, [serverUser, user, dispatch]);
 const mutation = useMutation({
    mutationFn: insertUser,
    onSuccess: (data) => {
      alert(data.user+" inserted successfully");
      dispatch(setAllUsers([...users, {username:username,password:password}]));
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Something went wrong");
    },
  });
  const displayUser = user;
const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };
  useEffect(() => {
    if (!displayUser) router.replace("/login");
  }, [displayUser, router]);

  if (!displayUser) return <p>Loading...</p>;
console.log("username val:",username)  ;
  return (
    <div>
    <Link href="/login">Go to Login</Link>
      <h1>Profile Page dandy yatra</h1>
      <p>Name: {displayUser.name}</p>
      <p>Username: {displayUser.username}</p>
      <p>Email: {displayUser.email}</p>
      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          dispatch(logout());
          router.replace("/login");
        }}
      >
        Logout
      </button>
        <h2>All Users</h2>
        <ul>
      {users.map((u) => (
        <li key={u._id}>{u.username} ({u.password})</li>
      ))}
    </ul>
      <h2>Add New Profile</h2>
    <form onSubmit={handleSubmit} >
      <input type="text" style={{ display: "none" }} autoComplete="username" />
      <input
        placeholder="username"
       value={username}
        onChange={(e) => {setUsername(e.target.value)}}
      />

      <input
      autoComplete="off"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">add new profile</button>
    </form>
   
    </div>
  );
}

// --- Server-side ---
export async function getServerSideProps({ req }) {console.log("getServerSideProps called");
  const token = req.cookies.token || null;

  if (!token) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  // 1. Fetch profile (SSR)
  // const profileRes = await axios.get("http://localhost:3000/api/auth/profile", {
  //   headers: { cookie: req.headers.cookie },
  // });

  const profileRes = await fetchProfile(req.headers.cookie);

  // 2. Fetch all users (SSR)
  const usersRes = await axios.get("http://localhost:3000/api/users/getAll");
console.log("profileRes",profileRes);
console.log("usersRes.data",usersRes.data);
  // 3. Initialize store with SSR data
  const store = makeStore();

  store.dispatch(setCredentials({ token, user: profileRes.user }));
  store.dispatch(setAllUsers(usersRes.data.users));

  return {
    props: {
      initialReduxState: store.getState(),
    },
  };
}