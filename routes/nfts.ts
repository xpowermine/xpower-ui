import { Nft, NftLevel, NftToken } from '../source/redux/types';
import { env_of, host } from './functions';

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
  const location = env.XPOWER_NFT_REDIRECT[
    `${token}/${Nft.coreId(nft)}.json`
  ];
  if (typeof location === 'string') {
    return res.redirect(location);
  }
  const TOKEN = NftToken[nft.token].toUpperCase();
  const LEVEL = NftLevel[nft.level].toUpperCase();
  const level = LEVEL.toLowerCase();
  res.send({
    name: `${TOKEN} ${LEVEL}`,
    describe: `Stakeable ${TOKEN} ${LEVEL} NFT`,
    image: `${host(req)}/images/nft/${nft.issue}/xpow.${token}-${level}.png`,
    properties: {
      issue: `${nft.issue}`,
      label: LEVEL,
      level: `${nft.level}`,
      token: `${TOKEN}`
    }
  });
});
export default router;
