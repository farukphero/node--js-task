import express from 'express';
import { userControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validation';
import { USER_ROLE, updateFunc } from './user.const';
import authorization from '../../middlewares/authorization';

const router = express.Router();

router
  .route('/register')
  .post(
    validateRequest(userValidations.userValidationSchema),
    userControllers.createUser,
  );

router
  .route('/login')
  .post(
    validateRequest(userValidations.userValidationSchemaForLogin),
    userControllers.loginUser,
  );

router
  .route('/single-user')
  .get(
    authorization(USER_ROLE.author, USER_ROLE.borrower),
    userControllers.getSingleUser,
  );

router
  .route('/:action(profile|update-password)')
  .put(
    authorization(USER_ROLE.author, USER_ROLE.borrower),
    validateRequest(userValidations.userUpdateValidationSchema),
    updateFunc,
  );

router
  .route('/:id')
  .delete(
    authorization(USER_ROLE.author, USER_ROLE.borrower),
    userControllers.deleteUser,
  );

export const UserRoutes = router;
