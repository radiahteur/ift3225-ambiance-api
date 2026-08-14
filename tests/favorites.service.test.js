const { describe, it, expect, vi, beforeEach } = await import('vitest');

const User = require('../models/users');
const Place = require('../models/places');

const {
    addFavorite,
    removeFavorite,
    getFavorites
} = require('../services/favorites.service');


describe('favorites.service', () => {

    beforeEach(() => {
        vi.restoreAllMocks();
    });


    describe('addFavorite', () => {

        it('ajoute un lieu aux favoris', async () => {

            const place = {
                _id: 'place123'
            };

            const user = {
                _id: 'user123',
                favorites: [],
                save: vi.fn().mockResolvedValue(true)
            };

            vi.spyOn(Place, 'findById')
                .mockResolvedValue(place);

            vi.spyOn(User, 'findById')
                .mockResolvedValue(user);

            vi.spyOn(Place, 'findById')
                .mockReturnValueOnce({
                    _id: 'place123'
                })
                .mockReturnValueOnce({
                    exec: vi.fn().mockResolvedValue(place)
                });

            const result = await addFavorite(
                'user123',
                'place123'
            );

            expect(user.favorites).toContain('place123');
            expect(user.save).toHaveBeenCalled();
        });


        it('refuse un lieu déjà présent dans les favoris', async () => {

            const user = {
                _id: 'user123',
                favorites: ['place123']
            };

            vi.spyOn(Place, 'findById')
                .mockResolvedValue({
                    _id: 'place123'
                });

            vi.spyOn(User, 'findById')
                .mockResolvedValue(user);

            await expect(
                addFavorite('user123', 'place123')
            ).rejects.toMatchObject({
                code: 'ALREADY_FAVORITE'
            });
        });

    });


    describe('removeFavorite', () => {

        it('retire un lieu des favoris', async () => {

            const user = {
                _id: 'user123',
                favorites: ['place123', 'place456'],
                save: vi.fn().mockResolvedValue(true)
            };

            vi.spyOn(User, 'findById')
                .mockResolvedValue(user);

            await removeFavorite(
                'user123',
                'place123'
            );

            expect(user.favorites).toEqual([
                'place456'
            ]);

            expect(user.save).toHaveBeenCalled();
        });


        it('refuse de retirer un lieu qui nest pas favori', async () => {

            const user = {
                _id: 'user123',
                favorites: [],
                save: vi.fn().mockResolvedValue(true)
            };

            vi.spyOn(User, 'findById')
                .mockResolvedValue(user);

            await expect(
                removeFavorite(
                    'user123',
                    'place123'
                )
            ).rejects.toMatchObject({
                code: 'NOT_FAVORITE'
            });
        });

    });


    describe('getFavorites', () => {

        it('récupère les favoris de lutilisateur', async () => {

            const favorites = [
                { _id: 'place123', name: 'Bibliothèque' },
                { _id: 'place456', name: 'Cafétéria' }
            ];

            const user = {
                _id: 'user123',
                favorites
            };

            const populate = vi.fn()
                .mockResolvedValue(user);

            vi.spyOn(User, 'findById')
                .mockReturnValue({
                    populate
                });

            const result = await getFavorites('user123');

            expect(result).toEqual(favorites);
        });

    });

});