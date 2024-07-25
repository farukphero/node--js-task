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

const createInventoryLibrary = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await LibraryServices.createLibraryInventoryIntoDB(
      id,
      req.body,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Add a book to the inventory of a specific library successful.',
      data: result,
    });
  },
);
const getBookListFromSpecificLibrary = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await LibraryServices.getBookListFromSpecificLibrary(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Retrieve a list of books available in a specific library',
      data: result,
    });
  },
);
const removeSpecificBookFromLibrary = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bookId } = req.params;

    const result = await LibraryServices.removeSpecificBookFromLibrary(
      id,
      bookId,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Remove a book from the inventory of a specific library by its ID',
      data: result,
    });
  },
);

export const libraryControllers = {
  createLibrary,
  getAllLibraries,
  getSingleLibrary,
  updateMyLibraryData,
  deleteLibrary,
  createInventoryLibrary,
  getBookListFromSpecificLibrary,
  removeSpecificBookFromLibrary
};
