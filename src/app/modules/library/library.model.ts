import mongoose, { Schema, Model } from 'mongoose';

import { TLibrary } from './library.interface';

const librarySchema: Schema<TLibrary> = new Schema<TLibrary>(
  {
    book: [
      {
        type: Schema.ObjectId,
        ref: 'Book',
      },
    ],

    name: {
      type: String,
      required: [true, 'Library name is required'],
    },

    location: {
      type: String,
      required: [true, 'Library location is required'],
    },
  },
  {
    timestamps: true,
  },
);

export const Library: Model<TLibrary> = mongoose.model<TLibrary>(
  'Library',
  librarySchema,
);
