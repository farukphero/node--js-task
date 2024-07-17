import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import { StatusCodes } from 'http-status-codes';
import { TUser } from './user.interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User registration successful.',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const user: Partial<TUser> = req.body;

  const result = await UserServices.loginUserWithDB(user as TUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successful!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getSingleUserFromDB(req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Get user successful!',
    data: result,
  });
});

const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    const result = await UserServices.updateMyProfileData(req.user, data);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User update successful!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updatePasswordFromProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    const result = await UserServices.updatePasswordFromProfileData(
      req.user,
      data,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Password update successful!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserServices.deleteUserFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User delete successful!',
    data: result,
  });
});

export const userControllers = {
  getSingleUser,
  createUser,
  loginUser,

  updateMyProfile,
  updatePasswordFromProfile,
  deleteUser,

 
};
