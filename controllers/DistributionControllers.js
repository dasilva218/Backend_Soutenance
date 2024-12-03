import Distribute from '../models/DistributeModels.js'; 
import Product from '../models/ProductsModels.js'; 


export const createDistribution = async (req, res) => {
    const { productId, agency, supplier, quantity, distributedBy, distributedTo, date } = req.body;

    try {
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

       
        if (quantity > product.quantity) {
            return res.status(400).json({ error: 'Quantité demandée supérieure à la quantité disponible' });
        }

      
        const distribution = new Distribute({
            product: productId,
            quantity,
            distributedBy,
            distributedTo,
            supplier,
            date
        });

        
        await distribution.save();

        
        product.quantity -= quantity;
        await product.save();

        
        res.status(201).json(distribution);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


export const getDistributions = async (req, res) => {
    try {
        const distributions = await Distribute.find()
            .populate('product')
            .populate('distributedBy')
            .populate('distributedTo');
        res.status(200).json(distributions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getDistributionById = async (req, res) => {
    try {
        const distribution = await Distribute.findById(req.params.id)
            .populate('product')
            .populate('distributedBy')
            .populate('distributedTo');
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(200).json(distribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateDistribution = async (req, res) => {
    try {
        const distribution = await Distribute.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(200).json(distribution);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteDistribution = async (req, res) => {
    try {
        const distribution = await Distribute.findByIdAndDelete(req.params.id);
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

