import HttpStatusCodes from "@src/common/HttpStatusCodes";
import CryptoJS from "crypto-js";
import dbQuery, { InsertResult } from "@src/database/connection";
import { IReq, IRes } from "../types/express/misc";
import { signJWT } from "@src/util/jwt";
import { User } from "../types/user";

// **** Functions **** //
async function Login(req: IReq<{ name: string; password: string }>, res: IRes) {
    const { name, password } = req.body;
    const SHA3Password = CryptoJS.SHA3(password, { outputLength: 256 }).toString().toUpperCase();
    await dbQuery(
        "SELECT * FROM users where name = ? and password = ? LIMIT 1;",
        [name, SHA3Password],
        (results) => {
            if (results.constructor === Array && results.length === 1) {
                const user: User = results[0] as User;
                signJWT({ id: user.id, name: user.name, email: user.email, type: user.type }, "1d").then(
                    (token) => {
                        return res.status(HttpStatusCodes.OK).json({ code: 200, message: "登录成功", token });
                    },
                    (err) => {
                        console.log(err);
                        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                            code: 500,
                            message: "[JWT ERROR] - Please check the logs",
                        });
                    }
                );
            } else {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({ code: 401, message: "用户名或密码错误" });
            }
        },
        (err) => {
            console.log(err.message);
            return res
                .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json({ code: 500, message: "[DATABASE ERROR] - Please check the logs" });
        }
    );
}

async function Register(req: IReq<{ name: string; password: string; email: string }>, res: IRes) {
    const { name, password, email } = req.body;
    if (name.trim() === "" || password.trim() === "" || email.trim() === "")
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ code: 400, message: "用户名、密码、邮箱不能为空" });
    else {
        const SHA3Password = CryptoJS.SHA3(password, { outputLength: 256 }).toString().toUpperCase();
        await dbQuery(
            `INSERT INTO users (id, name, password, type, email, created_at) SELECT NULL, ?, ?, ?, ?, ? WHERE NOT EXISTS(SELECT name FROM users WHERE name = ?);`,
            [name, SHA3Password, "reader", email, new Date(), name],
            (results) => {
                if (typeof results == "object") {
                    const insertResult: InsertResult = results as InsertResult;
                    if (insertResult.affectedRows === 1)
                        dbQuery(
                            "SELECT * FROM users where name = ? and password = ? LIMIT 1;",
                            [name, SHA3Password],
                            (results) => {
                                if (results.constructor === Array && results.length === 1) {
                                    const user: User = results[0] as User;
                                    signJWT(
                                        { id: user.id, name: user.name, email: user.email, type: user.type },
                                        "1d"
                                    ).then(
                                        (token) => {
                                            return res
                                                .status(HttpStatusCodes.OK)
                                                .json({ code: 200, message: "注册成功", token });
                                        },
                                        (err) => {
                                            console.log(err);
                                            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                                                code: 500,
                                                message: "[JWT ERROR] - Please check the logs",
                                            });
                                        }
                                    );
                                } else {
                                    return res
                                        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                                        .json({ code: 500, message: "[DATABASE ERROR - 1]" });
                                }
                            },
                            (err) => {
                                console.log(err.message);
                                return res
                                    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                                    .json({ code: 500, message: "[DATABASE ERROR - 2]" });
                            }
                        );
                    else return res.status(HttpStatusCodes.BAD_REQUEST).json({ code: 400, message: "用户名重复" });
                } else {
                    return res
                        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ code: 500, message: "[DATABASE ERROR - 3]" });
                }
            },
            (err) => {
                console.log(err.message);
                return res
                    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ code: 500, message: "[DATABASE ERROR - Fatal] - Please check the logs" });
            }
        );
    }
}

export default {
    Login,
    Register,
} as const;
