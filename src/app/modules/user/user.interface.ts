import { USER_ROLE } from './user.const';

export type TUser = {
  userId: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'author' | 'borrower';
  status: 'active' | 'block';
 
};
export type TUserForLogin = {
  email: string;
  password: string;
};

export type TUserExtends = Document &
  TUser & {
    comparePassword(candidatePassword: string): Promise<boolean>;
  };

export type Action = 'profile' | 'update-password';

export type TUserRole = keyof typeof USER_ROLE;

export type UserPayload = Partial<Record<keyof TUser, TUser[keyof TUser]>>;
