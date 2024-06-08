import { Router } from "express";
import jetValidator from "jet-validator";
import Paths from "../../common/Paths";
import User from "@src/models/User";
import UserRoutes from "../user/UserRoutes";
import { IRes } from "../types/express/misc";
import { IReq } from "../types/types";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { signJWT, verifyJWT } from "@src/util/jwt";
import CryptoJS from "crypto-js";
import AuthRoutes from "./AuthRoutes";

// **** Variables **** //

const validate = jetValidator();

// ** Add UserRouter ** //

const authRouter = Router();

authRouter.get(Paths.Auth.REST, (_: IReq, res: IRes) => {
    signJWT({ name: "test" }, "1d").then((token) => {
        return res.status(HttpStatusCodes.OK).json({ token });
    });
});

authRouter.post(
    Paths.Auth.Register,
    validate(["name", "string", "body"], ["password", "string", "body"], ["email", "string", "body"]),
    AuthRoutes.Register
);

export default authRouter;
