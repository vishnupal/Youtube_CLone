import { googleAuth, signin, signup } from '../controllers/auth.js';
import express from 'express';

const router = express.Router();

//create user
router.post('/signup', signup);
//sign in
router.post('/signin', signin);

// google auth
router.post('/google', googleAuth);

export default router;
