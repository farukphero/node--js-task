import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LibraryServices } from './library.service';

const createLibrary = catchAsync(async (req: Request, res: Response) => {
  const result = await LibraryServices.createLibraryIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Library created successful.',
    data: result,
  });
});

const getAllLibraries = catchAsync(async (req: Request, res: Response) => {
  const result = await LibraryServices.getAllLibraryFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All libraries are retrieves successful!',
    data: result,
  });
});

const getSingleLibrary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LibraryServices.getSingleLibraryFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Library retrieved successful!',
    data: result,
  });
});

const updateMyLibraryData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LibraryServices.updateMyLibraryDataIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Library updated successful!',
    data: result,
  });
});

const deleteLibrary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await LibraryServices.deleteLibraryFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Library deleted successful!',
    data: result,
  });
});

export const libraryControllers = {
  createLibrary,
  getAllLibraries,
  getSingleLibrary,
  updateMyLibraryData,
  deleteLibrary
};
