import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    },
    supplier: {
        type: String,
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
