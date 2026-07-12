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

function validatePaginationParams(query) {
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;

  return {
    limit: Math.max(1, limit),
    skip: Math.max(0, skip),
  };
}
const validateSearchParams = (query) => {
  const filter = {};

  if (query.make) {
    filter.make = {
      $regex: query.make,
      $options: "i",
    };
  }

  if (query.model) {
    filter.model = {
      $regex: query.model,
      $options: "i",
    };
  }

  if (query.year) {
    const year = Number(query.year);

    if (Number.isNaN(year)) {
      return { error: "Year must be a valid number" };
    }

    filter.year = year;
  }

  if (query.price) {
    const price = Number(query.price);

    if (Number.isNaN(price)) {
      return { error: "Price must be a valid number" };
    }

    filter.price = price;
  }

  if (query.fuelType) {
    filter.fuelType = {
      $regex: query.fuelType,
      $options: "i",
    };
  }

  if (query.transmission) {
    filter.transmission = {
      $regex: query.transmission,
      $options: "i",
    };
  }

  return { filter };
};

module.exports = {
  validateAddVehicleInput,
  validatePaginationParams,
  validateSearchParams,
};
// module.exports = {
//   validateAddVehicleInput,
//   validatePaginationParams,
// };
