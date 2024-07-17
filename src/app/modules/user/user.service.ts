import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import { createToken, generateUserId } from './user.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import sanitizePayload from '../../middlewares/updateData';
import { isEmailValid } from './user.validation';

const createUserIntoDB = async (payload: TUser) => {
  const isAuthEmail = isEmailValid(payload.email);

  if (!isAuthEmail) {
    throw new Error('Enter a valid email address.');
  }

  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Email already exists.');
  }

  const newUser = await User.create({
    ...payload,
    userId: await generateUserId(),
  });

  const jwtPayload = {
    email: newUser.email,
    role: newUser.role,
    userId: newUser.userId,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    name: newUser.name,
    role: newUser.role,
    token: accessToken,
  };
};

const loginUserWithDB = async (payload: TUser) => {
  const { email, password } = payload;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new Error('User not found');
  }

  const isPasswordValid = await existingUser.comparePassword(
    password as string,
  );

  if (!isPasswordValid) {
    throw new Error('Invalid password!');
  }

  const jwtPayload = {
    email: existingUser.email,
    role: existingUser.role,
    userId: existingUser.userId,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    name: existingUser.name,
    role: existingUser.role,
    token: accessToken,
  };
};

const getSingleUserFromDB = async (user: JwtPayload) => {
  const { email } = user;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new Error('User not found');
  }

  return existingUser;
};



const updateMyProfileData = async (
  user: JwtPayload,
  payload: Partial<TUser>,
) => {
  const { email } = user;

  // Find the existing user by auth
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error('User not found');
  }

  if (payload?.password) {
    throw new Error("Password can't be changed here.");
  }

  const sanitizedData = sanitizePayload(payload);

  // Update the user, ensuring payload is not undefined
  const updatedUser = await User.findByIdAndUpdate(
    existingUser._id,
    { $set: sanitizedData, isCompleted: true },
    { upsert: true, new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new Error('User update failed');
  }

  return updatedUser;
};

const updatePasswordFromProfileData = async (
  user: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
) => {
  const { email } = user;
  const { oldPassword, newPassword, confirmPassword } = payload;
  const expiredAt = new Date();
  expiredAt.setMinutes(expiredAt.getMinutes() + 5);

  if (!email) {
    throw new Error('Unauthorized');
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new Error('User not found');
  }

  if (oldPassword) {
    const isPasswordValid = await existingUser.comparePassword(
      oldPassword as string,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password!');
    }
  }

  if (!newPassword || !confirmPassword) {
    throw new Error('Please enter password and confirm password');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const hasPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const updateUser = await User.updateOne(
    { _id: existingUser._id },
    {
      password: hasPassword,
      confirmPassword: '',
    },
    { new: true, runValidators: true },
  );

  return updateUser;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserServices = {
  createUserIntoDB,
  loginUserWithDB,

  getSingleUserFromDB,

  updateMyProfileData,
  updatePasswordFromProfileData,

  deleteUserFromDB,

 
};
