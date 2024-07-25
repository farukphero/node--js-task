import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';

import { User } from '../user/user.model';
import { TLibraryInventory } from './library-inventory.interface';
import { Book } from '../books/books.model';
import { Library } from '../library/library.model';

const createLibraryInventoryIntoDB = async (payload: TLibraryInventory) => {
  const existingBook = await Book.findById(payload.book);

  if (!existingBook) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Book not found');
  }
  const existingLibrary = await Library.findById(payload.library);

  if (!existingLibrary) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Library not found');
  }

  const borrowingList = await User.findByIdAndUpdate(
    existingLibrary._id,
    {
      $push: existingBook._id,
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
  createLibraryInventoryIntoDB,
  returnBorrowingFromDB,
};
