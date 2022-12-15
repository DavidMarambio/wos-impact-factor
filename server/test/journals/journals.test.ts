import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

let journalID = ''
const newJournalBody = {
    wosId: 'J_SCI_FOOD_AGR',
    name: "JOURNAL OF THE SCIENCE OF FOOD AND AGRICULTURE"
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

describe('JOURNALS endpoints for admin role', function () {

    it('should not allow a GET to /journals without being logged in', async function () {
        const res = await request
            .get('/journals')
            .send()
        expect(res.status).to.equal(401)
    })

    it('A user with admin role is created', async function () {
        const res = await request
          .post('/users')
          .send(userAdmin)
        expect(res.status).to.equal(201)
        expect(res.body).not.to.be.empty
        expect(res.body).to.be.an('Object')
        expect(res.body.id).to.be.a('string')
        expect(res.body.verificationCode).to.be.a('string')
        adminUserId = res.body.id
        verificationCode = res.body.verificationCode
      })
    
      it('User admin is verified', async function () {
        const res = await request
          .post(`/users/verify/${adminUserId}/${verificationCode}`)
          .send({})
        expect(res.status).to.equal(200)
      })
    
      it('Login with the user admin', async function () {
        const res = await request.post('/auth').send(userAdmin)
        expect(res.status).to.equal(200)
        expect(res.body).not.to.be.empty
        expect(res.body).to.be.an('Object')
        expect(res.body.accessToken).to.be.a('string')
        expect(res.body.refreshToken).to.be.a('string')
        accessToken = res.body.accessToken
      })

    describe('With a valid access token', function () {

        it('should allow a POST to /journals', async function () {
            const res = await request.post('/journals')
                .auth(accessToken, { type: 'bearer' })
                .send(newJournalBody)

            expect(res.status).to.equal(201)
            expect(res.body).not.to.be.empty
            expect(res.body).to.be.an('Object')
            expect(res.body.id).to.be.a('string')
            journalID = res.body.id
        })

        it('should allow a GET from /journals/:journalId', async function () {
            const res = await request
                .get(`/journals/${journalID}`)
                .auth(accessToken, { type: 'bearer' })
                .send()

            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty
            expect(res.body).to.be.an('Object')
            expect(res.body._id).to.be.a('string')
            expect(res.body._id).to.equal(journalID)
            expect(res.body.name).to.equal(newJournalBody.name)
        })

        it('should allow a PUT to /journals/name/:name', async function () {
            const res = await request
                .put(`/journals/name/${newJournalBody.name}`)
                .auth(accessToken, { type: 'bearer' })
                .send({
                    wosId: newJournalBody.wosId,
                    name: newJournalBody.name,
                    impactFactor: [
                        {
                            year: 2016,
                            value: Number("2.463")
                        }
                    ],
                    quartile: [
                        {
                            year: 2016,
                            area: "AGRICULTURE, MULTIDISCIPLINARY",
                            ranking: "4/56",
                            quartile: "Q1",
                            percentile: Number("93.75")
                        },
                        {
                            year: 2016,
                            area: "FOOD SCIENCE & TECHNOLOGY",
                            ranking: "30/130",
                            quartile: "Q1",
                            percentile: Number("77.308")
                        },
                        {
                            year: 2016,
                            area: "CHEMISTRY, APPLIED",
                            ranking: "21/72",
                            quartile: "Q2",
                            percentile: Number("71.528")
                        }
                    ]
                })

            expect(res.status).to.equal(204)
        })

        it('should allow a DELETE from /journals/:journalId', async function () {
            const res = await request
                .delete(`/journals/${journalID}`)
                .auth(accessToken, { type: 'bearer' })
                .send()

            expect(res.status).to.equal(204)
        })

        it('Admin user logout', async function () {
            const res = await request
              .post(`/auth/sign-off`)
              .auth(accessToken, { type: 'bearer' })
              .send({ email: userAdmin.email })
            expect(res.status).to.equal(204)
          })
      
          it('Admin user is removed', async function () {
            const res = await request
              .delete(`/users/${adminUserId}`)
              .auth(accessToken, { type: 'bearer' })
              .send()
            expect(res.status).to.equal(204)
          })

    })

})
