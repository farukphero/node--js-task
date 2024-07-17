import {   Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookServices } from './library.service';

const createBook = catchAsync(async (req: Request, res: Response) => {

  const result = await BookServices.createBookIntoDB(req.user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book created successful.',
    data: result,
  });
});

const getAllBook = catchAsync(async (req: Request, res: Response) => {

  const result = await BookServices.getAllBookFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All books retrieves successful!',
    data: result,
  });
});


 

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params
  const result = await BookServices.getSingleBookFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book retrieve successful!',
    data: result,
  });
});
// const getAllUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await UserServices.getAllUserFromDB(req.query);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Get all user successful!',
//     data: result,
//   });
// });

// const updateMyProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const data = req.body;

//     const result = await UserServices.updateMyProfileData(req.user, data);

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'User update successful!',
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// const updatePasswordFromProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const data = req.body;

//     const result = await UserServices.updatePasswordFromProfileData(
//       req.user,
//       data,
//     );

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'Password update successful!',
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteUser = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;

//   const result = await UserServices.deleteUserFromDB(id as string);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'User delete successful!',
//     data: result,
//   });
// });

export const bookControllers = {
  createBook,
  getAllBook,
  getSingleBook
};
