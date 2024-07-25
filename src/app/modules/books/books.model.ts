import mongoose, { Schema, Model } from 'mongoose';

import { TBook } from './books.interface';

const bookSchema: Schema<TBook> = new Schema<TBook>(
  {
    author: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    borrower: [
      {
        type: Schema.ObjectId,
        ref: 'Borrower',
      },
    ],
    library: [
      {
        type: Schema.ObjectId,
        ref: 'Library',
      },
    ],
    title: {
      type: String,
      required: [true, 'Title is required'],
    },

    author_name: {
      type: String,
      required: [true, 'Author name is required'],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Book: Model<TBook> = mongoose.model<TBook>('Book', bookSchema);
