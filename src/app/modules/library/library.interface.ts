import { Types } from 'mongoose';

export type TLibrary = {
  book: Types.ObjectId[];
  name: string;
  location: string;
   
};
