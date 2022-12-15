import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'
import { after } from 'mocha'

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
let activeYear: number
let journals = Array()
let wosId: string


let firstPaperIdTest = ''
const newPaperBody = {
    "year": 2021,
    "codeWos": "WOS:000568731400017",
    "codeDoi": "10.1016\/j.jfoodeng.2020.110230",
    "typePaper": "Artículo",
    "journalName": "JOURNAL OF FOOD ENGINEERING",
    "journalVolume": 290,
    "title": "Manufacture of beta-chitin nano- and microparticles from jumbo squid pen (Dosidicus gigas) and evaluation of their effect on mechanical properties and water vapour permeability of polyvinyl alcohol\/chitosan films",
}

const importPapers = [
    {
        "year": 2021,
        "codeWos": "WOS:000687176700005",
        "codeDoi": "10.1021\/acschemneuro.0c00762",
        "typePaper": "Artículo",
        "journalName": "ACS CHEMICAL NEUROSCIENCE",
        "journalNumber": 16,
        "journalVolume": 12,
        "title": "Sex-Dependent Changes of miRNA Levels in the Hippocampus of Adrenalectomized Rats Following Acute Corticosterone Administration",
        'chapterPage': 10,
        'numberOfPages': 20,
        "initialPage": 2981,
        "endPage": 3001
    },
    {
        "year": 2021,
        "codeWos": "WOS:000613637800049",
        "codeDoi": "10.1039\/d0nj04680a",
        "typePaper": "Artículo",
        "journalName": "NEW JOURNAL OF CHEMISTRY",
        "journalNumber": 4,
        "journalVolume": 45,
        "title": "Influence of the Ni-II\/Mn-II ratio on the physical properties of heterometallic Ni2xMn(2-2x)P2S6 phases and potassium intercalates K0.8Ni2xMn(1.6-2x)P2S6 center dot 2H(2)O",
        "initialPage": 2175,
        "endPage": 2183
    },
    {
        "year": 2021,
        "codeWos": "WOS:000626476700034",
        "codeDoi": "10.1016\/j.jconrel.2020.11.019",
        "typePaper": "Artículo",
        "journalName": "JOURNAL OF CONTROLLED RELEASE",
        "journalNumber": 1,
        "journalVolume": 331,
        "title": "Intranasal delivery of interferon-beta-loaded nanoparticles induces control of neuroinflammation in a preclinical model of multiple sclerosis: A promising simple, effective, non-invasive, and low-cost therapy",
        "initialPage": 443,
        "endPage": 459
    },
    {
        "year": 2021,
        "codeWos": "WOS:000766602800001",
        "codeDoi": "10.4067\/s0717-97072021000405316",
        "typePaper": "Artículo",
        "journalName": "JOURNAL OF THE CHILEAN CHEMICAL SOCIETY",
        "journalNumber": 4,
        "journalVolume": 66,
        "title": "BRIEF STUDY ON THE DECOMPOSITION OF TETRAETHYLENE GLYCOL DIMETHYL ETHER (TEGDME) SOLVENT IN THE PRESENCE OF Li2O2 AND H2O2",
        "initialPage": 5316,
        "endPage": 5319
    },
    {
        "year": 2021,
        "codeWos": "WOS:000636121800001",
        "codeDoi": "10.1080\/15548627.2020.1797280",
        "typePaper": "Revisión",
        "journalName": "AUTOPHAGY",
        "journalNumber": 1,
        "journalVolume": 17,
        "title": "Guidelines for the use and interpretation of assays for monitoring autophagy (4th edition)",
        "initialPage": 1,
        "endPage": 382
    },
    {
        "year": 2021,
        "codeWos": "WOS:000670141700002",
        "codeDoi": "10.1016\/j.ejbt.2021.04.004",
        "typePaper": "Artículo",
        "journalName": "ELECTRONIC JOURNAL OF BIOTECHNOLOGY",
        "journalNumber": 1,
        "journalVolume": 52,
        "title": "Effects of elderflower extract enriched with polyphenols on antioxidant defense of salmon leukocytes",
        "initialPage": 13,
        "endPage": 20
    },
    {
        "year": 2021,
        "codeWos": "WOS:000603166200001",
        "codeDoi": "10.1111\/mmi.14667",
        "typePaper": "Artículo",
        "journalName": "MOLECULAR MICROBIOLOGY",
        "journalNumber": 6,
        "journalVolume": 115,
        "title": "Genome-wide analysis of in vivo CcpA binding with and without its key co-factor HPr in the major human pathogen group A Streptococcus",
        "initialPage": 1207,
        "endPage": 1228
    },
    {
        "year": 2021,
        "codeWos": "WOS:000629004400001",
        "codeDoi": "10.2147\/IJN.S260375",
        "typePaper": "Revisión",
        "journalName": "INTERNATIONAL JOURNAL OF NANOMEDICINE",
        "journalNumber": 1,
        "journalVolume": 16,
        "title": "The Influence of Size and Chemical Composition of Silver and Gold Nanoparticles on in vivo Toxicity with Potential Applications to Central Nervous System Diseases",
        "initialPage": 2187,
        "endPage": 2201
    },
    {
        "year": 2021,
        "codeWos": "WOS:000592138800001",
        "codeDoi": "10.1007\/s00217-020-03643-4",
        "typePaper": "Artículo",
        "journalName": "EUROPEAN FOOD RESEARCH AND TECHNOLOGY",
        "journalNumber": 2,
        "journalVolume": 247,
        "title": "Acylglycerol synthesis including EPA and DHA from rainbow trout (Oncorhynchus mykiss) belly flap oil and caprylic acid catalyzed by Thermomyces lanuginosus lipase under supercritical carbon dioxide",
        "initialPage": 499,
        "endPage": 511
    },
    {
        "year": 2021,
        "codeWos": "WOS:000716322100016",
        "codeDoi": "10.1016\/j.bpj.2021.09.026",
        "typePaper": "Artículo",
        "journalName": "BIOPHYSICAL JOURNAL",
        "journalNumber": 21,
        "journalVolume": 120,
        "title": "Single-molecule optical tweezers reveals folding steps of the domain swapping mechanism of a protein",
        "initialPage": 4809,
        "endPage": 4818
    },
    {
        "year": 2021,
        "codeWos": "WOS:000549654300001",
        "codeDoi": "10.1080\/15548627.2020.1782035",
        "typePaper": "Artículo",
        "journalName": "AUTOPHAGY",
        "journalNumber": 7,
        "journalVolume": 17,
        "title": "PKD2\/polycystin-2 induces autophagy by forming a complex with BECN1",
        "initialPage": 1714,
        "endPage": 1728
    },
]

