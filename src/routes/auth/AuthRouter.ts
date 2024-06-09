import { Router } from "express";
import jetValidator from "jet-validator";
import Paths from "../../common/Paths";
import AuthRoutes from "./AuthRoutes";

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

export default authRouter;
