import { Router } from 'express';
import userRouter from './user-router';
import searchRouter from './search-router';


// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/users', userRouter);
baseRouter.use('/search', searchRouter);

// Export default.
export default baseRouter;
