import express from 'express';
import { createUserForAgency, deleteUser, getUserById, loginUser, registerUser, updateUser } from '../controllers/userControllers.js';
import { authenticate } from '../middleware/auth.js';




const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/create-user', authenticate, createUserForAgency);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);



export default router;

