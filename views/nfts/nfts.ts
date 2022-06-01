import './nfts.scss';

import './list/list';
import './details/details';
import './minter/allowance';
import './minter/approving';
import './minter/minter';

import { App } from '../../source/app';
import { Years } from '../../source/years';
import { x40 } from '../../source/functions';
import { Address } from '../../source/redux/types';
import { Nft, NftLevels } from '../../source/redux/types';
import { NftWallet } from '../../source/wallet';
import { OnTransferBatch } from '../../source/wallet';
import { OnTransferSingle } from '../../source/wallet';

$('#connect-metamask').on('connected', async function setNfts(ev, {
    address
}: {
    address: Address
}) {
    let index = 0;
    const levels = Array.from(NftLevels());
    const issues = Array.from(Years()).reverse();
    const wallet = new NftWallet(address);
    const balances = await wallet.balances({ issues, levels });
    const supplies = wallet.totalSupplies({ issues, levels });
    const nft_token = Nft.token(
        App.token
    );
    for (const issue of issues) {
        for (const level of levels) {
            const amount = balances[index];
            const supply = await supplies[index];
            App.setNft({
                token: nft_token, issue, level
            }, {
                amount, supply
            });
            index += 1;
        }
    }
});
$('#connect-metamask').on('connected', async function onBatchTransfers(ev, {
    address
}: {
    address: Address
}) {
    const on_transfer: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        console.debug('[on:transfer-batch]',
            x40(op), x40(from), x40(to),
            ids, values, ev
        );
        const nft_token = Nft.token(
            App.token
        );
        for (let i = 0; i < ids.length; i++) {
            const nft_id = Nft.fullId({
                issue: Nft.issue(ids[i]),
                level: Nft.level(ids[i]),
                token: nft_token
            });
            if (address === from) {
                App.removeNft(nft_id, { amount: values[i] });
            }
            if (address === to) {
                App.addNft(nft_id, { amount: values[i] });
            }
        }
    };
    const wallet = new NftWallet(address);
    wallet.onTransferBatch(on_transfer);
});
$('#connect-metamask').on('connected', async function onSingleTransfers(ev, {
    address
}: {
    address: Address
}) {
    const on_transfer: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        console.debug('[on:transfer-single]',
            x40(op), x40(from), x40(to),
            id, value, ev
        );
        const nft_token = Nft.token(
            App.token
        );
        const nft_id = Nft.fullId({
            issue: Nft.issue(id),
            level: Nft.level(id),
            token: nft_token
        });
        if (address === from) {
            App.removeNft(nft_id, { amount: value });
        }
        if (address === to) {
            App.addNft(nft_id, { amount: value });
        }
    };
    const wallet = new NftWallet(address);
    wallet.onTransferSingle(on_transfer)
});
