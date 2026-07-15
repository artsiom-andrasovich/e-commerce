import { TCreateUser, TUpdateUser } from "@app/lib-shared-types";
import { ApiError, hashPassword } from "@utils";
import { Address, User } from "./model";

class UsersService {
  public async findById(userId: string) {
    const user = await User.findById(userId).select("-password").exec();
    if (!user) {
      throw ApiError.NotFound(`User with this id ${userId} does not exist`);
    }
    return user;
  }

  public async save(userData: TCreateUser) {
    const existingUser = await User.findOne({ email: userData.email }).exec();
    if (existingUser) {
      throw ApiError.Conflict(
        "User already exists",
      );
    }

    const { password, address, ...rest } = userData;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      ...rest,
      password: hashedPassword,
    });

    if (address) {
      const newAddress = await Address.create({
        ...address,
        userId: user._id,
      });
      user.addresses.push(newAddress._id);
      await user.save();
    }

    return await User.findById(user.id).select("-password").exec();
  }
  public async updateUserData(userId: string, dto: TUpdateUser) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true },
    ).exec();
    if (!updatedUser) {
      throw ApiError.NotFound(`User with this id ${userId} does not exist`);
    }
    return updatedUser;
  }

  public async delete(userId: string) {
    const deletedUser = await User.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      throw ApiError.NotFound(`User with this id ${userId} does not exist`);
    }
    return;
  }
}

export const usersService = new UsersService();
