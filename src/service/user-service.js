import { User } from "../models/User.js";

function signUp(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

function findUserByEmail(email) {
  return User.findOne({
    email,
  });
}



export const userService = {
  signUp,
  findUserByEmail,
};
