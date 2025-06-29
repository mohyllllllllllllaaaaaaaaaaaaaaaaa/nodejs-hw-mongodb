import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/auth.js';
import { loginUserController, logoutUserController, refreshSessionController, registerUserController } from '../controllers/auth.js';
import { loginUserSchema } from '../validation/loginValidation.js';

const router = express.Router();
router.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post('/login',validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
export default router;