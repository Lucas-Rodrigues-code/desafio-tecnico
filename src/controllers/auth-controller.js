import dotenv from "dotenv";

import { userService } from "../service/auth-service.js";

dotenv.config();

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await userService.signUp(name, email, password);

    res.status(201).send(user);
  } catch (error) {
    console.log("[ERROR SIGNUP]", error);
    if (error.name === "badRequest")
      return res
        .status(400)
        .send({ error: error.name, message: error.message });
    res.status(500).send({
      error: "InternalServerError",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const token = await userService.signIn(email, password);

    res.status(200).send({ token });
  } catch (error) {
    console.log("[ERROR SIGNIN]", error);
    if (error.name === "Unauthorized")
      return res.status(401).send({
        error: error.name,
        message: error.message,
      });
    res.status(500).send({
      error: "InternalServerError",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
