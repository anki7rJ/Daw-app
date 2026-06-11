import express from "express";
import { room, chats, getRoomBySlug } from "../controllers/roomController";
import { authMiddleware } from "../middleware/middleware";

const controllerRouter:express.Router = express.Router();

controllerRouter.post("/room", authMiddleware, room);
controllerRouter.get("/chats/:roomId", chats);
controllerRouter.get("/room/:slug",getRoomBySlug)

export default controllerRouter;