const request: supertest.SuperAgentTest = supertest.agent(app)

after(async function () {
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

describe('PAPERS endpoints for admin role', function () {

    it('should not allow a GET to /papers without being logged in', async function () {
        const res = await request
            .get('/papers')
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

    it('Active year is created', async function () {
        const res = await request
            .post(`/years/createNewYear`)
            .auth(accessToken, { type: 'bearer' })
            .send()
        expect(res.status).to.equal(200)
        expect(res.body).not.to.be.empty
        expect(res.body).to.be.an('Object')
        expect(res.body.year).to.be.a('number')
        activeYear = Number(res.body.year)
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
                    year: 2021,
                    codeWos: "WOS:000568731400017",
                    codeDoi: "10.1016\/j.jfoodeng.2020.110230",
                    typePaper: "Artículo",
                    journalName: "JOURNAL OF FOOD ENGINEERING",
                    journalNumber: 11,
                    journalVolume: 290,
                    title: "Manufacture of beta-chitin nano- and microparticles from jumbo squid pen (Dosidicus gigas) and evaluation of their effect on mechanical properties and water vapour permeability of polyvinyl alcohol\/chitosan films",
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

        it('Saved Impact Factor and Quartiles for the journals from Journal Object', async () => {
            const res = await request
                .get(`/journals`)
                .auth(accessToken, { type: 'bearer' })
                .send()
            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty
            expect(res.body).to.be.an('Array')
            journals = res.body

            for (const journal of journals) {
                let impactFactor = Array()
                let quartile = Array()
                const resSearch = await request
                    .get(`/journals/search/${journal.name}`)
                    .auth(accessToken, { type: 'bearer' })
                    .send()
                expect(resSearch.status).to.equal(200)
                expect(resSearch.body).not.to.be.empty
                expect(resSearch.body).to.be.an('Object')
                expect(resSearch.body.wosId).to.be.a('string')

                wosId = resSearch.body.wosId

                const resBring = await request
                    .get(`/journals/bring/${wosId}/year/${activeYear}`)
                    .auth(accessToken, { type: 'bearer' })
                    .send()
                expect(resBring.status).to.equal(200)
                expect(resBring.body).not.to.be.empty
                expect(resBring.body).to.be.an('Object')

                impactFactor.push({ year: activeYear, value: Number(resBring.body.journal.jif) })
                quartile = resBring.body.journal.categories

                const newJournal = {
                    wosId: wosId,
                    name: journal.name,
                    impactFactor: impactFactor,
                    quartile: quartile
                }

                const resUpdate = await request
                    .put(`/journals/name/${journal.name}`)
                    .auth(accessToken, { type: 'bearer' })
                    .send(newJournal)
                expect(resUpdate.status).to.equal(204)

            }
        })



    })

})
