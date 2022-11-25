import express from 'express'
import debug from 'debug'
import sessionService from '../services/session.service'
import { InputSessionDto } from '../dto/input.session.dto'
import userModel from '../../models/User.model'
import { get } from 'lodash'
import { verifyJwt } from '../../common/utils/jwt'
import usersService from '../../users/services/users.service'

const log: debug.IDebugger = debug('app:sessions-controller')

class SessionController {
    async getSessionById(req: express.Request, res: express.Response) {
        const session = await sessionService.readById(req.body.userId)
        res.status(200).send(session)
    }

    async createSession(req: express.Request, res: express.Response) {
        const userId = await sessionService.create(req.body)
        res.status(201).send({ id: userId })
    }

    async closeSession(req: express.Request, res: express.Response) {
        try {
            const user = await usersService.getUserByEmail(req.body.email)
            if (user) {
                const response = await sessionService.deleteByUser(user._id.toString())
                return res.status(204).send({ response })
            }
            return res.status(400).send({ message: "User is not registered" })
        } catch (error) {
            res.status(400).send({ message: error })
        }
    }

    async createSessionHandler(req: express.Request<{}, {}, InputSessionDto>, res: express.Response) {
        const message = "Invalid email or password"
        const { email, password } = req.body
        try {
            const user = await userModel.findOne({ email }).exec()
            if (user) {
                if (!user.verified) return res.status(400).send("Please verify your email")
                const isValid = await user.validatePassword(password)
                if (!isValid) return res.status(400).send(message)
                const accessToken = await sessionService.signAccessToken(user)
                const refreshToken = await sessionService.signRefreshToken(user._id.toString())
                return res.status(200).send({ accessToken, refreshToken })
            } else {
                return res.status(400).send(message)
            }
        } catch (error) {
            res.status(400).send({ message: error, body: req.body })
        }
    }

    async refreshAccessTokenHandler(req: express.Request, res: express.Response) {
        const refreshToken = get(req, "headers.x-refresh")
        if (refreshToken) {
            const decoded = verifyJwt<{ session: string }>(refreshToken.toString(), "refreshTokenPublicKey")
            if (!decoded) return res.status(401).send("Could not refresh access token")
            const session = await sessionService.readBySession(decoded.session)
            if (!session || !session.valid) return res.status(401).send("Could not refresh access token")
            const user = await userModel.findById(session.user?.toString())
            if (!user) return res.status(401).send("Could not refresh access token")
            const accessToken = await sessionService.signAccessToken(user)
            return res.status(200).send({ accessToken: accessToken })
        }
    }
}

export default new SessionController()