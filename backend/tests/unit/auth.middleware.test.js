const jwt = require('jsonwebtoken')
const authMiddleware = require('../../middleware/auth')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('auth middleware', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  it('calls next() and attaches userId when the token is valid', () => {
    const token = jwt.sign({ userId: 'abc123' }, process.env.JWT_SECRET)
    const req = { header: () => `Bearer ${token}` }
    const res = mockRes()
    const next = jest.fn()

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(req.userId).toBe('abc123')
    expect(res.status).not.toHaveBeenCalled()
  })

  it('rejects a request with no token', () => {
    const req = { header: () => undefined }
    const res = mockRes()
    const next = jest.fn()

    authMiddleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('rejects a request with an invalid token', () => {
    const req = { header: () => 'Bearer not-a-valid-token' }
    const res = mockRes()
    const next = jest.fn()

    authMiddleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
  })
})
