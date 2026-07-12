import { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";
import Navbar from "../components/Navbar";


const API_URL = "http://localhost:5000/api/vehicles";


function UserDashboard() {

  const token = localStorage.getItem("token");

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

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
      setFilteredVehicles(res.data.vehicles);


    } catch (error) {

      alert("Failed to load vehicles");

    }

  };





  const handleSearch = (e) => {

    const value = e.target.value.toLowerCase();

    setSearch(value);


    const filtered = vehicles.filter((vehicle) =>

      vehicle.make.toLowerCase().includes(value) ||

      vehicle.model.toLowerCase().includes(value) ||

      vehicle.fuelType.toLowerCase().includes(value)

    );


    setFilteredVehicles(filtered);

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

      if (search[key]) {
        params[key] = search[key];
      }

    });



    const res = await axios.get(
      `${API_URL}/search`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    setFilteredVehicles(res.data.vehicles);


  } catch(error) {

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


  setFilteredVehicles(vehicles);

};


const handlePurchase = async (id) => {

  const quantity = prompt("Enter quantity to purchase");


  if (!quantity) {
    return;
  }


  try {

    await axios.post(
      `${API_URL}/${id}/purchase`,
      {
        quantity: Number(quantity),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    alert("Vehicle purchased successfully");


    fetchVehicles();


  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Purchase failed"
    );

  }

};
  return (
<div>
        <Navbar />
    <div className="user-dashboard">


      <div className="dashboard-header">

        <h1>
          Explore Available Vehicles 🚗
        </h1>

        <p>
          Find your perfect vehicle from our collection
        </p>


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

      </div>





      <div className="vehicle-container">


        {
          filteredVehicles.length === 0 ? (

            <div className="empty-box">

              <h2>
                No vehicles found 😔
              </h2>

              <p>
                Try another search
              </p>

            </div>


          ) : (


            filteredVehicles.map((vehicle) => (


              <div 
                className="vehicle-card"
                key={vehicle.id}
              >


                <div className="vehicle-image">

                  🚘

                </div>



                <div className="vehicle-content">


                  <h2>

                    {vehicle.make} {vehicle.model}

                  </h2>



                  <div className="price">

                    ₹{vehicle.price.toLocaleString()}

                  </div>




                  <div className="details">

                            <p>
                            🚙 <b>Category:</b> {vehicle.category}
                            </p>
                    <p>
                      📅 <b>Year:</b> {vehicle.year}
                    </p>


                    <p>
                      ⛽ <b>Fuel:</b> {vehicle.fuelType}
                    </p>


                    <p>
                      ⚙️ <b>Transmission:</b> {vehicle.transmission}
                    </p>


                    <p>
                      🛣️ <b>Mileage:</b> {vehicle.mileage} km
                    </p>


                    <p>
                      🎨 <b>Color:</b> {vehicle.color}
                    </p>


                  </div>




                 <div 
 className={
  vehicle.quantity > 0
  ? "stock available"
  : "stock unavailable"
 }
>

{
  vehicle.quantity > 0
    ? `Available: ${vehicle.quantity}`
    : "Out of Stock"
}

</div>


<button

  className="purchase-btn"

  disabled={vehicle.quantity === 0}

  onClick={() => handlePurchase(vehicle.id)}

>

  {
    vehicle.quantity > 0
      ? "Purchase"
      : "Unavailable"
  }

</button>


                </div>


              </div>


            ))

          )
        }


      </div>


    </div>
    </div>

  );

}


export default UserDashboard;