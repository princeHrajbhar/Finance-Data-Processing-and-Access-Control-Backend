import { Request, Response, NextFunction } from "express";
import { updateUserRoleService } from "./user.service.js";
import { AppError, ErrorCode } from "../../errors/AppError.js";

export const updateUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new AppError("Unauthorized", 401, ErrorCode.TOKEN_INVALID)
      );
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return next(
        new AppError("Invalid ID", 400, ErrorCode.VALIDATION_ERROR)
      );
    }

    const { role } = req.body;

    const updatedUser = await updateUserRoleService(
      user.userId,
      id,
      role
    );

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};