import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/vehicles";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const initialForm = {
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    color: "",
    fuelType: "",
    transmission: "",
  };

  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

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
      console.error(err);
      alert("Failed to load vehicles");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Vehicle updated successfully");
      } else {
        await axios.post(
          API_URL,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Vehicle added successfully");
      }

      resetForm();
      fetchVehicles();
    } catch (err) {
      console.error(err);
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
      mileage: vehicle.mileage,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Vehicle deleted");

      fetchVehicles();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-dashboard">

      <h1>Admin Dashboard</h1>

      <form className="vehicle-form" onSubmit={handleSubmit}>

        <input
          name="make"
          placeholder="Make"
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

        <input
          type="number"
          name="mileage"
          placeholder="Mileage"
          value={formData.mileage}
          onChange={handleChange}
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

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}

      </form>

      <h2>Vehicle Inventory</h2>

      <table>

        <thead>

          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price</th>
            <th>Mileage</th>
            <th>Color</th>
            <th>Fuel</th>
            <th>Transmission</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {vehicles.map((vehicle) => (

            <tr key={vehicle.id}>

              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>${vehicle.price}</td>
              <td>{vehicle.mileage}</td>
              <td>{vehicle.color}</td>
              <td>{vehicle.fuelType}</td>
              <td>{vehicle.transmission}</td>

              <td>

                <button
                  onClick={() => handleEdit(vehicle)}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(vehicle.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default AdminDashboard;