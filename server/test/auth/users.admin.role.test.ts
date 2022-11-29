import supertest from 'supertest'
import { expect } from 'chai'
import shortid from 'shortid'
import app from '../../app'

let accessToken = ''
let refreshToken = ''
let firstUserIdTest = ''
let secondUserIdTest = ''
let verificationCode = ''
let passwordResetCode = ''
const newFirstName = 'Jose'
const newFirstName2 = 'Paulo'
const newLastName2 = 'Faraco'
const firstUserBody = {
  firstName: "prueba",
  lastName: "usuario",
  email: `prueba+${shortid.generate()}@uchile.cl`,
  password: 'Sup3rSecret!23',
  passwordConfirmation: 'Sup3rSecret!23'
}

const userAdmin = {
  firstName: "David",
  lastName: "Marambio",
  email: 'david.marambio@uchile.cl',
  password: 'Sup3rSecret!23',
  passwordConfirmation: 'Sup3rSecret!23',
  role: "admin"
}

let request: supertest.SuperAgentTest
request = supertest.agent(app)

describe('USERS and AUTH endpoints for admin role', function () {

  it('should allow a POST to /users', async function () {
    const res = await request
      .post('/users')
      .send(userAdmin)
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

  it('should allow a POST to /users/forgotpassword/:email', async function () {
    const res = await request
      .post(`/users/forgotpassword/${userAdmin.email}`)
      .send()

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty
    expect(res.body).to.be.an('Object')
    expect(res.body.passwordResetCode).to.be.a('string')
    passwordResetCode = res.body.passwordResetCode
  })

  it('should allow a POST to /users/resetpassword/:id/:passwordResetCode', async function () {
    const res = await request.post(`/users/resetpassword/${firstUserIdTest}/${passwordResetCode}`)
      .query({ id: firstUserIdTest, passwordResetCode: passwordResetCode })
      .send({ password: 'uchile', passwordConfirmation: 'uchile' })
    expect(res.status).to.equal(200)
    userAdmin.password = 'uchile'
    userAdmin.passwordConfirmation = 'uchile'
  })

  it('should allow a POST to /auth', async function () {
    const res = await request.post('/auth').send(userAdmin)
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

  describe('With a valid access token', function () {

    it('should allow a GET from /users/:userId', async function () {
      const res = await request
        .get(`/users/${firstUserIdTest}`)
        .auth(accessToken, { type: 'bearer' })
        .send()

      expect(res.status).to.equal(200)
      expect(res.body).not.to.be.empty
      expect(res.body).to.be.an('Object')
      expect(res.body._id).to.be.a('string')
      expect(res.body._id).to.equal(firstUserIdTest)
      expect(res.body.email).to.equal(userAdmin.email)
    })



    // it('should disallow a GET to /users', async function () {
    //   const res = await request
    //     .get('/users')
    //     .set({ authorization: `Bearer ${accessToken}3` })
    //     .send()
    //   expect(res.status).to.equal(403)
    // })

    // it('should disallow a PATCH to /users/:userId', async function () {
    //   const res = await request
    //     .patch(`/users/${firstUserIdTest}`)
    //     .set({ Authorization: `Bearer ${accessToken}` })
    //     .send({
    //       firstName: newFirstName
    //     })
    //   expect(res.status).to.equal(403)
    // })

    // it('should disallow a PUT to /users/:userId with an nonexistent ID', async function () {
    //   const res = await request
    //     .put('/users/i-do-not-exist')
    //     .set({ Authorization: `Bearer ${accessToken}` })
    //     .send({
    //       email: firstUserBody.email,
    //       password: firstUserBody.password,
    //       firstName: 'Marcos',
    //       lastName: 'Silva',
    //       permissionFlags: 256
    //     })
    //   expect(res.status).to.equal(404)
    // })

    // it('should disallow a PUT to /users/:userId trying to change the permission role', async function () {
    //   const res = await request
    //     .put(`/users/${firstUserIdTest}`)
    //     .set({ Authorization: `Bearer ${accessToken}` })
    //     .send({
    //       email: firstUserBody.email,
    //       password: firstUserBody.password,
    //       firstName: 'Marcos',
    //       lastName: 'Silva',
    //       role: "admin"
    //     })
    //   expect(res.status).to.equal(400)
    // })

    it('should allow a PUT to /users/:userId/role/:role for change the permission role', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}/role/admin`)
        .auth(accessToken, { type: 'bearer' })
        .send()
      expect(res.status).to.equal(204)
    })

    it('should allow a PUT to /users/:userId to change different fields', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}`)
        .auth(accessToken, { type: 'bearer' })
        .send({
          email: userAdmin.email,
          password: userAdmin.password,
          passwordConfirmation: userAdmin.password,
          firstName: newFirstName2,
          lastName: newLastName2,
          role: "admin"
        })

      expect(res.status).to.equal(204)
    })

    it('should allow a GET from /users/:userId and should have a new full name', async function () {
      const res = await request
        .get(`/users/${firstUserIdTest}`)
        .auth(accessToken, { type: 'bearer' })
        .send()

      expect(res.status).to.equal(200)
      expect(res.body).not.to.be.empty
      expect(res.body).to.be.an('object')
      expect(res.body._id).to.be.a('string')
      expect(res.body.firstName).to.equal(newFirstName2)
      expect(res.body.lastName).to.equal(newLastName2)
      expect(res.body.email).to.equal(userAdmin.email)
      expect(res.body._id).to.equal(firstUserIdTest)
    })

    it('should allow a POST to /users second user', async function () {
      const res = await request.post('/users')
        .send(firstUserBody)
      expect(res.status).to.equal(201)
      expect(res.body).not.to.be.empty
      expect(res.body).to.be.an('Object')
      expect(res.body.id).to.be.a('string')
      expect(res.body.verificationCode).to.be.a('string')
      secondUserIdTest = res.body.id
      verificationCode = res.body.verificationCode
    })

    it('should allow a DELETE from /users/:userId', async function () {
      const res = await request
        .delete(`/users/${secondUserIdTest}`)
        .auth(accessToken, { type: 'bearer' })
        .send()
      expect(res.status).to.equal(204)
    })

    it('should allow a SIGN OFF from /auth/sign-off', async function () {
      const res = await request
        .post(`/auth/sign-off`)
        .auth(accessToken, { type: 'bearer' })
        .send({ email: userAdmin.email })
      expect(res.status).to.equal(204)
    })

  })

})
