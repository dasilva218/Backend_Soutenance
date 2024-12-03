import User from '../models/UsersModels.js';
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
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};



const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
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




const createUser = async (req, res) => {
    const { username, password, role, agency } = req.body;

    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, role, agency });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Données invalides', details: error.message });
        }
        if (error.code === 11000) { 
            return res.status(409).json({ error: 'Nom d’utilisateur déjà utilisé' });
        }
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

export { createUser, getUserById, updateUser, deleteUser, loginUser, registerUser };


