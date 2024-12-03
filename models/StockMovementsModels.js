import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    agency: { type: String, required: true }, 
    quantity: { type: Number, required: true },
    type: { type: String, enum: ['distribution', 'consommation'], required: true },
    date: { type: Date, default: Date.now } 
}, 
{ timestamps: true });

const StockMovement = mongoose.model('stockMovement', stockMovementSchema);

export default StockMovement;
