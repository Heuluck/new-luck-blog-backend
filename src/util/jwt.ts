import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";

export const signJWT = (payload: JwtPayload, expiresIn: string): Promise<string> => {
    const privateKey = fs.readFileSync("./env/private.key");
    return new Promise((resolve, reject) => {
        jwt.sign(payload, privateKey, { algorithm: "ES256", expiresIn }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token!);
            }
        });
    });
};

export const verifyJWT = (token: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const cert = fs.readFileSync("./env/public.pem"); // get public key
        try {
            jwt.verify(token, cert, function (err, decoded) {
                if (err) {
                    console.log("Err2or: ", err);
                    reject(err);
                } else {
                    resolve(JSON.stringify(decoded)!);
                }
            });
        } catch (err) {
            console.log("Error: ", err);
            reject(err);
        }
    });
};
