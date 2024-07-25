import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BorrowingServices } from './borrower.service';

const createBorrowing = catchAsync(async (req: Request, res: Response) => {
  const result = await BorrowingServices.createBorrowerIntoDB(
    req.user,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'You are successfully borrowing this book.',
    data: result,
  });
});
const returnBorrowing = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BorrowingServices.returnBorrowingFromDB(req.user, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'You are successfully return this book.',
    data: result,
  });
});

export const borrowingControllers = {
  createBorrowing,
  returnBorrowing
};
