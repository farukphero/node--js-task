import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { TBorrower } from './borrower.interface';
import { User } from '../user/user.model';
import { Book } from '../books/books.model';

const createBorrowerIntoDB = async (user: JwtPayload, book: TBorrower) => {
  const { email } = user;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const existingBook = await Book.findById(book.book);

  if (!existingBook) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This book is not exist.');
  }

  const borrowerList = await Book.findByIdAndUpdate(
    existingBook._id,
    {
      $push: { borrower: existingUser._id },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return borrowerList;
};
const returnBorrowingFromDB = async (user: JwtPayload, id: string) => {
  const { email } = user;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const existingBook = await Book.findById(id);

  if (!existingBook?.borrower.includes(existingUser._id)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Borrow first to return.');
  }

  const borrowingList = await Book.findByIdAndUpdate(
    id,
    {
      $pull: { borrower: existingUser._id },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return borrowingList;
};

export const BorrowingServices = {
  createBorrowerIntoDB,
  returnBorrowingFromDB,
};
