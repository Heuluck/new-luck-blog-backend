import { Router } from "express";
import Paths from '../common/Paths';
import pingRouter from "./ping/ping";
import blogRouter from "./blog/BlogRouter";

const apiRouter = Router();


apiRouter.use(Paths.Ping.Base, pingRouter);
apiRouter.use(Paths.Blog.Base, blogRouter);

export default apiRouter;