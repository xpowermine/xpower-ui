import request from 'supertest';
import app from '../app';

describe('GET /404', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/404');
    });
    it('should return w/an HTTP code = 404 OK', async () => {
        await get.expect(404);
    });
    it('should return w/a Content-Type ~ html', async () => {
        await get.expect('Content-Type', /html/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
});
