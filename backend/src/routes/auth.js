import express from 'express';
import {
  getMe,
  updateMe,
  updatePassword
} from '../controllers/userController.js';
import {
  register,
  login
} from '../controllers/authConttroller.js'

import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protéger toutes les routes suivantes
router.use(protect);

router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.patch('/updatePassword', updatePassword);

export default router;