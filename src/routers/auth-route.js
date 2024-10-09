import express from "express";
import { signIn, signUp } from "../controllers/auth-controller.js";
import { validateBodyMiddleware } from "../middlewares/auth-middleware.js";
import { signSchema, UserSchema } from "../schemas/auth-schema.js";

const route = express.Router();

route.post("/signup", validateBodyMiddleware(UserSchema), signUp);
route.post("/signin", validateBodyMiddleware(signSchema), signIn);

export default route;
