import { z } from 'zod';

const libraryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Library name is required',
    }),
    location: z.string({ required_error: 'Library location is required' }),
  }),
});

export const libraryValidations = {
  libraryValidationSchema,
};
