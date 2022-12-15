import mongoose from 'mongoose'
import app from '../app'
import config from 'config'

export const mochaHooks = {
    beforeEach: async function () {
        await mongoose.connect(config.get('dbUri'))
    },
    afterAll: function () {
        app.close(async () => {
            await mongoose.connection.dropDatabase()
            await mongoose.connection.close()
        })
    }
};