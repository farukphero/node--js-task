import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TLibrary } from './library.interface';
import { Library } from './library.model';
import { Book } from '../books/books.model';
import sanitizePayload from '../../middlewares/updateData';

const createLibraryIntoDB = async (payload: TLibrary) => {
  const existingBook = await Book.findById(payload.book);

  if (!existingBook) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Your selected book is not available',
    );
  }

  const newLibrary = await Library.create({
    ...payload,
    book: existingBook._id,
  });

  return newLibrary;
};

const getAllLibraryFromDB = async (query: Record<string, unknown>) => {
  const page = query.page ? +query.page : 1;
  const limit = query.limit ? +query.limit : 10;

  const skip = (page - 1) * limit;

  const libraries = await Library.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalBooks = await Library.countDocuments({});

  if (libraries.length === 0) {
    throw new Error('Libraries not found');
  }

  const totalPages = Math.ceil(totalBooks / limit);

  return {
    libraries,
    meta: {
      totalBooks,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
};

const getSingleLibraryFromDB = async (id: string) => {
  const existingLibrary = await Library.findById(id).populate({
    path: 'book',
    populate: {
      path: 'borrower',
    },
  });

  if (!existingLibrary) {
    throw new Error('Library not found');
  }

  return existingLibrary;
};

const updateMyLibraryDataIntoDB = async (
  id: string,
  payload: Partial<TLibrary>,
) => {
  const existingLibrary = await Library.findById(id);
  if (!existingLibrary) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Library not found');
  }

  const sanitizedData = sanitizePayload(payload);

  const updatedLibrary = await Library.findByIdAndUpdate(
    existingLibrary._id,
    { $set: sanitizedData },
    { upsert: true, new: true, runValidators: true },
  );

  if (!updatedLibrary) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Library update failed');
  }

  return updatedLibrary;
};

const deleteLibraryFromDB = async (id: string) => {
  const result = await Library.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Library not found by this Id.');
  }
  return result;
};

export const LibraryServices = {
  createLibraryIntoDB,
  getAllLibraryFromDB,
  getSingleLibraryFromDB,
  updateMyLibraryDataIntoDB,
  deleteLibraryFromDB,
};
