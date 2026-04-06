import { Router } from "express";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createTransactionSchema } from "./transaction.validator.js";
import {
  createTransactionController,
  getTransactionsController,
  getTransactionByIdController,
  deleteTransactionByIdController,
  updateTransactionController
} from "./transaction.controller.js";
import { updateTransactionSchema } from "./transaction.validator.js";

const router = Router();

router.use(protect, authorize("admin"));

router.post(
  "/",
  validate(createTransactionSchema),
  createTransactionController
);

router.get("/", getTransactionsController);

router.get("/:id", getTransactionByIdController);

router.delete("/:id", deleteTransactionByIdController);

router.patch(
  "/:id",
  validate(updateTransactionSchema),
  updateTransactionController
);

export default router;