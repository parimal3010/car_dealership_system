import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <nav className="navbar">

      <h2 className="logo">
        Vehicle Dealership
      </h2>


      <div className="nav-links">

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


    </nav>

  );

}


export default Navbar;