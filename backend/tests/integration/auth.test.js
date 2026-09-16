const request = require('supertest')
const app = require('../../server')
const User = require('../../models/User')

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Anne Test',
    email: 'anne.test@example.com',
    password: 'Password1'
  }

  it('creates a new account and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(validUser.email)

    const stored = await User.findOne({ email: validUser.email })
    expect(stored).not.toBeNull()
    expect(stored.password).not.toBe(validUser.password)
  })

  it('rejects a duplicate email', async () => {
    await request(app).post('/api/auth/register').send(validUser)
    const res = await request(app).post('/api/auth/register').send(validUser)

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('rejects a weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'weak@example.com', password: 'weak' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})

describe('POST /api/auth/login', () => {
  const credentials = {
    name: 'Anne Test',
    email: 'anne.login@example.com',
    password: 'Password1'
  }

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(credentials)
  })

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeDefined()
  })

  it('rejects an incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'WrongPassword1' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('rejects an unknown email without revealing it does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password1' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Email ou mot de passe incorrect')
  })
})
