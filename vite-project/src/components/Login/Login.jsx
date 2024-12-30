import { useState } from "react";
//import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS for styling

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
    //   const res = await axios.post("http://localhost:5000/api/auth/login", {
    //     username,
    //     password,
    //   });
    //   localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/booking");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
    <h1 className="heading">Bengaluru Startup</h1>
    <div className="login-container">
        
      <div className="login-card">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      </div>
    </div>
    </>
  );
}

export default Login;
