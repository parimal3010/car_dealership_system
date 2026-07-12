import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/vehicles";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const initialForm = {
    make: "",
    model: "",
    year: "",
    price: "",
    category:"",
    mileage: "",
    color: "",
    fuelType: "",
    transmission: "",
    quantity: "",
  };

  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState(initialForm);

  const [search, setSearch] = useState({
  make: "",
  model: "",
  category: "",
  minPrice: "",
  maxPrice: "",
});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(res.data.vehicles);
    } catch (err) {
      alert("Failed to load vehicles");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const searchVehicles = async () => {
    try {
      const params = {};

      Object.keys(search).forEach((key) => {
        if (search[key]) params[key] = search[key];
      });

      const res = await axios.get(
        "http://localhost:5000/api/vehicles/search",
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicles(res.data.vehicles);
    } catch {
      alert("Search failed");
    }
  };

const clearSearch = () => {
  setSearch({
    make: "",
    model: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  fetchVehicles();
};

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      year: Number(formData.year),
      price: Number(formData.price),
      mileage:
        formData.mileage === ""
          ? undefined
          : Number(formData.mileage),
       quantity: Number(formData.quantity),   
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Vehicle updated successfully");
      } else {
        await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(payload);   

        alert("Vehicle added successfully");
      }

      resetForm();
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id);

    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
    //   category: vehicle.category,

      category: vehicle.category,
      mileage: vehicle.mileage,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      quantity: vehicle.quantity,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete vehicle?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchVehicles();
    } catch {
      alert("Delete failed");
    }
  };
const handleRestock = async (id) => {

    const quantity = prompt("Enter quantity to add");

    if (!quantity) return;

    try {

        await axios.post(

            `${API_URL}/${id}/restock`,

            {
                quantity: Number(quantity),
            },

            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

        );

        alert("Vehicle restocked successfully");

        fetchVehicles();

    } catch (err) {

        alert(err.response?.data?.message || "Restock failed");

    }

};
  return (
    <div>
        <Navbar />
  
    <div className="admin-dashboard">
           {/* <Navbar /> */}
      <h1>Admin Dashboard</h1>

      <div className="search-box">

  <input
    name="make"
    placeholder="Make"
    value={search.make}
    onChange={handleSearchChange}
  />


  <input
    name="model"
    placeholder="Model"
    value={search.model}
    onChange={handleSearchChange}
  />


  <input
    name="category"
    placeholder="Category"
    value={search.category}
    onChange={handleSearchChange}
  />


  <input
    type="number"
    name="minPrice"
    placeholder="Min Price"
    value={search.minPrice}
    onChange={handleSearchChange}
  />


  <input
    type="number"
    name="maxPrice"
    placeholder="Max Price"
    value={search.maxPrice}
    onChange={handleSearchChange}
  />


  <button onClick={searchVehicles}>
    Search
  </button>


  <button onClick={clearSearch}>
    Clear
  </button>

</div>

      <button
        className="add-btn"
        onClick={() => {
          setShowForm(true);
          setEditingId(null);
          setFormData(initialForm);
        }}
      >
        + Add Vehicle
      </button>

      {showForm && (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <input
            name="make"
            placeholder="Manufacturer"
            value={formData.make}
            onChange={handleChange}
            required
          />

          <input
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            >

            <option value="">
            Select Category
            </option>

            <option value="SUV">
            SUV
            </option>

            <option value="Sedan">
            Sedan
            </option>

            <option value="Hatchback">
            Hatchback
            </option>

            <option value="MUV">
            MUV
            </option>

            <option value="Electric">
            Electric
            </option>

            </select>

          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={formData.mileage}
            onChange={handleChange}
          />
          <input
  type="number"
  name="quantity"
  placeholder="Stock Quantity"
  value={formData.quantity}
  onChange={handleChange}
  min="0"
  required
/>

          <input
            name="color"
            placeholder="Color"
            value={formData.color}
            onChange={handleChange}
          />

          <input
            name="fuelType"
            placeholder="Fuel Type"
            value={formData.fuelType}
            onChange={handleChange}
          />

          <input
            name="transmission"
            placeholder="Transmission"
            value={formData.transmission}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? "Update Vehicle" : "Add Vehicle"}
          </button>

          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        </form>
      )}

      <h2>Vehicle Inventory</h2>

      <table>
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price</th>
            <th>Category</th>

            <th>Mileage</th>
            <th>Color</th>
            <th>Fuel</th>
            <th>Transmission</th>
            <th>Stock</th>
            <th>Actions</th>
            
          </tr>
        </thead>

        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="9">No vehicles found</td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td>₹{vehicle.price}</td>
                <td>{vehicle.category}</td>

                <td>{vehicle.mileage}</td>
                <td>{vehicle.color}</td>
                <td>{vehicle.fuelType}</td>
                <td>{vehicle.transmission}</td>
                <td>{vehicle.quantity}</td>

               
                 <td>

                    <button onClick={() => handleEdit(vehicle)}>
                        Edit
                    </button>

                    <button className="restock-btn"
                            onClick={() => handleRestock(vehicle.id)}>
                        Restock
                    </button>

                    <button onClick={() => handleDelete(vehicle.id)}>
                        Delete
                    </button>

                    </td>
               
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
      </div>
  );
}

export default AdminDashboard;