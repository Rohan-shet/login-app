import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If user has no token → go to login page
    if (!token) {
      navigate("/login");
      return;
    }

    // Verify token with backend
    axios
      .get("http://localhost:4000/home", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessage(res.data.message);
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Protected Home Page</h2>
      <p>{message}</p>
      <p><b>User:</b> {user}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
