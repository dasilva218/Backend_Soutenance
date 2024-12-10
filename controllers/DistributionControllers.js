import Distribute from '../models/DistributeModels.js'; 
import Product from '../models/ProductsModels.js'; 



export const createDistribution = async (req, res) => {
    const { code_produit, product, quantity, distributedBy, distributedTo, supplier, date } = req.body;

    
    if (!code_produit || !product || !quantity || !distributedBy || !distributedTo || !supplier || !date) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        
        const productFound = await Product.findOne({ code_produit }); 
        if (!productFound) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        if (!mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({ error: 'ID de produit invalide' });
        }

        
        if (quantity > productFound.quantity) {
            return res.status(400).json({ error: 'Quantité demandée supérieure à la quantité disponible' });
        }

        // Création de la distribution
        const distribution = new Distribute({
            code_produit, // Utilisation du code_produit
            product, // ID du produit
            quantity,
            distributedBy,
            distributedTo,
            supplier,
            date
        });

        await distribution.save();

        // Mise à jour de la quantité du produit
        productFound.quantity -= quantity;
        await productFound.save();

        // Réponse avec la distribution créée
        res.status(201).json(distribution);
    } catch (error) {
        // Gestion des erreurs
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Erreur de validation', details: error.message });
        }

        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};





export const getDistributions = async (req, res) => {
    try {
        const distributions = await Distribute.find()
            .populate('code_produit')
            .populate('product')
            .populate('Agency')
            .populate('supplier')
            .populate('distributedBy')
            .populate('distributedTo')
            .populate('date');
        res.status(200).json(distributions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getDistributionById = async (req, res) => {
    try {
        const distribution = await Distribute.findById(req.params.id)
        .populate('code_produit')
        .populate('product')
        .populate('Agency')
        .populate('supplier')
        .populate('distributedBy')
        .populate('distributedTo')
        .populate('date');
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

