import { Nft, NftLevel, NftToken } from '../source/redux/types';
import { capitalize, env_of, host } from './functions';
import { join } from 'path';

import env from '../env';
import express from 'express';
const router = express.Router();

/** GET nfts page. */
router.get('/', (req, res) => {
  res.render('nfts/nfts.pig', env_of(req));
});
/** GET nfts/{token}/{id}.json metadata. */
router.get('/:token/:id.json', (req, res) => {
  const { token, id } = req.params;
  const nft = {
    issue: Nft.issue(id),
    level: Nft.level(id),
    token: Nft.token(token)
  };
  const key = `${token}/${Nft.coreId(nft)}.json`;
  const location = env.NFT_URI[key];
  if (typeof location === 'string') {
    return res.redirect(location);
  }
  const LEVEL = NftLevel[nft.level].toUpperCase();
  const order = 1 + nft.level / 3; // 1, 2, 3, ...
  const TOKEN = NftToken[nft.token].toUpperCase();
  const Token = capitalize(TOKEN.toLowerCase());
  res.send({
    name: `${LEVEL} ${TOKEN}`,
    describe: `${LEVEL} ${TOKEN} NFT`,
    image: host(req) + join(env.NFT_URI[token],
      `${nft.issue}`, Token, `${order}-${Token}_${LEVEL}.png`
    ),
    properties: {
      issue: `${nft.issue}`,
      label: LEVEL,
      level: `${nft.level}`,
      token: `${TOKEN}`
    }
  });
});
export default router;
