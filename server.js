import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cron from 'node-cron';
import { connectToDatabase } from './config/db.js';
import { createConsumptionReport } from './controllers/ConsumptionReportsControllers.js';
import ConsumptionData from './models/ConsumptionReportsModels.js';
import AgencyRoutes from './routes/AgencyRoutes.js';
import CategoryRoutes from './routes/CategoryRoutes.js';
import DistributeRoutes from './routes/DistributeRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import StockmovementRoutes from './routes/StockmovementRoutes.js';
import supplierRoutes from './routes/SupplierRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ConsumptionReportsRoutes from './routes/consumptionReportsRoutes.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();
const app = express()
const PORT = process.env.PORT || 10000


connectToDatabase();

// Middleware pour permettre l'accès à l'API (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '1800');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    // Gérer les requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); 
    }
  
    next(); 
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/',(req,res)=> res.json({message:"Welcome to the API"}) );
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/Fournisseur', supplierRoutes);
app.use('/api/Stock', StockmovementRoutes);
app.use('/api/Produit', productRoutes);
app.use('/api/distribuer', DistributeRoutes);
app.use('/api/consumption-reports', ConsumptionReportsRoutes);
app.use('/api/weekly-consumption-report', ConsumptionReportsRoutes);
app.use('/api/Agence', AgencyRoutes);
app.use('/api/categorie', CategoryRoutes);









cron.schedule('10 16 * * 5', async () => {
    try {
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); 
        const endDate = new Date();

        const data = await ConsumptionData.find({
            date: { $gte: startDate, $lt: endDate } 
        });

        
        const stockInitial = data[0]?.stockInitial || 0;  
        const entrees = data.reduce((acc, { entrees }) => acc + entrees, 0);
        const sorties = data.reduce((acc, { sorties }) => acc + sorties, 0);
        const stockFinal = stockInitial + entrees - sorties;

        
        const req = {
            body: {
                agency: '',
                product: '',
                stockInitial,
                entrees,
                sorties,
                stockFinal
            }
        };
        const res = {
            status: (statusCode) => ({
                json: (data) => console.log(`Status: ${statusCode}, Data:`, data)
            })
        };

        
        await createConsumptionReport(req, res);
    } catch (error) {
        console.error('Erreur lors de la création du rapport:', error.message);
    }
});






app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});