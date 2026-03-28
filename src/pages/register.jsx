import { useState } from "react";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const handleRegister = async (e) => {
    e.preventDefault();

    try {
        await axios.post("http://localhost:5000/register", {
        email,
        password
      });
        alert("Register success !");
    } catch (err) {
      alert("Error register");
    }
    };

    return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <form onSubmit={handleRegister} style={{ width: "300px" }}>
        <h2>Register</h2>
        <input
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
        />  
        <input
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;