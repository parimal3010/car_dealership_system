  const User = require("../models/User");

  const ADMIN_EMAIL = "parimal3010@gmail.com";
  const ADMIN_PASSWORD = "123456";
  const ADMIN_NAME = "Admin";

  async function seedAdmin() {
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

      if (existingAdmin) {
        console.log("Admin user already exists");
        return existingAdmin;
      }

      // Create admin user
      const admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });

      console.log("Admin user seeded successfully");
      return admin;
    } catch (error) {
      console.error("Error seeding admin user:", error.message);
      throw error;
    }
  }

  module.exports = { seedAdmin };
