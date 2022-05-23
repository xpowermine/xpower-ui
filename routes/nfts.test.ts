import request from 'supertest';
import app from '../app';

describe('GET /nfts', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/nfts');
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
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
describe('GET /nfts/thor/(0*)222200.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/thor/222200.json'
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
                'UNIT THOR NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/nfts/320x427/2222/Thor/1-Thor_UNIT.png$')
            );
        });
    });
});
describe('GET /nfts/thor/(0*)363f8.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/thor/363f8.json'
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
                'UNIT THOR NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/nfts/320x427/2222/Thor/1-Thor_UNIT.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/thor/(0*)333300.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/thor/333300.json'
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
describe('REDIRECT /nfts/thor/(0*)515f4.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/thor/515f4.json'
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
describe('GET /nfts/loki/(0*)202203.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/loki/00000000000000000000000000202203.json'
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
                'KILO LOKI NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/nfts/320x427/2022/Loki/2-Loki_KILO.png$')
            );
        });
    });
});
describe('GET /nfts/loki/(0*)315db.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/loki/00000000000000000000000000315db.json'
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
                'KILO LOKI NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/nfts/320x427/2022/Loki/2-Loki_KILO.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/loki/(0*)333303.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/loki/333303.json'
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
describe('REDIRECT /nfts/loki/(0*)515f7.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/loki/515f7.json'
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
describe('GET /nfts/odin/(0*)202306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/odin/0000000000000000000000000000000000000000000000000000000000202306.json'
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
                'MEGA ODIN NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/nfts/320x427/2023/Odin/3-Odin_MEGA.png$')
            );
        });
    });
});
describe('GET /nfts/odin/(0*)31642.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/odin/000000000000000000000000000000000000000000000000000000000031642.json'
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
                'MEGA ODIN NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:([0-9]+)/ipfs/')
            );
            expect(image).toMatch(
                new RegExp('/nfts/320x427/2023/Odin/3-Odin_MEGA.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/odin/(0*)333306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/odin/333306.json'
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
describe('REDIRECT /nfts/odin/(0*)515fa.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/odin/515fa.json'
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
