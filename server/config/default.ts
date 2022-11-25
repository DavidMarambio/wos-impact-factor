import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const PORT_HTTP = process.env.PORT || 3000
const USER = process.env.DB_USER || 'dev'
const PASS = process.env.DB_PASS || 'dev'
const HOST = process.env.DB_HOST || 'localhost'
const PORT = process.env.DB_PORT || 27017
const DB = process.env.DB_NAME || 'paper-wos-dev'
let stringConnection: string

if (USER === 'dev') {
    stringConnection = `mongodb://${HOST}:${PORT}/${DB}`
} else {
    stringConnection = `mongodb://${USER}:${PASS}@${HOST}:${PORT}/${DB}`
}

export default {
    port: PORT_HTTP,
    dbUri: stringConnection,
    logLevel: "info",
    accessTokenTtl: "15m",
    refreshTokenTtl: "1y",
    smtp: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
    },
};