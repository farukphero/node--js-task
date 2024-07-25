import { Types } from 'mongoose';

export type TBook = {
  author: Types.ObjectId;
  borrower: Types.ObjectId[];
  library: Types.ObjectId[];
  title: string;
  author_name: string;
  isAvailable: boolean;
  quantity: number;
  image:  string
};
