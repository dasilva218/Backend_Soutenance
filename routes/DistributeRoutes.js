import express from 'express';
import { createDistribution, deleteDistribution, getDistributionById, getDistributions, updateDistribution } from '../controllers/DistributionControllers.js';



const router = express.Router();


router.post('/', createDistribution);
router.get('/', getDistributions); 
router.get('/:id', getDistributionById); 
router.put('/:id', updateDistribution); 
router.delete('/:id', deleteDistribution); 

export default router;

