/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Tokenizer } from '../source/token';
import { env_of } from './functions';
import express from 'express';
const router = express.Router();

import { readdir } from 'fs/promises';
import { join, sep } from 'path';

function routes(
  home_env: Record<string, string>
) {
  /** REDIRECT to home page. */
  router.get('/', (req, res) => {
    res.redirect('/home');
  });
  /** GET home page. */
  router.get('/home', async (req, res) => {
    const params = new URLSearchParams(req.query as any);
    const token = Tokenizer.token(params.get('token'));
    const amounts: Record<string, bigint> = {};
    const levels: Record<string, number> = {};
    for (let i = 1; i <= 64; i++) {
      amounts[`AMOUNT_${i}`] = Tokenizer.amount(
        token, i
      );
      levels[`LEVEL_${i}`] = i;
    }
    res.render('home/home.pig', {
      ...env_of(req), ...home_env, ...amounts, ...levels
    });
  });
}
worker(join('public', 'scripts'), 1).then((path) => {
  routes({ UI_WORKER_PATH: path });
});
async function worker(base_path: string, skip: number) {
  if (typeof process.env.UI_WORKER_PATH === 'string') {
    return process.env.UI_WORKER_PATH;
  }
  return await search(base_path, skip);
}
async function search(base_path: string, skip: number) {
  const tail = (full_path: string) => {
    return join(...full_path.split(sep).slice(skip));
  }
  const names = await readdir(base_path);
  for (const name of names) {
    const match = name.match(/worker\.([0-9a-f])+\.js$/i);
    if (match) return tail(join(base_path, name));
  }
  return tail(join(base_path, 'worker.js'));
}
export default router;
