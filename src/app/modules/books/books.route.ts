import express from 'express';

import validateRequest from '../../middlewares/validateRequest';

import authorization from '../../middlewares/authorization';
import { bookValidations } from './books.validation';
import { bookControllers } from './books.controller';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

router
  .route('/books')
  .post(
    authorization(USER_ROLE.author),
    validateRequest(bookValidations.bookValidationSchema),

    bookControllers.createBook,
  )
  .get(bookControllers.getAllBook);

 
export const BookRoutes = router;
