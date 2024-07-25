import { Types } from 'mongoose';

export type TLibraryInventory = {
  book: Types.ObjectId;
  library: Types.ObjectId;
};
