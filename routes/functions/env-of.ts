/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Tokenizer } from '../../source/token';
import { theme } from '../../source/theme';
import { capitalize} from './capitalize';
import { Request } from 'express';

export const env_of = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  const token = Tokenizer.token(params.get('token'));
  const symbol = Tokenizer.symbol(token);
  const suffix = Tokenizer.suffix(token);
  return {
    Token_suffix: capitalize(suffix.toLowerCase()),
    Token: capitalize(symbol.toLowerCase()),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    ...theme(token)
  };
}
export default env_of;
