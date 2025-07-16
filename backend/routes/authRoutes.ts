import express from 'express';
import { signup, login } from '../functions/auth';

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

export default router;