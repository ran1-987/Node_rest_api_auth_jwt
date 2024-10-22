import express from 'express';
import { AuthController } from '../controllers/authController.js';
import {ensureAuthenticated} from '../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/logout', ensureAuthenticated, AuthController.logout);

export default router;
