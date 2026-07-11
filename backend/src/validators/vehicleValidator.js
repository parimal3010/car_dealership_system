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

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice !== undefined) {
      const min = Number(query.minPrice);

      if (Number.isNaN(min)) {
        return { error: "minPrice must be a valid number" };
      }

      filter.price.$gte = min;
    }

    if (query.maxPrice !== undefined) {
      const max = Number(query.maxPrice);

      if (Number.isNaN(max)) {
        return { error: "maxPrice must be a valid number" };
      }

      filter.price.$lte = max;
    }

    if (
      filter.price.$gte !== undefined &&
      filter.price.$lte !== undefined &&
      filter.price.$gte > filter.price.$lte
    ) {
      return {
        error: "minPrice cannot be greater than maxPrice",
      };
    }
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
