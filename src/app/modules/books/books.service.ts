import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { TBook } from './books.interface';
import { Book } from './books.model';
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

 

export const BookServices = {
  createBookIntoDB,
  getAllBookFromDB,
  getSingleBookFromDB,
};
