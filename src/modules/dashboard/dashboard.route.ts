import { Router } from "express";
import { getUsers } from "./dashboard.controller";

const router = Router();

router.get("/", getUsers);

export default router;