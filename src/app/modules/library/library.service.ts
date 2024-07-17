import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { TBook } from './library.interface';
import { Book } from './library.model';
import { User } from '../user/user.model';

const createBookIntoDB = async (author: JwtPayload, payload: TBook) => {
  const { email } = author;

  const existingAuthor = await User.findOne({ email });
  if (!existingAuthor) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not registered');
  }

  const newUser = await Book.create({
    ...payload,
    authorId: existingAuthor._id,
  });

  return newUser;
};

const getAllBookFromDB = async (query: Record<string, unknown>) => {
  const page = query.page ? +query.page : 1;
  const limit = query.limit ? +query.limit : 10;

  const skip = (page - 1) * limit;

  const books = await Book.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalBooks = await Book.countDocuments({});

  if (books.length === 0) {
    throw new Error('Users not found');
  }

  const totalPages = Math.ceil(totalBooks / limit);

  return {
    books,
    meta: {
      totalBooks,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
};

// const loginUserWithDB = async (payload: TUser) => {
//   const { email, password } = payload;

//   const existingUser = await User.findOne({ email });

//   if (!existingUser) {
//     throw new Error('User not found');
//   }

//   const isPasswordValid = await existingUser.comparePassword(
//     password as string,
//   );

//   if (!isPasswordValid) {
//     throw new Error('Invalid password!');
//   }

//   const jwtPayload = {
//     email: existingUser.email,
//     role: existingUser.role,
//     userId: existingUser.userId,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   return {
//     name: existingUser.name,
//     role: existingUser.role,
//     token: accessToken,
//   };
// };

const getSingleBookFromDB = async (id: string) => {
  const existingUser = await Book.findById(id)
    .populate('author')
    .populate('borrower')
    .populate('library');

  if (!existingUser) {
    throw new Error('User not found');
  }

  return existingUser;
};

// const getAllUserFromDB = async (query: Record<string, unknown>) => {
//   const page = query.page ? +query.page : 1;
//   const limit = query.limit ? +query.limit : 10;

//   const skip = (page - 1) * limit;

//   const users = await User.find({})
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   const totalUsers = await User.countDocuments({});

//   if (users.length === 0) {
//     throw new Error('Users not found');
//   }

//   const totalPages = Math.ceil(totalUsers / limit);

//   return {
//     users,
//     meta: {
//       totalUsers,
//       totalPages,
//       currentPage: page,
//       perPage: limit,
//     },
//   };
// };

// const updateMyProfileData = async (
//   user: JwtPayload,
//   payload: Partial<TUser>,
// ) => {
//   const { email } = user;

//   // Find the existing user by auth
//   const existingUser = await User.findOne({ email });
//   if (!existingUser) {
//     throw new Error('User not found');
//   }

//   if (payload?.password) {
//     throw new Error("Password can't be changed here.");
//   }

//   const sanitizedData = sanitizePayload(payload);

//   // Update the user, ensuring payload is not undefined
//   const updatedUser = await User.findByIdAndUpdate(
//     existingUser._id,
//     { $set: sanitizedData, isCompleted: true },
//     { upsert: true, new: true, runValidators: true },
//   );

//   if (!updatedUser) {
//     throw new Error('User update failed');
//   }

//   return updatedUser;
// };

// const updatePasswordFromProfileData = async (
//   user: JwtPayload,
//   payload: {
//     oldPassword: string;
//     newPassword: string;
//     confirmPassword: string;
//   },
// ) => {
//   const { email } = user;
//   const { oldPassword, newPassword, confirmPassword } = payload;
//   const expiredAt = new Date();
//   expiredAt.setMinutes(expiredAt.getMinutes() + 5);

//   if (!email) {
//     throw new Error('Unauthorized');
//   }

//   const existingUser = await User.findOne({ email });

//   if (!existingUser) {
//     throw new Error('User not found');
//   }

//   if (oldPassword) {
//     const isPasswordValid = await existingUser.comparePassword(
//       oldPassword as string,
//     );

//     if (!isPasswordValid) {
//       throw new Error('Invalid password!');
//     }
//   }

//   if (!newPassword || !confirmPassword) {
//     throw new Error('Please enter password and confirm password');
//   }

//   if (newPassword !== confirmPassword) {
//     throw new Error('Passwords do not match');
//   }

//   const hasPassword = await bcrypt.hash(
//     newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );

//   const updateUser = await User.updateOne(
//     { _id: existingUser._id },
//     {
//       password: hasPassword,
//       confirmPassword: '',
//     },
//     { new: true, runValidators: true },
//   );

//   return updateUser;
// };

// const deleteUserFromDB = async (id: string) => {
//   const result = await User.findByIdAndDelete(id);
//   return result;
// };

export const BookServices = {
  createBookIntoDB,
  getAllBookFromDB,
  getSingleBookFromDB,
};
