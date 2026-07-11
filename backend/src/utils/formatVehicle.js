const formatVehicleResponse = (vehicle) => {
  return {
    id: vehicle._id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    color: vehicle.color,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    createdAt: vehicle.createdAt,
  };
};

module.exports = {
  formatVehicleResponse,
};
