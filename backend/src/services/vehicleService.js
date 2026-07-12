const Vehicle = require("../models/Vehicle");


// Add new vehicle
const addVehicle = async (vehicleData) => {
  const vehicle = await Vehicle.create(vehicleData);

  return vehicle;
};




// Get all vehicles with pagination
const getAllVehicles = async (limit, skip) => {

  const vehicles = await Vehicle.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);


  const totalCount = await Vehicle.countDocuments();


  return {
    vehicles,
    totalCount,
  };
};





// Search vehicles by make, model, category, and price range
const searchVehicles = async (filter = {}) => {

  const vehicles = await Vehicle.find(filter)
    .sort({ createdAt: -1 });


  return vehicles;
};






// Delete vehicle by id
const deleteVehicleById = async (id) => {

  const vehicle = await Vehicle.findByIdAndDelete(id);


  return vehicle;
};







// Purchase vehicle
const purchaseVehicleById = async (id, quantity) => {


  if (!quantity || quantity <= 0) {
    throw new Error("Invalid purchase quantity");
  }



  const vehicle = await Vehicle.findById(id);



  if (!vehicle) {
    throw new Error("Vehicle not found");
  }




  if (vehicle.quantity < quantity) {
    throw new Error("Insufficient quantity");
  }




  vehicle.quantity -= quantity;



  await vehicle.save();



  return vehicle;
};








// Restock vehicle
const restockVehicleById = async (id, quantity) => {


  if (!quantity || quantity <= 0) {
    throw new Error("Invalid restock quantity");
  }




  const vehicle = await Vehicle.findById(id);



  if (!vehicle) {
    throw new Error("Vehicle not found");
  }




  vehicle.quantity += quantity;



  await vehicle.save();



  return vehicle;
};









// Update vehicle details
const updateVehicleDetails = async (id, updateData) => {


  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );


  return vehicle;
};








module.exports = {
  addVehicle,
  getAllVehicles,
  searchVehicles,
  deleteVehicleById,
  purchaseVehicleById,
  restockVehicleById,
  updateVehicleDetails,
};