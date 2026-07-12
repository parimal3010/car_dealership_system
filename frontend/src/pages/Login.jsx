import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeNavbar from "../components/HomeNavbar";
import Navbar from "../components/Navbar";
import "./Login.css";

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


    //  
    return (
    <div>
      <HomeNavbar />

      <div className="login-page">
        <div className="login-card">

          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your dealership account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;