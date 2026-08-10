

import { describe, it, expect, vi, beforeEach } from 'vitest';

const User = require('../models/users');
const Observation = require('../models/observations');

const {
registerUser,
loginUser,
getUserById,
getUserObservations
} = require('../services/users.service');

describe('users.service', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    
describe('registerUser', () => {

    it('crée un utilisateur avec un email normalisé et un mot de passe hashé', async () => {

        vi.spyOn(User, 'findOne').mockResolvedValue(null);

        vi.spyOn(User, 'create').mockResolvedValue({
            _id: '123',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashed-password'
        });

        const user = await registerUser(
            ' testuser ',
            ' TEST@EXAMPLE.COM ',
            'password123'
        );

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'test@example.com'
        });

        expect(User.create).toHaveBeenCalled();

        expect(user.email).toBe('test@example.com');
        expect(user.username).toBe('testuser');
        expect(user.password).toBe('hashed-password');
    });

    it('refuse un utilisateur avec un email déjà utilisé', async () => {

        vi.spyOn(User, 'findOne').mockResolvedValue({
            _id: '123',
            email: 'test@example.com'
        });

        const createSpy = vi.spyOn(User, 'create');
        
        await expect(
            registerUser(
                'testuser',
                'test@example.com',
                'password123'
            )
        ).rejects.toMatchObject({
            code: 'EMAIL_EXISTS'
        });

        expect(User.create).not.toHaveBeenCalled();
    });

});

describe('loginUser', () => {

    it('connecte un utilisateur avec les bonnes informations', async () => {

        vi.spyOn(User, 'findOne').mockResolvedValue({
            _id: '123',
            username: 'testuser',
            email: 'test@example.com',
            password: '$2a$10$example'
        });

        const bcrypt = require('bcryptjs');

        vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        process.env.JWT_SECRET = 'test-secret';

        const result = await loginUser(
            ' TEST@EXAMPLE.COM ',
            'password123'
        );

        expect(result.user.email).toBe('test@example.com');
        expect(result.token).toBeDefined();
    });

    it('refuse une connexion avec un email inexistant', async () => {

        vi.spyOn(User, 'findOne').mockResolvedValue(null);

        await expect(
            loginUser(
                'unknown@example.com',
                'password123'
            )
        ).rejects.toMatchObject({
            code: 'INVALID_CREDENTIALS'
        });
    });

});

describe('getUserById', () => {

    it('récupère un utilisateur par son identifiant', async () => {

        const populate = vi.fn().mockResolvedValue({
            _id: '123',
            username: 'testuser',
            favorites: []
        });

        vi.spyOn(User, 'findById').mockReturnValue({
            populate
        });

        const user = await getUserById('123');

        expect(User.findById).toHaveBeenCalledWith('123');
        expect(populate).toHaveBeenCalledWith('favorites');
        expect(user.username).toBe('testuser');
    });

});

describe('getUserObservations', () => {

    it('récupère les observations de l’utilisateur', async () => {

        const sort = vi.fn().mockResolvedValue([
            {
                author: '123',
                location: 'cour_avant'
            }
        ]);

        vi.spyOn(Observation, 'find').mockReturnValue({
            sort
        });

        const observations = await getUserObservations('123');

        expect(Observation.find).toHaveBeenCalledWith({
            author: '123'
        });

        expect(sort).toHaveBeenCalledWith({
            timestamp: -1
        });

        expect(observations).toHaveLength(1);
    });

});

});
