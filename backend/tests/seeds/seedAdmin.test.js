const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/User");
const { seedAdmin } = require("../../src/seeds/seedAdmin");

const ADMIN_EMAIL = "parimal3010@gmail.com";
const ADMIN_PASSWORD = "123456";

describe("Seed Admin User", () => {
  describe("seedAdmin function", () => {
    it("should create an admin user with correct email and role", async () => {
      await seedAdmin();

      const admin = await User.findOne({ email: ADMIN_EMAIL });

      expect(admin).not.toBeNull();
      expect(admin.email).toBe(ADMIN_EMAIL);
      expect(admin.role).toBe("admin");
    });

    it("should store hashed password for admin user", async () => {
      await seedAdmin();

      const admin = await User.findOne({ email: ADMIN_EMAIL }).select(
        "+password",
      );

      expect(admin).not.toBeNull();
      expect(admin.password).not.toBe(ADMIN_PASSWORD);
      expect(admin.password).toMatch(/^\$2[aby]?\$/); // bcrypt hash pattern
    });

    it("should not create duplicate admin if already exists", async () => {
      await seedAdmin();
      const firstAdmin = await User.findOne({ email: ADMIN_EMAIL });

      await seedAdmin();
      const secondAdmin = await User.findOne({ email: ADMIN_EMAIL });

      expect(firstAdmin._id.toString()).toBe(secondAdmin._id.toString());
    });
  });

  describe("Admin Login", () => {
    beforeEach(async () => {
      await seedAdmin();
    });

    it("should login as admin with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(ADMIN_EMAIL);
      expect(response.body.user.role).toBe("admin");
      expect(response.body.user.password).toBeUndefined();
    });

    it("should return invalid credentials with wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: ADMIN_EMAIL, password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });
});
