import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'

describe('Authentication API', () => {
  const baseUrl = process.env.API_URL || 'http://localhost:3000/api'
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Test123456',
    name: 'Test User',
  }
  let accessToken = ''

  describe('POST /auth/register', () => {
    test('should register new user successfully', async () => {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      })

      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.data).toHaveProperty('user')
      expect(data.data).toHaveProperty('accessToken')
      expect(data.data.user.email).toBe(testUser.email)
      
      accessToken = data.data.accessToken
    })

    test('should reject duplicate email', async () => {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      })

      const data = await response.json()
      
      expect(response.status).toBe(409)
      expect(data.error.code).toBe('USER_EXISTS')
    })

    test('should reject invalid email', async () => {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testUser, email: 'invalid' }),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('POST /auth/login', () => {
    test('should login with correct credentials', async () => {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      })

      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data).toHaveProperty('accessToken')
    })

    test('should reject wrong password', async () => {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: 'wrongpassword',
        }),
      })

      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error.code).toBe('INVALID_CREDENTIALS')
    })
  })

  describe('GET /users/profile', () => {
    test('should get user profile with valid token', async () => {
      const response = await fetch(`${baseUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.email).toBe(testUser.email)
    })

    test('should reject without token', async () => {
      const response = await fetch(`${baseUrl}/users/profile`)

      expect(response.status).toBe(401)
    })
  })
})
