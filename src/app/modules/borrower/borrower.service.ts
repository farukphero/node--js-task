import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { TBorrower } from './borrower.interface';
import { User } from '../user/user.model';

const createBorrowingIntoDB = async (user: JwtPayload, borrowingId: TBorrower) => {
  const { email } = user;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const borrowingList = await User.findByIdAndUpdate(
    existingUser._id,
    {
      $push: { borrowingId },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return borrowingList;
};
const returnBorrowingFromDB = async (user: JwtPayload, borrowingId: string) => {
  const { email } = user;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const borrowingList = await User.findByIdAndUpdate(
    existingUser._id,
    {
      $pull: { borrowingId },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return borrowingList;
};

 
export const BorrowingServices = {
  createBorrowingIntoDB,
  returnBorrowingFromDB
};
