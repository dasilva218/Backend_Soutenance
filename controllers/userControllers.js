import User from '../models/UsersModels.js';
import Agency from '../models/AgencyModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const JWT_SECRET = 'votre_clé_secrète';

const generateToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    return token;
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Les champs username et password sont requis.' });
        }

        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Nom d’utilisateur ou mot de passe incorrect' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Nom d’utilisateur ou mot de passe incorrect' });
        }

        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};



const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role)  {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe sont requis.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Utilisateur déjà existant' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role 
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, role: newUser.role } });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Données invalides', details: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
        }

        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
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

export { createUserForAgency, getUserById, getAllUsers, updateUser, deleteUser, loginUser, registerUser };


