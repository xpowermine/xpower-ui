import request from 'supertest';
import app from '../app';

describe('GET /ppts/thor/(0*)222200.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/thor/222200.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'UNIT THOR'
            );
            expect(describe).toBe(
                'Staked UNIT THOR NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/ppts/320x427/2222/Thor/1-Thor_UNIT.png$')
            );
        });
    });
});
describe('GET /ppts/thor/(0*)363f8.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/thor/363f8.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'UNIT THOR'
            );
            expect(describe).toBe(
                'Staked UNIT THOR NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/ppts/320x427/2222/Thor/1-Thor_UNIT.png$')
            );
        });
    });
});
describe('REDIRECT /ppts/thor/(0*)333300.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/thor/333300.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
describe('REDIRECT /ppts/thor/(0*)515f4.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/thor/515f4.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
describe('GET /ppts/loki/(0*)202203.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/loki/00000000000000000000000000202203.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'KILO LOKI'
            );
            expect(describe).toBe(
                'Staked KILO LOKI NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/ppts/320x427/2022/Loki/2-Loki_KILO.png$')
            );
        });
    });
});
describe('GET /ppts/loki/(0*)315db.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/loki/00000000000000000000000000315db.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'KILO LOKI'
            );
            expect(describe).toBe(
                'Staked KILO LOKI NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/ppts/320x427/2022/Loki/2-Loki_KILO.png$')
            );
        });
    });
});
describe('REDIRECT /ppts/loki/(0*)333303.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/loki/333303.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
describe('REDIRECT /ppts/loki/(0*)515f7.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/loki/515f7.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
describe('GET /ppts/odin/(0*)202306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/odin/0000000000000000000000000000000000000000000000000000000000202306.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'MEGA ODIN'
            );
            expect(describe).toBe(
                'Staked MEGA ODIN NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/ppts/320x427/2023/Odin/3-Odin_MEGA.png$')
            );
        });
    });
});
describe('GET /ppts/odin/(0*)31642.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/odin/000000000000000000000000000000000000000000000000000000000031642.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'MEGA ODIN'
            );
            expect(describe).toBe(
                'Staked MEGA ODIN NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/ppts/320x427/2023/Odin/3-Odin_MEGA.png$')
            );
        });
    });
});
describe('REDIRECT /ppts/odin/(0*)333306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/odin/333306.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
describe('REDIRECT /ppts/odin/(0*)515fa.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/odin/515fa.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
