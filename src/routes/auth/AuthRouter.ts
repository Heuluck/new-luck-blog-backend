import { Router } from "express";
import jetValidator from "jet-validator";
import Paths from "../../common/Paths";
import AuthRoutes from "./AuthRoutes";
import dbQuery from "@src/database/connection";
import { IRes } from "../types/express/misc";

// **** Variables **** //

const validate = jetValidator();

// ** Add UserRouter ** //

const authRouter = Router();

authRouter.post(
    Paths.Auth.REST,
    validate(["name", "string", "body"], ["password", "string", "body"]),
    AuthRoutes.Login
);

authRouter.post(
    Paths.Auth.Register,
    validate(["name", "string", "body"], ["password", "string", "body"], ["email", "string", "body"]),
    AuthRoutes.Register
);

authRouter.post(Paths.Auth.OAuth.Github, validate(["code", "string", "body"]), AuthRoutes.OAuthGithub);

// authRouter.post(
//     Paths.Auth.OAuth.Apple,
//     // validate(["code", "string", "body"]),
//     (_, res: IRes) => {
//         dbQuery(
//             "INSERT INTO users (id, name, type, email, created_at, avatar, github_id) SELECT NULL, 'heuluck', 'reader', 'foxmail', '2024-06-10 16:56:35', 's', 'd' WHERE NOT EXISTS(SELECT name FROM users WHERE name = 'heuluck')",
//             [],
//             (results, fields) => {
//                 return res.status(200).json({ code: 200, message: "注册成功", results,fields });
//             },
//             (err) => {
//                 return res.status(400).json({ code: 200, message: "注册成功", err });
//                 console.log(err);
//             }
//         );
//     }
// );

export default authRouter;
