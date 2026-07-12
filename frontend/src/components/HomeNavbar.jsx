import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function HomeNavbar() {

  const navigate = useNavigate();


  return (

    <nav className="navbar">

      <h2 className="logo">
        Vehicle Dealership
      </h2>


      <div className="nav-links">


        <button
          onClick={() => navigate("/")}
        >
          Home
        </button>


        <button
          onClick={() => navigate("/login")}
        >
          Login
        </button>


        <button
          className="register-btn"
          onClick={() => navigate("/register")}
        >
          Register
        </button>


      </div>


    </nav>

  );

}


export default HomeNavbar;