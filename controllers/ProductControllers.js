import Product from '../models/ProductsModels.js';
import Category from '../models/categoryModels.js';
import StockModels from '../models/StockModels.js';

export const createProduct = async (req, res) => {
    const { code_produit, produit, supplier, category, price, isFree = false, quantity = 0, minStockLevel } = req.body;

    try {
        
        if (!code_produit || !produit || !supplier || !category || !price || quantity === undefined || !minStockLevel) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        
        const existingProduct = await Product.findOne({ code_produit });
        if (existingProduct) {
            return res.status(409).json({ error: 'Le code produit doit être unique' });
        }

        const newProduct = new Product({ code_produit, produit, supplier, category, price, isFree, quantity, minStockLevel });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const addProduct = async (req, res) => {
    const { code_produit, produit, supplier, category, price, isFree, quantity, minStockLevel } = req.body;

    try {
        
        if (!code_produit || !produit || !supplier || !category || !price || quantity === undefined || !minStockLevel) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        
        const existingProduct = await Product.findOne({ code_produit });
        if (existingProduct) {
            return res.status(409).json({ error: 'Le code produit doit être unique' });
        }

        const existingProductByName = await Product.findOne({ name, supplier });
        if (existingProductByName) {
            existingProductByName.quantity += quantity;
            await existingProductByName.save();
            return res.status(200).json({ message: 'Quantité mise à jour', product: existingProductByName });
        } else {
            const newProduct = new Product({ code_produit, name, supplier, category, price, isFree, quantity, minStockLevel });
            await newProduct.save();
            return res.status(201).json(newProduct);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getProductsBySupplier = async (req, res) => {
    const { supplierId } = req.params;

    try {
        const products = await Product.find({ supplier: supplierId }).populate('category');
        if (!products.length) {
            return res.status(404).json({ error: 'Aucun produit trouvé pour ce fournisseur' });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await Product.find({ category: categoryId }).populate('supplier');
        if (!products.length) {
            return res.status(404).json({ error: 'Aucun produit trouvé pour cette catégorie' });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Données invalides', details: error.message });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

// Exportation des fonctions
export default { createProduct, addProduct, getProductsBySupplier, getProductsByCategory, updateProduct, deleteProduct };
