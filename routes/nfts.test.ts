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
describe('GET /nfts/para/(0*)222200.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/para/222200.json'
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
                'UNIT PARA'
            );
            expect(describe).toBe(
                'UNIT PARA NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2222/xpow.para-unit.png$')
            );
        });
    });
});
describe('GET /nfts/para/(0*)363f8.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/para/363f8.json'
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
                'UNIT PARA'
            );
            expect(describe).toBe(
                'UNIT PARA NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2222/xpow.para-unit.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/para/(0*)333300.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/para/333300.json'
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
describe('REDIRECT /nfts/para/(0*)515f4.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/para/515f4.json'
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
describe('GET /nfts/aqch/(0*)202203.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/aqch/00000000000000000000000000202203.json'
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
                'KILO AQCH'
            );
            expect(describe).toBe(
                'KILO AQCH NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2022/xpow.aqch-kilo.png$')
            );
        });
    });
});
describe('GET /nfts/aqch/(0*)315db.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/aqch/00000000000000000000000000315db.json'
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
                'KILO AQCH'
            );
            expect(describe).toBe(
                'KILO AQCH NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2022/xpow.aqch-kilo.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/aqch/(0*)333303.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/aqch/333303.json'
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
describe('REDIRECT /nfts/aqch/(0*)515f7.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/aqch/515f7.json'
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
describe('GET /nfts/qrsh/(0*)202306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/qrsh/0000000000000000000000000000000000000000000000000000000000202306.json'
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
                'MEGA QRSH'
            );
            expect(describe).toBe(
                'MEGA QRSH NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2023/xpow.qrsh-mega.png$')
            );
        });
    });
});
describe('GET /nfts/qrsh/(0*)31642.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/qrsh/000000000000000000000000000000000000000000000000000000000031642.json'
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
                'MEGA QRSH'
            );
            expect(describe).toBe(
                'MEGA QRSH NFT'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2023/xpow.qrsh-mega.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/qrsh/(0*)333306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/qrsh/333306.json'
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
describe('REDIRECT /nfts/qrsh/(0*)515fa.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/qrsh/515fa.json'
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
