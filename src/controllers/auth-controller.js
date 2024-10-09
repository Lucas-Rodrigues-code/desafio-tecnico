import { userService } from "../service/user-service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import amqplib from "amqplib";

dotenv.config();

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await userService.signUp(name, email, password);

    await sendEmail(user.email);
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "User or password not found" });
    }
    const isValid = user.password === password;
    if (!isValid) {
      return res.status(400).json({ message: "User or password not found" });
    }

    const token = generateToken(user);

    res.send({ token });
  } catch (error) {
    console.error(error, "Error logging in");
    res.status(500).send("Internal server error");
  }
}

function generateToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

async function sendEmail(email) {
  const queue = "email-queue";
  const conn = await amqplib.connect("amqp://rabbitmq:rabbitmq@localhost:5672");
  const userEmail = JSON.stringify({ email });
  // Sender
  const ch2 = await conn.createChannel();

  ch2.sendToQueue(queue, Buffer.from(userEmail));
}
