


import { describe, it, expect, beforeEach, vi } from 'vitest';

const Place = require('../models/places');
const {
    getPlaces,
    getPlaceById,
    createPlace
} = require('../services/places.service');

describe('places.service', () => {

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('getPlaces', () => {

        it('récupère les lieux', async () => {

            const mockPlaces = [
                { name: 'Bibliothèque' },
                { name: 'Cafétéria' }
            ];

            vi.spyOn(Place, 'find').mockReturnValue({
                sort: vi.fn().mockResolvedValue(mockPlaces)
            });

            const result = await getPlaces();

            expect(result).toEqual(mockPlaces);
            expect(Place.find).toHaveBeenCalled();
        });

    });

    describe('getPlaceById', () => {

        it('récupère un lieu par son identifiant', async () => {

            const mockPlace = {
                _id: '123',
                name: 'Bibliothèque'
            };

            vi.spyOn(Place, 'findById').mockResolvedValue(mockPlace);

            const result = await getPlaceById('123');

            expect(result).toEqual(mockPlace);
            expect(Place.findById).toHaveBeenCalledWith('123');
        });

        it('retourne null si le lieu nexiste pas', async () => {

            vi.spyOn(Place, 'findById').mockResolvedValue(null);

            const result = await getPlaceById('999');

            expect(result).toBeNull();
        });

    });

    describe('createPlace', () => {

        it('crée un nouveau lieu', async () => {

            const data = {
                name: 'Bibliothèque',
                location: 'bibliotheque',
                latitude: 45.5019,
                longitude: -73.5674
            };

            const mockPlace = {
                _id: '123',
                ...data
            };

            vi.spyOn(Place, 'create').mockResolvedValue(mockPlace);

            const result = await createPlace(data);

            expect(result).toEqual(mockPlace);
            expect(Place.create).toHaveBeenCalledWith(data);
        });

    });

});

