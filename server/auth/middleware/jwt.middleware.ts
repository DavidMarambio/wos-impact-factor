import express from 'express'
import { verifyJwt } from '../../common/utils/jwt'

class JwtMiddleware {

  validJwtNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers.authorization) {
      try {
        const authorization = req.headers.authorization.split(' ')
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send()
        } else {
          res.locals.jwt = verifyJwt(authorization[1].toString(), "accessTokenPublicKey")
          return next()
        }
      } catch (error) {
        return res.status(403).send({ error: error })
      }
    } else {
      return res.status(401).send()
    }
  }
}
export default new JwtMiddleware()
