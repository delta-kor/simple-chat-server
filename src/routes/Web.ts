import {Router} from 'express';

const router = Router();

import HomeController from '../controllers/Home';

router.get('/', HomeController.index)

export default router;