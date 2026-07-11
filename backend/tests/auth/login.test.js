const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

const registeredUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
};

const loginCredentials = {
  email: registeredUser.email,
  password: registeredUser.password,
};

async function registerTestUser() {
  await request(app).post('/api/auth/register').send(registeredUser);
}

describe('POST /api/auth/login', () => {
  describe('successful login', () => {
    beforeEach(async () => {
      await registerTestUser();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
      expect(response.body.user).toMatchObject({
        name: registeredUser.name,
        email: registeredUser.email,
        role: 'user',
      });
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.password).toBeUndefined();
    });

    it('should return a JWT containing the user id and email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials);

      expect(response.body.token.split('.')).toHaveLength(3);

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);

      expect(decoded.userId).toBe(response.body.user.id);
      expect(decoded.email).toBe(registeredUser.email);
    });
  });

  describe('validation errors', () => {
    it('should return 400 when email is missing', async () => {
      const { email, ...credentialsWithoutEmail } = loginCredentials;

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentialsWithoutEmail);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
    });

    it('should return 400 when password is missing', async () => {
      const { password, ...credentialsWithoutPassword } = loginCredentials;

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentialsWithoutPassword);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/password/i);
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
    });
  });

  describe('invalid credentials', () => {
    beforeEach(async () => {
      await registerTestUser();
    });

    it('should return 401 when user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unknown@example.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should return 401 when password is incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: registeredUser.email, password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });
  });
});
