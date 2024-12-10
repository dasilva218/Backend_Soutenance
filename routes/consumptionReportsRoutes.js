import express from 'express';
import { createConsumptionReport, deleteConsumptionReport, getConsumptionReportById, getConsumptionReports, updateConsumptionReport, validateConsomptionReport } from '../controllers/ConsumptionReportsControllers.js';




const router = express.Router();

router.post('/', createConsumptionReport);
router.get('/', getConsumptionReports );
router.get('/:id', getConsumptionReportById);
router.put('/:id', validateConsomptionReport, updateConsumptionReport)
router.delete('/:id', deleteConsumptionReport);



export default router; 