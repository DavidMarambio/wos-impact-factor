import { expect } from 'chai'
import shortid from 'shortid'
import app from '../../app'
import supertest from 'supertest'

let refreshToken = ''
let firstUserIdTest = ''
let passwordResetCode = ''
const newFirstName2 = 'Paulo'
const newLastName2 = 'Faraco'
const testUserBody = {
  firstName: "prueba",
  lastName: "usuario",
  email: `prueba+${shortid.generate()}@uchile.cl`,
  password: 'Sup3rSecret!23',
  passwordConfirmation: 'Sup3rSecret!23'
}

const userAdmin = {
  firstName: "David",
  lastName: "Marambio",
  email: 'david.marambios@uchile.cl',
  password: 'Sup3rSecret!23',
  passwordConfirmation: 'Sup3rSecret!23',
  role: "admin"
}
let adminUserId: string
let verificationCode: string
let accessToken: string

const request: supertest.SuperAgentTest = supertest.agent(app)

describe('USERS and AUTH endpoints for member role', function () {

  it('should allow a POST to /users without being logged in', async function () {
    const res = await request
      .post('/users')
      .send(testUserBody)
    expect(res.status).to.equal(201)
    expect(res.body).not.to.be.empty
    expect(res.body).to.be.an('Object')
    expect(res.body.id).to.be.a('string')
    expect(res.body.verificationCode).to.be.a('string')
    firstUserIdTest = res.body.id
    verificationCode = res.body.verificationCode
  })

  it('should allow a POST to /users/verify/:id/:verificationCode', async function () {
    const res = await request.post(`/users/verify/${firstUserIdTest}/${verificationCode}`)
      .send({})
    expect(res.status).to.equal(200)
  })

  it('should allow a POST to /auth', async function () {
    const res = await request
      .post('/auth')
      .send(testUserBody)
    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty
    expect(res.body).to.be.an('Object')
    expect(res.body.accessToken).to.be.a('string')
    expect(res.body.refreshToken).to.be.a('string')
    accessToken = res.body.accessToken
    refreshToken = res.body.refreshToken
  })

  it('should allow a POST to /auth/refresh-token', async function () {
    const res = await request
      .post('/auth/refresh-token')
      .auth(accessToken, { type: 'bearer' })
      .set({ 'x-refresh': refreshToken })
      .send()
    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty
    expect(res.body).to.be.an('Object')
    expect(res.body.accessToken).to.be.a('string')
    accessToken = res.body.accessToken
    refreshToken = res.body.refreshToken
  })

  it('should allow a POST to /users/:userId but show an error if you don\'t attach a user in the body', async function () {
    const res = await request
      .post(`/users/${firstUserIdTest}`)
      .send()
    expect(res.status).to.equal(401)
  })

  describe('With a valid access token', function () {

    it('should not allow a GET to /users to a "member" role', async function () {
      const res = await request
        .get(`/users`)
        .auth(accessToken, { type: 'bearer' })
        .send()
      expect(res.status).to.equal(403)
    })

    it('should not allow a GET to /users/:userId to a "member" role', async function () {
      const res = await request
        .get(`/users/${firstUserIdTest}`)
        .auth(accessToken, { type: 'bearer' })
        .send()
      expect(res.status).to.equal(403)
    })

    it('should allow a POST to /users/forgotpassword/:email', async function () {
      const res = await request
        .post(`/users/forgotpassword/${testUserBody.email}`)
        .send()

      expect(res.status).to.equal(200)
      expect(res.body).not.to.be.empty
      expect(res.body).to.be.an('Object')
      expect(res.body.passwordResetCode).to.be.a('string')
      passwordResetCode = res.body.passwordResetCode
    })

    it('should allow a POST to /users/resetpassword/:id/:passwordResetCode', async function () {
      const res = await request
        .post(`/users/resetpassword/${firstUserIdTest}/${passwordResetCode}`)
        .query({ id: firstUserIdTest, passwordResetCode: passwordResetCode })
        .send({ password: 'uchile', passwordConfirmation: 'uchile' })
      expect(res.status).to.equal(200)
    })

    it('should not allow a PUT to /users/:userId/role/:role to a "member" role', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}/role/admin`)
        .auth(accessToken, { type: 'bearer' })
        .send()
      expect(res.status).to.equal(403)
    })

    it('should not allow a PUT to /users/:userId to a "member" role', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}`)
        .auth(accessToken, { type: 'bearer' })
        .send({
          email: testUserBody.email,
          password: testUserBody.password,
          passwordConfirmation: testUserBody.password,
          firstName: newFirstName2,
          lastName: newLastName2,
          role: "member"
        })
      expect(res.status).to.equal(403)
    })

    it('should not allow a DELETE from /users/:userId to a "member" role', async function () {
      const res = await request
        .delete(`/users/${firstUserIdTest}`)
        .auth(accessToken, { type: 'bearer' })
        .send()
      expect(res.status).to.equal(403)
    })

    it('should allow a SIGN OFF from /auth/sign-off with "member" role', async function () {
      const res = await request
        .post(`/auth/sign-off`)
        .auth(accessToken, { type: 'bearer' })
        .send({ email: testUserBody.email })
      expect(res.status).to.equal(204)
    })

  })

})
