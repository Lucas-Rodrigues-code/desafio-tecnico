import amqplib from "amqplib";
import jwt from "jsonwebtoken";

import { authRepository } from "../repositories/auth-repository.js";
import { CustomError } from "../error/index.js";

async function signUp(name, email, password) {
  const userWithEmailExist = await authRepository.findUserByEmail(email);
  if (userWithEmailExist) {
    throw new CustomError("this email already in use", "badRequest");
  }

  const user = await authRepository.signUp(name, email, password);
  await sendEmail(user.email);
  return user;
}

async function signIn(email, password) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new CustomError("User or password not found", "Unauthorized");
  }
  const isValid = user.password === password;
  if (!isValid) {
    throw new CustomError("User or password not found", "Unauthorized");
  }

  const token = generateToken(user);
  return token;
}

export const userService = {
  signUp,
  signIn,
};

async function sendEmail(email) {
  const queue = "email-queue";
  const conn = await amqplib.connect("amqp://rabbitmq:rabbitmq@localhost:5672");
  const userEmail = JSON.stringify({ email });
  // Sender
  const ch2 = await conn.createChannel();

  ch2.sendToQueue(queue, Buffer.from(userEmail));
}

function generateToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
