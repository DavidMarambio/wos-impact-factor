import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../app'

let accessToken = ''
let adminUserId = ''
let firstPaperIdTest = ''
let verificationCode = ''
const newPaperBody = {
    year: 2016,
    codeWos: "asdasdasd",
    codeDoi: "asdasdasdasd",
    typePaper: "Artículo",
    journalName: "Nombre",
    title: "Título",
}
const userAdmin = {
    firstName: "David",
    lastName: "Marambio",
    email: 'david.marambios@uchile.cl',
    password: 'Sup3rSecret!23',
    passwordConfirmation: 'Sup3rSecret!23',
    role: "admin"
}
const importPapers = [
    {
        'year': 2016,
        'codeWos': "asdasdasd",
        'codeDoi': "asdasdasdasd",
        'typePaper': "Artículo",
        'journalName': "Nombre",
        'journalNumber': 11,
        'journalVolume': 1,
        'title': "Título",
        'chapterPage': 2,
        'numberOfPages': 22,
        'initialPage': 10,
        'endPage': 32
    },
    {
        'year': 2016,
        'codeWos': "rtyrtyrty",
        'codeDoi': "344erter",
        'typePaper': "Artículo",
        'journalName': "Nombre2",
        'journalNumber': 11,
        'journalVolume': 1,
        'title': "Título2",
        'chapterPage': 2,
        'numberOfPages': 22,
        'initialPage': 10,
        'endPage': 32
    }
]

let request: supertest.SuperAgentTest
request = supertest.agent(app)

describe('PAPERS endpoints for admin role', function () {

    it('should allow a POST to /users without being logged in', async function () {
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

    it('should allow a POST to /users/verify/:id/:verificationCode', async function () {
        const res = await request
            .post(`/users/verify/${adminUserId}/${verificationCode}`)
            .send({})
        expect(res.status).to.equal(200)
    })

    it('should not allow a GET to /papers without being logged in', async function () {
        const res = await request
            .get('/papers')
            .send()
        expect(res.status).to.equal(401)
    })

    it('should allow a POST to /auth', async function () {
        const res = await request.post('/auth').send(userAdmin)
        expect(res.status).to.equal(200)
        expect(res.body).not.to.be.empty
        expect(res.body).to.be.an('Object')
        expect(res.body.accessToken).to.be.a('string')
        expect(res.body.refreshToken).to.be.a('string')
        accessToken = res.body.accessToken
    })

    describe('With a valid access token', function () {

        it('should allow a POST to /papers', async function () {
            const res = await request.post('/papers')
                .auth(accessToken, { type: 'bearer' })
                .send(newPaperBody)

            expect(res.status).to.equal(201)
            expect(res.body).not.to.be.empty
            expect(res.body).to.be.an('Object')
            expect(res.body.id).to.be.a('string')
            firstPaperIdTest = res.body.id
        })

        it('should allow a GET from /papers/:paperId', async function () {
            const res = await request
                .get(`/papers/${firstPaperIdTest}`)
                .auth(accessToken, { type: 'bearer' })
                .send()

            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty
            expect(res.body).to.be.an('Object')
            expect(res.body._id).to.be.a('string')
            expect(res.body._id).to.equal(firstPaperIdTest)
            expect(res.body.title).to.equal(newPaperBody.title)
        })

        it('should allow a PUT to /papers/:paperId', async function () {
            const res = await request
                .put(`/papers/${firstPaperIdTest}`)
                .auth(accessToken, { type: 'bearer' })
                .send({
                    year: 2016,
                    codeWos: "asdasdasd",
                    codeDoi: "asdasdasdasd",
                    typePaper: "Artículo",
                    journalName: "Nombre",
                    journalNumber: 11,
                    journalVolume: 1,
                    title: "Título",
                    chapterPage: 2,
                    numberOfPages: 22,
                    initialPage: 10,
                    endPage: 32
                })

            expect(res.status).to.equal(204)
        })

        it('should allow a PATCH to /papers/:paperId', async function () {
            const res = await request
                .patch(`/papers/${firstPaperIdTest}`)
                .auth(accessToken, { type: 'bearer' })
                .send({
                    journalNumber: 12,
                    journalVolume: 5
                })

            expect(res.status).to.equal(204)
        })

        it('should allow a DELETE from /papers/:paperId', async function () {
            const res = await request
                .delete(`/papers/${firstPaperIdTest}`)
                .auth(accessToken, { type: 'bearer' })
                .send()

            expect(res.status).to.equal(204)
        })

        it('should allow IMPORT PAPERS in the route /papers/massive/import', async () => {
            const res = await request
                .post('/papers/massive/import')
                .auth(accessToken, { type: 'bearer' })
                .send(importPapers)

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
