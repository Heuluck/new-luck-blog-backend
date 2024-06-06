import { Router } from "express";
import jetValidator from "jet-validator";
import Paths from "../../common/Paths";
import User from "@src/models/User";
import UserRoutes from "./BlogRoutes";

// **** Variables **** //

const validate = jetValidator();

const blogRouter = Router();

// blog/list
blogRouter.get(Paths.Blog.Get, UserRoutes.getAll);

// blog/:id
blogRouter.get(Paths.Blog.GetById, validate(["id", "number", "params"]), UserRoutes.getById);

// blog/article/:titleURL
blogRouter.get(Paths.Blog.GetByTitleURL, validate(["titleURL", "string", "params"]), UserRoutes.getByTitleURL);

export default blogRouter;
