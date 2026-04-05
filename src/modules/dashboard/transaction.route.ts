import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createTransactionSchema } from "./transaction.validator.js";
import { createTransactionController } from "./transaction.controller.js";
import { getTransactionsController } from "./transaction.controller.js";
import { getTransactionByIdController } from "./transaction.controller.js";
import { deleteTransactionByIdController } from "./transaction.controller.js";

import { updateTransactionController } from "./transaction.controller.js";
import { updateTransactionSchema } from "./transaction.validator.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(createTransactionSchema),
  createTransactionController,
);

// ✅ GET Transactions
router.get("/", protect, getTransactionsController);
router.get("/:id", protect, getTransactionByIdController);
router.delete("/:id", protect, deleteTransactionByIdController);
router.patch(
  "/:id",
  protect,
  validate(updateTransactionSchema),
  updateTransactionController
);
export default router;
