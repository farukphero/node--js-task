import { z } from 'zod';

const bookValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    author_name: z.string({ required_error: 'Author name is required' }),

    quantity: z
      .number({ required_error: 'Quantity is required' })
      .min(1, 'Quantity must be at least 1 characters long'),
    image: z.string({ required_error: 'Image is required' }),
  }),
});

export const bookValidations = {
  bookValidationSchema,
};
