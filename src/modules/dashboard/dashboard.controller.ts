import type { Request, Response } from "express";
import { getAllUsers } from "./dashboard.service";

export const getUsers = (req: Request, res: Response) => {
  const users = getAllUsers();
  res.json(users);
};