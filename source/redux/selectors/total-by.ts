/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, BlockHash, Nonces, Token } from '../types';

export function totalBy(
    nonces: Nonces,
    item: {
        address: Address,
        amount: Amount,
        block_hash: BlockHash,
        token: Token,
    }
): Amount {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        const by_address = i.address === item.address;
        if (!by_address) return false;
        const by_block_hash = i.block_hash === item.block_hash;
        if (!by_block_hash) return false;
        const by_amount = i.amount === item.amount;
        if (!by_amount) return false;
        const by_token = i.token === item.token;
        if (!by_token) return false;
        return true;
    });
    const amounts = filtered.map(([n, i]) => i.amount);
    return amounts.reduce((a1, a2) => a1 + a2, 0n);
}
export default totalBy;
