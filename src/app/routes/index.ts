import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { BookRoutes } from '../modules/books/books.route';
import { LibraryRoutes } from '../modules/library/library.route';
import { BorrowerRoutes } from '../modules/borrower/borrower.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/',
    route: BookRoutes,
  },
  {
    path: '/',
    route: BorrowerRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/libraries',
    route: LibraryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
