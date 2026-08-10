

import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
cacheMiddleware,
clearCache
} = require('../middleware/cache');

describe('cache middleware', () => {
    beforeEach(() => {
        clearCache();
    });

it('met en cache une réponse', () => {

    const req = {
        originalUrl: '/places'
    };

    const json = vi.fn();

    const res = {
        json
    };

    const next = vi.fn();

    cacheMiddleware(60)(req, res, next);

    expect(next).toHaveBeenCalled();

    res.json({
        success: true,
        data: ['place1']
    });

    const secondRes = {
        json: vi.fn()
    };

    const secondNext = vi.fn();

    cacheMiddleware(60)(req, secondRes, secondNext);

    expect(secondRes.json).toHaveBeenCalledWith({
        success: true,
        data: ['place1']
    });

    expect(secondNext).not.toHaveBeenCalled();
});

it('laisse passer une requête non présente dans le cache', () => {

    const req = {
        originalUrl: '/places'
    };

    const res = {
        json: vi.fn()
    };

    const next = vi.fn();

    cacheMiddleware(60)(req, res, next);

    expect(next).toHaveBeenCalled();
});

it('clearCache vide le cache', () => {

    const req = {
        originalUrl: '/places'
    };

    const firstRes = {
        json: vi.fn()
    };

    const firstNext = vi.fn();

    cacheMiddleware(60)(req, firstRes, firstNext);

    firstRes.json({
        success: true,
        data: ['place1']
    });

    clearCache();

    const secondRes = {
        json: vi.fn()
    };

    const secondNext = vi.fn();

    cacheMiddleware(60)(req, secondRes, secondNext);

    expect(secondNext).toHaveBeenCalled();
});

});
