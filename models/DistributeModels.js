import mongoose from 'mongoose';

const distributeSchema = new mongoose.Schema({
    code_produit: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    quantity: { type: Number, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'supplier', required: true },
    distributedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, 
    distributedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    date: { type: Date, default: Date.now } 
}, 
{ timestamps: true });

export default mongoose.model('Distribute', distributeSchema);
