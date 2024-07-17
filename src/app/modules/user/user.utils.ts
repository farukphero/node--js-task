import { User } from './user.model';

import jwt from 'jsonwebtoken';

const findLastUserId = async () => {
  const lastUser = await User.findOne({ userId: { $exists: true } })
    .sort({ userId: -1 })
    .select('userId')
    .lean();

  return lastUser?.userId ? lastUser.userId.substring(4) : undefined;
};

export const generateUserId = async () => {
  const currentId = (await findLastUserId()) || (0).toString();

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `MUI-${incrementId}`;

  return incrementId;
};

export const createToken = (
  jwtPayload: { email: string; role: string; userId: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};
