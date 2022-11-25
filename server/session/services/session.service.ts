import { CRUD } from "../../common/interfaces/crud.interface";
import sessionsDao from "../dao/sessions.dao";
import { CreateSessionDto } from "../dto/create.session.dto";
import { omit } from "lodash";
import { DocumentType } from "@typegoose/typegoose";
import { privateFields, User } from "../../models/User.model";
import { signJwt } from "../../common/utils/jwt";

class SessionService implements CRUD {
    async create(resource: CreateSessionDto) {
        return await sessionsDao.addSession(resource)
    }

    async readById(id: string) {
        return await sessionsDao.getSessionsById(id)
    }

    async readBySession(session: string) {
        return await sessionsDao.getSessionByUser(session)
    }

    async signRefreshToken(userId: string) {
        const session = await this.create({ user: userId })
        return signJwt({ session: session?._id }, "refreshTokenPrivateKey", { expiresIn: "1y" })
    }

    async signAccessToken(user: DocumentType<User>) {
        const payload = omit(user.toJSON(), privateFields)
        return signJwt(payload, "accessTokenPrivateKey", { expiresIn: "15m" })
    }

    async deleteById(id: string) {
        return await sessionsDao.removeSessionById(id)
    }

    async deleteByUser(idUser: string) {
        return await sessionsDao.removeSessionsByUser(idUser)
    }

    list: (limit: number, page: number) => Promise<any>;
    putById: (id: string, resource: any) => Promise<any>;
    patchById: (id: string, resource: any) => Promise<any>;

}

export default new SessionService()