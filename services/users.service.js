

const User = require('../models/users');
const Observation = require('../models/observations');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(username, email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        const error = new Error('Email already used');
        error.code = 'EMAIL_EXISTS';
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username: username.trim(),
        email: normalizedEmail,
        password: hashedPassword
    });

    return user;
}

async function loginUser(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        const error = new Error('Invalid credentials');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { user, token };
}

async function getUserById(userId) {
    return User.findById(userId).populate('favorites');
}
async function addFavorite(userId, placeId) {
    return User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: placeId } },
        { new: true }
    ).populate('favorites');
}

async function removeFavorite(userId, placeId) {
    return User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: placeId } },
        { new: true }
    ).populate('favorites');
}

async function getUserObservations(userId) {
    return Observation.find({
        author: userId
    }).sort({
        timestamp: -1
    });
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    getUserObservations,
    addFavorite,
    removeFavorite
};
