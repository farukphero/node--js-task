import express from 'express';

import authorization from '../../middlewares/authorization';

import { USER_ROLE } from '../user/user.const';
import { borrowingControllers } from './borrower.controller';

const router = express.Router();

router
  .route('/borrow')
  .post(
    authorization(USER_ROLE.borrower),
    borrowingControllers.createBorrowing,
  );
router
  .route('/return/:id')
  .post(
    authorization(USER_ROLE.borrower),
    borrowingControllers.returnBorrowing,
  );

export const BorrowingRoutes = router;
