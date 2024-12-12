import mongoose from 'mongoose';



const agencySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
username : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, 
{ timestamps: true });

const Agency = mongoose.model('Agency', agencySchema);

export default Agency;
