// import './App.css';

// function App() {
//   return (
//     <div className="app">
//       <header className="app-header">
//         <h1>Car Dealership Inventory</h1>
//         <p>Frontend setup complete. Ready for step-by-step feature development.</p>
//       </header>
//     </div>
//   );
// }

// export default App;
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;