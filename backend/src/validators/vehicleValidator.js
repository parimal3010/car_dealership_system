function validateAddVehicleInput({
  make,
  model,
  year,
  price,
  mileage,
  color,
  fuelType,
  transmission,
}) {
  const currentYear = new Date().getFullYear();

  // Required field validation
  if (!make || typeof make !== "string" || make.trim() === "") {
    return "Make is required and must be a string";
  }

  if (!model || typeof model !== "string" || model.trim() === "") {
    return "Model is required and must be a string";
  }

  if (year === undefined || year === null) {
    return "Year is required";
  }

  if (typeof year !== "number" || !Number.isInteger(year)) {
    return "Year must be a valid number";
  }

  if (year > currentYear) {
    return "Year cannot be in the future";
  }

  if (price === undefined || price === null) {
    return "Price is required";
  }

  if (typeof price !== "number" || price < 0) {
    return "Price must be a non-negative number";
  }

  // Optional field validation
  if (mileage !== undefined && typeof mileage !== "number") {
    return "Mileage must be a number";
  }

  return null;
}

module.exports = {
  validateAddVehicleInput,
};
