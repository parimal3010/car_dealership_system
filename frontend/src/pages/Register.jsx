import { useState } from "react";
  import axios from "axios";
import HomeNavbar from "../components/HomeNavbar";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData
    );

    console.log(response.data);
    alert("Registration successful!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert(error.response?.data?.message || "Registration failed");
  }
};

  return (
     <div>
  <HomeNavbar />

  <div className="login-page">
    <div className="login-card">

      <div className="login-header">
        <h1>Create Account</h1>
        <p>Register to access the Car Dealership Inventory System</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">

        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Register
        </button>

      </form>

    </div>
  </div>
</div>

  );
}

export default Register;