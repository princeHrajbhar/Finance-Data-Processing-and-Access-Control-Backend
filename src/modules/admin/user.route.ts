import { Router } from "express";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateUserRoleSchema } from "./user.validator.js";
import { updateUserRoleController } from "./user.controller.js";

const router = Router();

// ✅ PATCH role (admin only)
router.patch(
  "/:id/role",
  protect,
  authorize("admin"), // 🔥 ONLY ADMIN
  validate(updateUserRoleSchema),
  updateUserRoleController
);

export default router;