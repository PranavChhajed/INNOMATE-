const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const educationSchema = new mongoose.Schema({
    school: String,
    degree: String,
    startYear: Number,
    endYear: Number,
    description: String
});

const experienceSchema = new mongoose.Schema({
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String
});

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profilePicture: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    education: [educationSchema],
    skills: [{
        type: String,
        trim: true
    }],
    experience: [experienceSchema],
    preferences: {
        selectedCategories: [{
            type: String,
            trim: true
        }],
        interests: [{
            type: String,
            trim: true
        }],
        experienceLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        }
    },
    profile: {
        bio: {
            type: String,
            trim: true,
            maxlength: 500
        },
        avatar: {
            type: String,
            default: ''
        },
        location: {
            type: String,
            trim: true
        },
        socialLinks: {
            linkedin: String,
            github: String,
            twitter: String,
            portfolio: String
        }
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manages updatedAt
});

// Create index for email field
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to sanitize user data for JSON response
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 