/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';

import catchAsync from '../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const authorization = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    if (!authHeader || !token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    const { role, auth, isVerified } = decoded;

    const user = await User.findOne({ auth });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'No user found.');
    }
    if (user.status === 'block') {
      throw new AppError(StatusCodes.CONFLICT, 'User is blocked.');
    }
    // if (!isVerified) {
    //   throw new AppError(StatusCodes.NOT_FOUND, 'You are not verified.');
    // }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default authorization;
