import express from 'express';

import validateRequest from '../../middlewares/validateRequest';

import authorization from '../../middlewares/authorization';
import { bookValidations } from './library.validation';
import { bookControllers } from './library.controller';
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

// router
//   .route('/login')
//   .post(
//     validateRequest(userValidations.userValidationSchemaForLogin),
//     userControllers.loginUser,
//   );

// router
//   .route('/single-user')
//   .get(
//     authorization(USER_ROLE.author, USER_ROLE.borrower),
//     userControllers.getSingleUser,
//   );
// router.route('/get/all/user').get(userControllers.getAllUser);

// router
//   .route('/:action(profile|update-password)')
//   .put(
//     authorization(USER_ROLE.author, USER_ROLE.borrower),
//     validateRequest(userValidations.userUpdateValidationSchema),
//     updateFunc,
//   );

// router
//   .route('/:id')
//   .delete(
//     authorization(USER_ROLE.author, USER_ROLE.borrower),
//     userControllers.deleteUser,
//   );

export const BookRoutes = router;
