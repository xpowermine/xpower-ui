/* eslint @typescript-eslint/no-var-requires: [off] */
import { env_of } from './functions';
import express from 'express';
import assert from 'assert';
import env from '../env';

export const router = express.Router();

/** GET migration page. */
router.get('/', (req, res) => {
  const { THOR_IMAGE_V4a } = env;
  assert(THOR_IMAGE_V4a, 'missing THOR_IMAGE_V4a');
  const { LOKI_IMAGE_V4a } = env;
  assert(LOKI_IMAGE_V4a, 'missing LOKI_IMAGE_V4a');
  const { ODIN_IMAGE_V4a } = env;
  assert(ODIN_IMAGE_V4a, 'missing ODIN_IMAGE_V4a');
  res.render('migrate/index.pig', {
    THOR_IMAGE: THOR_IMAGE_V4a,
    LOKI_IMAGE: LOKI_IMAGE_V4a,
    ODIN_IMAGE: ODIN_IMAGE_V4a,
    ...env_of(req),
  });
});
export default router;
