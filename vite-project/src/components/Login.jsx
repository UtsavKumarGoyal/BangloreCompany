// import { useState } from "react";
// //import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//     //   const res = await axios.post("http://localhost:5000/api/auth/login", {
//     //     username,
//     //     password,
//     //   });
//     //   localStorage.setItem("token", res.data.token);
//       alert("Login successful");
//       navigate("/booking");
//     } catch (err) {
//       alert(err.response.data.error || "Login failed");
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// export default Login;
