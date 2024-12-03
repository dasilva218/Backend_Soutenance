import mongoose from 'mongoose';

const consumptionReportSchema = new mongoose.Schema({
    code_Produit: { type: String, required: true }, 
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    agence: { type: String, required: true }, 
    fournisseur: { type: String, required: true }, 
    stockInitial: { type: Number, required: true }, 
    entrees: { type: Number, required: true }, 
    sorties: { type: Number, required: true },
    stockFinal: { type: Number, required: true }, 
    date: { type: Date, default: Date.now }
}, 
{ timestamps: true });

const ConsumptionReport = mongoose.model('ConsumptionReport', consumptionReportSchema);
export default ConsumptionReport;