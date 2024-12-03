import express from 'express';
import { createConsumptionReport, deleteConsumptionReport, getConsumptionReportById, getConsumptionReports, updateConsumptionReport, validateConsomptionReport } from '../controllers/ConsumptionReportsControllers.js';
import { authenticate, authorize } from '../middleware/auth.js';



const router = express.Router();

router.post('/', authenticate, createConsumptionReport);
router.get('/', authenticate, authorize(['admin', 'user']), getConsumptionReports );
router.get('/:id', authenticate, getConsumptionReportById);
router.put('/:id', authenticate, validateConsomptionReport, updateConsumptionReport)
router.delete('/:id', authenticate, deleteConsumptionReport);



export default router; 