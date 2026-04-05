import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createTransactionSchema } from "./transaction.validator.js";
import { createTransactionController } from "./transaction.controller.js";


const router = Router();

router.post(
  "/",
  protect,
  validate(createTransactionSchema),
  createTransactionController
);

export default router;