/* eslint @typescript-eslint/no-explicit-any: [off] */
import './migrate-nft2.scss';

import { Blockchain } from '../../source/blockchain';
import { BigNumber } from 'ethers';
import { alert, Alert, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { XPowerNftFactory } from '../../source/contract';
import { Years } from '../../source/years';

$(window).on('load', function enableAllowanceButton() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approve = $('.approve-allowance-nft2');
            $approve.prop('disabled', false);
        });
    }
});
$('button.approve-allowance-nft2').on('click', async function approveTokens(ev) {
    const $approve = $(ev.target);
    if ($approve.hasClass('para')) {
        await approve(Token.PARA, {
            $approve, $execute: $('.execute-migration-nft2.para')
        });
    }
    if ($approve.hasClass('aqch')) {
        await approve(Token.AQCH, {
            $approve, $execute: $('.execute-migration-nft2.aqch')
        });
    }
    if ($approve.hasClass('qrsh')) {
        await approve(Token.QRSH, {
            $approve, $execute: $('.execute-migration-nft2.qrsh')
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
    const v3a_xpower = XPowerNftFactory({ token, version: 'v3a' });
    const v3b_xpower = XPowerNftFactory({ token, version: 'v3b' });
    const v3a_approved = await v3a_xpower.isApprovedForAll(
        x40(address), v3b_xpower.address
    );
    if (v3a_approved) {
        const $alert = $(alert(`NFTs have already been approved for; you can migrate now.`, Alert.info));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    }
    try {
        $(`.alert`).remove();
        await v3a_xpower.setApprovalForAll(
            v3b_xpower.address, true
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
$('button.execute-migration-nft2').on('click', async function migrateTokens(ev) {
    const $execute = $(ev.target);
    if ($execute.hasClass('para')) {
        await migrate(Token.PARA, { $execute });
    }
    if ($execute.hasClass('aqch')) {
        await migrate(Token.AQCH, { $execute });
    }
    if ($execute.hasClass('qrsh')) {
        await migrate(Token.QRSH, { $execute });
    }
});
async function migrate(token: Token, { $execute }: {
    $execute: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const v3a_xpower = XPowerNftFactory({ token, version: 'v3a' });
    const v3b_xpower = XPowerNftFactory({ token, version: 'v3b' });
    const v3a_approved = await v3a_xpower.isApprovedForAll(
        x40(address), v3b_xpower.address
    );
    if (v3a_approved === false) {
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
    const v3a_balances: BigNumber[] = await v3a_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug('[v3a:balances]', v3a_balances.map((b) => b.toString()));
    const v3a_zero = v3a_balances.reduce((acc, b) => acc && b.isZero(), true);
    if (v3a_zero) {
        const $alert = $(alert(`Your old NFT balances are zero; nothing to migrate here. Do you have the correct wallet address selected?`, Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    const nz = filter(ids, v3a_balances, {
        zero: false
    });
    try {
        $(`.alert`).remove();
        await v3b_xpower.migrateBatch(
            nz.ids, nz.balances
        );
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
$('button.burn-empty-nft2').on('click', async function burnEmpty(ev) {
    const $burn = $(ev.target);
    if ($burn.hasClass('para')) {
        await burn(Token.PARA, { $burn });
    }
    if ($burn.hasClass('aqch')) {
        await burn(Token.AQCH, { $burn });
    }
    if ($burn.hasClass('qrsh')) {
        await burn(Token.QRSH, { $burn });
    }
});
async function burn(token: Token, { $burn }: {
    $burn: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const v3a_xpower = XPowerNftFactory({ token, version: 'v3a' });
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const v3a_balances: BigNumber[] = await v3a_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug('[v3a:balances]', v3a_balances.map((b) => b.toString()));
    const zz = filter(ids, v3a_balances, {
        zero: true
    });
    try {
        $(`.alert`).remove();
        await v3a_xpower.burnBatch(
            x40(address), zz.ids, zz.balances
        );
        const $alert = $(alert(`Your empty NFTs have successfully been burned! ;)`, Alert.success, {
            id: 'success'
        }));
        $alert.insertAfter($burn.parent('div'));
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($burn.parent('div'));
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($burn.parent('div'));
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
