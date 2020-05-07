import {Router} from 'express';
import SignupController from '../controllers/Api/Signup';

const router = Router();

router.post('/signup', SignupController.signup)

export default router;