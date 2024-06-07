import { Router } from "express";
import jetValidator from "jet-validator";
import Paths from "../../common/Paths";
import User from "@src/models/User";
import UserRoutes from "../user/UserRoutes";
import { IRes } from "../types/express/misc";
import { IReq } from "../types/types";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { signJWT, verifyJWT } from "@src/util/jwt";

// **** Variables **** //

const validate = jetValidator();

// ** Add UserRouter ** //

const authRouter = Router();

// Get all users
authRouter.get(Paths.Auth.Get, (_: IReq, res: IRes) => {
    signJWT({ name: "test" }, "1d").then((token) => {
        return res.status(HttpStatusCodes.OK).json({ token });
    });
});

authRouter.post(Paths.Auth.Get, (req: IReq<{ token: string }>, res: IRes) => {
    const { token } = req.body;
    verifyJWT(token).then((token) => {
        return res.status(HttpStatusCodes.OK).json({ token });
    });
});

export default authRouter;
