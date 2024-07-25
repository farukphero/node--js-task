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

export const LibraryRoutes = router;
