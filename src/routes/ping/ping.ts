import { Router } from "express";
import Paths from "../../common/Paths";
import { IReq, IRes } from "../types/express/misc";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

// ** Add UserRouter ** //

const pingRouter = Router();

// Get all users
pingRouter.get(Paths.Ping.Get, (_: IReq, res: IRes) => {
    return res.status(HttpStatusCodes.OK).json({ msg: "pong" });
});

// **** Export default **** //

export default pingRouter;