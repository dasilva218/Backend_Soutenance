// userRoutes.js

import express from 'express';
import { createUser, deleteUser, getUserById, loginUser, registerUser, updateUser } from '../controllers/userControllers.js';
import { authenticate, authorize } from '../middleware/auth.js';



const router = express.Router();

router.post('/', registerUser);
router.post('/', authenticate, authorize('admin'), createUser);
router.post('/', authenticate, authorize('admin', 'user'), loginUser);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);



export default router;

