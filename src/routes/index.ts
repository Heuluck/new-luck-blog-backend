import { Router } from "express";
import Paths from "../common/Paths";
import pingRouter from "./ping/ping";
import blogRouter from "./blog/BlogRouter";
import authRouter from "./auth/AuthRouter";
import cors from "cors";

const apiRouter = Router();

apiRouter.use(cors());

apiRouter.use(Paths.Ping.Base, pingRouter);
apiRouter.use(Paths.Blog.Base, blogRouter);
apiRouter.use(Paths.Auth.Base, authRouter);

export default apiRouter;
