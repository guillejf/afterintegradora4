import express from "express";
export const usersApiRouter = express.Router();
import { usersController } from "../controllers/users.controller.js";

usersApiRouter.get("/", usersController.read);
usersApiRouter.put("/:_id", usersController.update);
usersApiRouter.delete("/:_id", usersController.delete);
usersApiRouter.get("/premium/:uid", usersController.premiumSwitch);
