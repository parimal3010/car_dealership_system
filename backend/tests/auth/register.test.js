const request = require('supertest');
const app = require('../../src/app');

const validUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
};

describe('POST /api/auth/register', () => {
  describe('successful registration', () => {
    it('should register a new user with valid details', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toMatchObject({
        name: validUser.name,
        email: validUser.email,
        role: 'user',
      });
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.password).toBeUndefined();
    });

    it('should store a hashed password, not plain text', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const User = require('../../src/models/User');
      const user = await User.findOne({ email: validUser.email }).select('+password');

      expect(user).not.toBeNull();
      expect(user.password).not.toBe(validUser.password);
      expect(user.password).toMatch(/^\$2[aby]?\$/);
    });
  });

  describe('validation errors', () => {
    it('should return 400 when name is missing', async () => {
      const { name, ...userWithoutName } = validUser;

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithoutName);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/name/i);
    });

    it('should return 400 when email is missing', async () => {
      const { email, ...userWithoutEmail } = validUser;

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithoutEmail);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
    });

    it('should return 400 when password is missing', async () => {
      const { password, ...userWithoutPassword } = validUser;

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithoutPassword);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/password/i);
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'not-an-email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
    });

    it('should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, password: '12345' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/password/i);
    });
  });

  describe('duplicate registration', () => {
    it('should return 409 when email is already registered', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/already/i);
    });
  });
});
