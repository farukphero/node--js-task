import { z } from 'zod';

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const userValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .refine((email) => isEmailValid(email), {
        message: 'Enter a valid email address.',
      }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, 'Confirm Password must be at least 6 characters long'),
    role: z.enum(['author', 'borrower']),
    status: z.enum(['active', 'block']).default('active'),
  }),
});
const userValidationSchemaForLogin = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .refine((email) => isEmailValid(email), {
        message: 'Enter a valid email address.',
      }),

    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

const userUpdateValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .optional(),
    email: z
      .string()
      .trim()
      .refine((auth) => isEmailValid(auth), {
        message: 'Enter a valid email address.',
      })
      .optional(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .optional(),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters long')
      .optional(),
  }),
});

export const userValidations = {
  userValidationSchema,
  userValidationSchemaForLogin,
  userUpdateValidationSchema,
};
