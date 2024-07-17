import { Types } from 'mongoose';

export type TLibrary = {
  author: Types.ObjectId;
  borrower: Types.ObjectId[];
  library: Types.ObjectId[];
  title: string;
  author_name: string;
  isAvailable: boolean;
  quantity: number;
};
