import jwt from "jsonwebtoken";
import fs from 'fs'

const accessPrivate = fs.readFileSync(__dirname + '/../../certs/accessPrivate.pem')
const accessPublic = fs.readFileSync(__dirname + '/../../certs/accessPublic.pem')
const refreshPrivate = fs.readFileSync(__dirname + '/../../certs/refreshPrivate.pem')
const refreshPublic = fs.readFileSync(__dirname + '/../../certs/refreshPublic.pem')

export function signJwt(
    object: Object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined
) {
    const signingKey = keyName === "accessTokenPrivateKey" ? accessPrivate : refreshPrivate

    return jwt.sign(object, signingKey, {
        ...(options && options),
        algorithm: "RS256",
    });
}

export function verifyJwt<T>(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
    const publicKey = keyName === "accessTokenPublicKey" ? accessPublic : refreshPublic
    try {
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    } catch (e) {
        //console.log({ message: "Token expired" });
        return null
    }
}