import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { libraryValidations } from './library.validation';
import { libraryControllers } from './library.controller';

const router = express.Router();

router
  .route('/')
  .post(
    validateRequest(libraryValidations.libraryValidationSchema),
    libraryControllers.createLibrary,
  )
  .get(libraryControllers.getAllLibraries);

router
  .route('/:id')
  .get(libraryControllers.getSingleLibrary)
  .put(libraryControllers.updateMyLibraryData)
  .delete(libraryControllers.deleteLibrary);
router
  .route('/:id/inventory')
  .post(libraryControllers.createInventoryLibrary)
  .get(libraryControllers.getBookListFromSpecificLibrary);

router
  .route('/:id/inventory/:bookId')
  .delete(libraryControllers.removeSpecificBookFromLibrary);

export const LibraryRoutes = router;
