import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service.js";

interface IdParam {
  id: string;
}

// CREATE
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// GET ALL
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// GET ONE
export const getUser = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateUser = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteUser = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};