import mongoose, { Schema, Model, Error } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUserExtends } from './user.interface';
import config from '../../config';

const userSchema: Schema<TUserExtends> = new Schema<TUserExtends>(
  {
    userId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },

    email: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
    },
    confirmPassword: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['author', 'borrower'],
    },
    status: {
      type: String,
      enum: ['active', 'block'],
      default: 'active',
    },
    borrowingId: [
      {
        type: Schema.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Ensure the passwords match
userSchema.pre('save', function (next) {
  if (!this.password && !this.confirmPassword) {
    return next(new Error('Please enter both password and confirm password'));
  }
  if (this.password !== this.confirmPassword) {
    return next(new Error('Passwords do not match'));
  }

  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
    (err: Error | undefined, hash: string) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      this.confirmPassword = '';
      next();
    },
  );
});

userSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate() as TUserExtends;

  if (update.password && update.confirmPassword) {
    if (update.password !== update.confirmPassword) {
      return next(new Error('Passwords do not match'));
    }

    try {
      const saltRounds = Number(config.bcrypt_salt_rounds);
      const hash = await bcrypt.hash(update.password, saltRounds);
      update.password = hash;
      update.confirmPassword = '';
    } catch (err) {
      if (isCastError(err)) {
        return next(err);
      }
    }
  }

  next();
});

userSchema.pre('find', function (next) {
  this.where({ status: { $ne: 'block' } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.where({ status: { $ne: 'block' } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { status: { $ne: 'block' } } });
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

function isCastError(error: unknown): error is Error.CastError {
  return (error as Error).name === 'CastError';
}

userSchema.set('toJSON', {
  transform: function (_doc, ret) {
    delete ret.password;
    delete ret.confirmPassword;
    return ret;
  },
});

export const User: Model<TUserExtends> = mongoose.model<TUserExtends>(
  'User',
  userSchema,
);
