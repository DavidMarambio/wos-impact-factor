import express from 'express'
import { AnyZodObject } from 'zod'

class BodyValidationMiddleware {
  verifiBodyFieldsErrors =
    (schema: AnyZodObject) =>
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        try {
          schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
          })
          next()
        } catch (e: any) {
          return res.status(404).send({ message: e.errors })
        }
      };

}
export default new BodyValidationMiddleware()
