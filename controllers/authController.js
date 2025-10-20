const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Format user response data
const formatUserResponse = (user, token) => {
    return {
        success: true,
        token,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            skills: user.skills,
            preferences: user.preferences,
            profile: user.profile,
            isOnboarded: user.isOnboarded
        }
    };
};

// Signup controller
exports.signup = async (req, res) => {
    try {
        const { fullname, email, password, skills = [] } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create new user
        const user = await User.create({
            fullname,
            email,
            password,
            skills,
            preferences: {
                selectedCategories: [],
                interests: [],
                experienceLevel: 'beginner'
            }
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json(formatUserResponse(user, token));
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating account'
        });
    }
};

// Login controller
exports.login = async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        // Find user by email
        console.log('Finding user with email:', email);
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        console.log('Checking password for user:', email);
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        console.log('Login successful for user:', email);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                skills: user.skills || [],
                preferences: user.preferences || {},
                isOnboarded: user.isOnboarded || false
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in. Please try again.'
        });
    }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { 
                preferences,
                isOnboarded: true 
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json(formatUserResponse(user));
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating preferences'
        });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json(formatUserResponse(user));
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.fullname,
                skills: user.skills,
                isOnboarded: user.isOnboarded
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
}; 