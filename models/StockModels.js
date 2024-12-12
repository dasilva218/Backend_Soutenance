import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    code_produit: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now 
    }
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
