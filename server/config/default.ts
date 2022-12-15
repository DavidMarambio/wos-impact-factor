import { config as configDotenv } from 'dotenv'
import { resolve } from 'path'

let stringConnection: string
switch (process.env.NODE_ENV) {
    case "development":
        console.log("Environment is 'development'")
        configDotenv({
            path: resolve(__dirname, "../.env.development")
        })
        stringConnection = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        break
    case "test":
        configDotenv({
            path: resolve(__dirname, "../.env.test")
        })
        stringConnection = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        break
    case "production":
        // configDotenv({
        //     path: resolve(__dirname, "../.env.production")
        // })
        stringConnection = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        break
    default:
        throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`)
}

export default {
    port: process.env.PORT,
    dbUri: stringConnection,
    logLevel: "info",
    accessTokenTtl: "15m",
    refreshTokenTtl: "1y",
    clarivateToken: process.env.CLARIVATE_TOKEN,
    smtp: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
    },
};