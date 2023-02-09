import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { UserModel, Role } from "../models/user-model";
import dotenv from "dotenv";
import ErrorModel from "../models/errorModel";
dotenv.config();

const register = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user = request.body;
  const isAdmin = process.env.ADMINS.includes(user.email);
  user.role = isAdmin ? Role.ADMIN : Role.COSTUMER;
  const newUser = new UserModel(
    await {
      _id: new mongoose.Types.ObjectId(),
      ...user,
    }
  );
  return newUser
    .save()
    .then((user) => response.status(201).json(user))
    .catch((err) => next(err));
};

const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user = request.body;
  return UserModel.findOne({ email: user.email, password: user.password })
    .then((user) => {
      if (user) response.status(200).json(user);
      else throw new ErrorModel(401, "wrong details !");
    })
    .catch((err) => next(err));
};

const getUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.id;
  return UserModel.findOne({ id_number: userId })
    .then((user) => {
      if (user) response.status(200).json(user);
      else throw new ErrorModel(401, "user not found");
    })
    .catch((err) => next(err));
};

const getAllUsers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  return UserModel.find()
    .then((users) =>
      users
        ? response.status(200).json(users)
        : response.status(200).json({ message: "not found" })
    )
    .catch((err) => next(err));
};

const updateUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.id;
  return UserModel.findOne({ id_number: userId })
    .then((user) => {
      if (user) {
        user.set(request.body);
        return user
          .save()
          .then((user) => response.status(201).json(user))
          .catch((err) => next(err));
      } else {
        response.status(404).json({ message: "not found" });
      }
    })
    .catch((err) => next(err));
};

const deleteUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.id;
  return UserModel.deleteOne({ id_number: userId })
    .then((user) =>
      user
        ? response.status(201).json({ message: "deleted" })
        : response.status(404).json({ message: "not found" })
    )
    .catch((err) => next(err));
};

export default {
  getUser,
  getAllUsers,
  register,
  login,
  updateUser,
  deleteUser,
};
