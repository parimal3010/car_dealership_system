import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeNavbar from "../components/HomeNavbar";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log(response.data);

      const { token, user } = response.data;

      // Store token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login Successful!");

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    //  
    <div>
         <HomeNavbar />
    <div className="form-container">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    </div>
  );
}

export default Login;