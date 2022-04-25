/* eslint @typescript-eslint/no-explicit-any: [off] */
import './migrate-nft.scss';

import { Blockchain } from '../../source/blockchain';
import { BigNumber } from 'ethers';
import { alert, Alert, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { XPowerNftFactory } from '../../source/contract';
import { Years } from '../../source/years';

$(window).on('load', function enableAllowanceButton() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approve = $('.approve-allowance-nft');
            $approve.prop('disabled', false);
        });
    }
});
$('button.approve-allowance-nft').on('click', async function approveTokens(ev) {
    const $approve = $(ev.target);
    if ($approve.hasClass('thor')) {
        await approve(Token.THOR, {
            $approve, $execute: $('.execute-migration-nft.thor')
        });
    }
    if ($approve.hasClass('loki')) {
        await approve(Token.LOKI, {
            $approve, $execute: $('.execute-migration-nft.loki')
        });
    }
    if ($approve.hasClass('odin')) {
        await approve(Token.ODIN, {
            $approve, $execute: $('.execute-migration-nft.odin')
        });
    }
});
async function approve(token: Token, { $approve, $execute }: {
    $approve: JQuery<HTMLElement>, $execute: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const v2_xpower = XPowerNftFactory({ token, version: 'v2a' });
    const v3_xpower = XPowerNftFactory({ token, version: 'v3a' });
    const v2_approved = await v2_xpower.isApprovedForAll(
        x40(address), v3_xpower.address
    );
    if (v2_approved) {
        const $alert = $(alert(`NFTs have already been approved for; you can migrate now.`, Alert.info));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    }
    try {
        $(`.alert`).remove();
        await v2_xpower.setApprovalForAll(
            v3_xpower.address, true
        );
        const $alert = $(alert(`NFTs have successfully been approved for; you can migrate now.`, Alert.success));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($approve.parent('div'));
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($approve.parent('div'));
            }
        }
        console.error(ex);
        return;
    }
}
$('button.execute-migration-nft').on('click', async function migrateTokens(ev) {
    const $execute = $(ev.target);
    if ($execute.hasClass('thor')) {
        await migrate(Token.THOR, { $execute });
    }
    if ($execute.hasClass('loki')) {
        await migrate(Token.LOKI, { $execute });
    }
    if ($execute.hasClass('odin')) {
        await migrate(Token.ODIN, { $execute });
    }
});
async function migrate(token: Token, { $execute }: {
    $execute: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const v2_xpower = XPowerNftFactory({ token, version: 'v2a' });
    const v3_xpower = XPowerNftFactory({ token, version: 'v3a' });
    const v2_approved = await v2_xpower.isApprovedForAll(
        x40(address), v3_xpower.address
    );
    if (v2_approved === false) {
        const $alert = $(alert(`Old NFTs have not been approved for! Did your approval transaction actually get confirmed? Wait a little bit and then retry.`, Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const v2_balances: BigNumber[] = await v2_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug('[v2:balances]', v2_balances.map((b) => b.toString()));
    const v2_zero = v2_balances.reduce((acc, b) => acc && b.isZero(), true);
    if (v2_zero) {
        const $alert = $(alert(`Your old NFT balances are zero; nothing to migrate here. Do you have the correct wallet address selected?`, Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    const nz = filter(ids, v2_balances, { zero: false });
    try {
        $(`.alert`).remove();
        await v3_xpower.migrateBatch(nz.ids, nz.balances);
        const $alert = $(alert(`Your old NFTs have successfully been migrated! ;)`, Alert.success, {
            id: 'success'
        }));
        $alert.insertAfter($execute.parent('div'));
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($execute.parent('div'));
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($execute.parent('div'));
            }
        }
        console.error(ex);
        return;
    }
}
function filter<I, B extends BigNumber>(
    ids: Array<I>, balances: Array<B>, { zero }: { zero: boolean }
) {
    const ids_nz = [];
    const balances_nz = [];
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].isZero() === zero) {
            balances_nz.push(balances[i]);
            ids_nz.push(ids[i]);
        }
    }
    return { ids: ids_nz, balances: balances_nz };
}
