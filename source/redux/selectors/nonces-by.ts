/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, BlockHash, Nonce, Nonces, Token } from '../types';

export function noncesBy(
    nonces: Nonces, item?: {
        address?: Address,
        amount?: Amount,
        block_hash?: BlockHash,
        token?: Token,
    }
): Nonce[] {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        if (item !== undefined) {
            if (item.address !== undefined &&
                item.address !== i.address
            ) {
                return false;
            }
            if (item.amount !== undefined &&
                item.amount !== i.amount
            ) {
                return false;
            }
            if (item.block_hash !== undefined &&
                item.block_hash !== i.block_hash
            ) {
                return false;
            }
            if (item.token !== undefined &&
                item.token !== i.token
            ) {
                return false;
            }
        }
        return true;
    });
    const keys = filtered.map(([n, i]) => Number(n));
    return keys;
}
export default noncesBy;
