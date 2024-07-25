import mongoose, { Schema, Model } from 'mongoose';

import { TLibraryInventory } from './library-inventory.interface';

const libraryInventorySchema: Schema<TLibraryInventory> =
  new Schema<TLibraryInventory>(
    {
      book: {
        type: Schema.ObjectId,
      },
      library: {
        type: Schema.ObjectId,
      },
    },
    {
      timestamps: true,
    },
  );

export const LibraryInventory: Model<TLibraryInventory> =
  mongoose.model<TLibraryInventory>('LibraryInventory', libraryInventorySchema);
