

import { describe, it, expect, vi, beforeEach } from 'vitest';

const Observation = require('../models/observations');

const {
createObservation,
getObservations
} = require('../services/observations.service');

describe('observations.service', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

describe('createObservation', () => {

    it('crée une observation avec les données fournies', async () => {

        const observationData = {
            location: 'cour_avant',
            ambiance: 'quiet',
            crowdLevel: 'empty'
        };

        const createdObservation = {
            _id: '123',
            ...observationData
        };

        vi.spyOn(Observation, 'create')
            .mockResolvedValue(createdObservation);

        const result = await createObservation(observationData);

        expect(Observation.create)
            .toHaveBeenCalledWith(observationData);

        expect(result).toEqual(createdObservation);
    });

    it('propage une erreur lorsque la création échoue', async () => {

        vi.spyOn(Observation, 'create')
            .mockRejectedValue(new Error('Database error'));

        await expect(
            createObservation({
                location: 'cour_avant'
            })
        ).rejects.toThrow('Database error');

    });

});

describe('getObservations', () => {

    it('récupère les observations avec les filtres et la limite', async () => {

        const observations = [
            {
                _id: '1',
                location: 'cour_avant'
            },
            {
                _id: '2',
                location: 'cour_avant'
            }
        ];

        const limit = vi.fn()
            .mockResolvedValue(observations);

        const sort = vi.fn()
            .mockReturnValue({
                limit
            });

        vi.spyOn(Observation, 'find')
            .mockReturnValue({
                sort
            });

        const filters = {
            location: 'cour_avant'
        };

        const result = await getObservations(filters, 50);

        expect(Observation.find)
            .toHaveBeenCalledWith(filters);

        expect(sort)
            .toHaveBeenCalledWith({
                timestamp: -1
            });

        expect(limit)
            .toHaveBeenCalledWith(50);

        expect(result)
            .toEqual(observations);
    });

    it('utilise une limite de 100 par défaut', async () => {

        const limit = vi.fn()
            .mockResolvedValue([]);

        const sort = vi.fn()
            .mockReturnValue({
                limit
            });

        vi.spyOn(Observation, 'find')
            .mockReturnValue({
                sort
            });

        await getObservations({
            location: 'cour_avant'
        });

        expect(limit)
            .toHaveBeenCalledWith(100);
    });

});

});
