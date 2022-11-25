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
          res.locals.user = verifyJwt(authorization[1].toString(), "accessTokenPublicKey")
          return res.locals.user._id ?
            next() :
            res.status(403).send({ message: "Not verify" })
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
