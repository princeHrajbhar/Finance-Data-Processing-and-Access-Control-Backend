import { User, IUser } from "../auth/auth.model.js";

export const createUser = async (payload: Partial<IUser>) => {
  return await User.create(payload);
};

export const getUsers = async () => {
  return await User.find();
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const updateUser = async (id: string, payload: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};