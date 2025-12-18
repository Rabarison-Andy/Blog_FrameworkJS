import express from 'express';

const router = express.Router()
const {
  register,
  login,
  getMe,
  updateMe,
  updatePassword
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

// Protéger toutes les routes suivantes
router.use(protect);

router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.patch('/updatePassword', updatePassword);

module.exports = router;