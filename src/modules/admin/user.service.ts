import mongoose from "mongoose";
import { User } from "../auth/auth.model";
import { AppError, ErrorCode } from "../../errors/AppError.js";

export const updateUserRoleService = async (
  adminUserId: string,
  targetUserId: string,
  role: string
) => {
  // ✅ Validate ID
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new AppError(
      "Invalid user ID",
      400,
      ErrorCode.VALIDATION_ERROR
    );
  }

  const user = await User.findById(targetUserId);

  if (!user) {
    throw new AppError(
      "User not found",
      404,
      ErrorCode.USER_NOT_FOUND
    );
  }

  // 🔥 Prevent admin from changing their own role (optional but recommended)
  if (adminUserId === targetUserId) {
    throw new AppError(
      "You cannot change your own role",
      400,
      ErrorCode.FORBIDDEN
    );
  }

  user.role = role as any;

  await user.save();

  return user;
};