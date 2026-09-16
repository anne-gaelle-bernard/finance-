const request = require('supertest')
const app = require('../../server')

const registerAndLogin = async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Trans Test',
    email: 'trans.test@example.com',
    password: 'Password1'
  })
  return res.body.token
}

describe('Transactions API', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/transactions')
    expect(res.status).toBe(401)
  })

  it('creates, lists and deletes a transaction for the authenticated user', async () => {
    const token = await registerAndLogin()

    const createRes = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'expense', amount: 42.5, description: 'Courses', category: 'food' })

    expect(createRes.status).toBe(201)
    expect(createRes.body.data.amount).toBe(42.5)
    const id = createRes.body.data._id

    const listRes = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)

    expect(listRes.status).toBe(200)
    expect(listRes.body.count).toBe(1)

    const deleteRes = await request(app)
      .delete(`/api/transactions/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteRes.status).toBe(200)

    const listAfterDelete = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)

    expect(listAfterDelete.body.count).toBe(0)
  })

  it('does not return another user\'s transactions', async () => {
    const tokenA = await registerAndLogin()
    const resB = await request(app).post('/api/auth/register').send({
      name: 'User B',
      email: 'userb@example.com',
      password: 'Password1'
    })
    const tokenB = resB.body.token

    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ type: 'income', amount: 100, description: 'Salaire', category: 'salary' })

    const listRes = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${tokenB}`)

    expect(listRes.body.count).toBe(0)
  })
})
