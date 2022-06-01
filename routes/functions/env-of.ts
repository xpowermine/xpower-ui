/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Tokenizer } from '../../source/token';
import { theme } from '../../source/theme';
import { capitalize} from './capitalize';
import { Request } from 'express';

export const env_of = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  const token = Tokenizer.token(params.get('token'));
  const token_lc = Tokenizer.lower(token);
  return {
    TOKEN: token,
    token: token_lc,
    Token: capitalize(token_lc),
    ...theme(token)
  };
}
export default env_of;
