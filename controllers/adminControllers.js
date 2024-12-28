import User from '../models/UsersModels.js';
import Admin from '../models/AdminModels.js';
import { generateToken } from '../config/jwt.js';
import Agency from '../models/AgencyModels.js';
import bcrypt from 'bcrypt';

 const registerAdmin = async (req, res) => {
    const { adminName, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ adminName, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const loginAdmin = async (req, res) => {
    const { adminName, password } = req.body;
    try {
        const admin = await Admin.findOne({ adminName });
        if (admin && await bcrypt.compare(password, admin.password)) {
            const token = generateToken(admin._id);
            res.status(200).json({ token, admin });
        } else {
            res.status(401).json({ message: 'Identifiants invalides' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

  const createUserForAgency = async (req, res) => {
    const { username, password, role, agencyId } = req.body;

    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    try {
        
        if (!username || !password || !role || !agencyId) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Utilisateur déjà existant' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        
        await Agency.findByIdAndUpdate(agencyId, { $push: { users: newUser._id } });

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); 

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};



const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role, agency } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, password, role, agency }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(updatedUser);
    } catch (error) {
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(204).send(); 
    } catch (error) {
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export { registerAdmin, loginAdmin, createUserForAgency, getUserById, getAllUsers, updateUser, deleteUser };


