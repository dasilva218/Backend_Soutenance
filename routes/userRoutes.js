import express from 'express';
import { loginUser} from '../controllers/userControllers.js';




const router = express.Router();

//router.post('/register', registerUser);
router.post('/login', loginUser);




export default router;

