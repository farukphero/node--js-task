import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookServices } from './books.service';

const createBook = catchAsync(async (req, res) => {
  const result = await BookServices.createBookIntoDB(req.user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book created successful.',
    data: result,
  });
});

const getAllBook = catchAsync(async (req, res) => {
  const result = await BookServices.getAllBookFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All books retrieves successful!',
    data: result,
  });
});

const getSingleBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookServices.getSingleBookFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book retrieve successful!',
    data: result,
  });
});

export const bookControllers = {
  createBook,
  getAllBook,
  getSingleBook,
};
