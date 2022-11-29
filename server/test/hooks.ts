import mongoose from 'mongoose'
import app from '../app'
import config from 'config'

export const mochaHooks = {
    beforeEach: async function () {
        await mongoose.connect(config.get<string>('dbUri'))
    },

    afterAll: function () {
        // shut down the Express.js server, close our MongoDB connection, then tell Mocha we're done:
        app.close(async () => {
            await mongoose.connection.dropDatabase()
            await mongoose.connection.close()
        })
    }
};