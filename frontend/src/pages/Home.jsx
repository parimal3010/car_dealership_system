import HomeNavbar from "../components/HomeNavbar";
import "./Home.css";

function Home() {
  return (
    <div>
      <HomeNavbar />

      <div className="home-content">
        <h1>Welcome to Car Dealership Inventory</h1>

        <p className="subtitle">
          Find your perfect car from our extensive collection of premium,
          affordable, and reliable vehicles.
        </p>

        <div className="home-section">
          <h2>Why Choose Us?</h2>

          <ul>
            <li>🚗 Wide selection of SUVs, Sedans, Hatchbacks, and Electric Vehicles.</li>
            <li>💰 Competitive prices to fit every budget.</li>
            <li>✔️ Quality-inspected and well-maintained vehicles.</li>
            <li>📦 Real-time inventory with stock availability.</li>
            <li>⚡ Quick and secure vehicle purchasing process.</li>
          </ul>
        </div>

        <div className="home-section">
          <h2>What You Can Do</h2>

          <ul>
            <li>🔍 Search vehicles by make, model, category, or price range.</li>
            <li>📋 View detailed specifications for every vehicle.</li>
            <li>🛒 Purchase available vehicles online.</li>
            <li>📈 Browse the latest arrivals in our inventory.</li>
          </ul>
        </div>

        <div className="home-section">
          <h2>Drive Your Dream Car Today!</h2>

          <p>
            Whether you're looking for a family SUV, a stylish sedan, or an
            eco-friendly electric vehicle, we have something for everyone.
            Register or log in to explore our inventory and purchase your next
            vehicle with ease.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;