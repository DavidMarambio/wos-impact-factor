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
        user: "maryse.reilly89@ethereal.email",
        pass: "dTybSvCbZNR4yVYyPQ",
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
    },
};