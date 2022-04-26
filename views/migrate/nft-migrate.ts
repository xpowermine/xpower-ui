/* eslint @typescript-eslint/no-explicit-any: [off] */
import './nft-migrate.scss';

import { Blockchain } from '../../source/blockchain';
import { BigNumber } from 'ethers';
import { alert, Alert, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { XPowerNftFactory } from '../../source/contract';
import { Years } from '../../source/years';

$(window).on('load', async function enableAllowanceButton() {
    if (await Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approve = $('.approve-allowance-nft');
            $approve.prop('disabled', false);
        });
    }
});
$('button.approve-allowance-nft').on('click', async function approveTokens(ev) {
    const $approve = $(ev.target);
    const $allowance_nft = $approve.parents('form.allowance-nft');
    const $migration_nft = $allowance_nft.next('form.migration-nft');
    if ($approve.hasClass('thor')) {
        await approve(Token.THOR, {
            $approve, $execute: $migration_nft.find(
                '.execute-migration-nft.thor'
            )
        });
    }
    if ($approve.hasClass('loki')) {
        await approve(Token.LOKI, {
            $approve, $execute: $migration_nft.find(
                '.execute-migration-nft.loki'
            )
        });
    }
    if ($approve.hasClass('odin')) {
        await approve(Token.ODIN, {
            $approve, $execute: $migration_nft.find(
                '.execute-migration-nft.odin'
            )
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
    const src_version = $approve.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const src_xpower = await XPowerNftFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $approve.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerNftFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const src_approved = await src_xpower.isApprovedForAll(
        x40(address), tgt_xpower.address
    );
    console.debug(
        `[${src_version}:approved]`, src_approved
    );
    if (src_approved) {
        const $alert = $(alert(
            `NFTs have already been approved for; you can migrate now.`,
            Alert.info
        ));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    }
    try {
        $(`.alert`).remove();
        await src_xpower.setApprovalForAll(
            tgt_xpower.address, true
        );
        const $alert = $(alert(
            `NFTs have successfully been approved for; you can migrate now.`,
            Alert.success
        ));
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
    const src_version = $execute.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const src_xpower = await XPowerNftFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $execute.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerNftFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const src_approved = await src_xpower.isApprovedForAll(
        x40(address), tgt_xpower.address
    );
    if (src_approved === false) {
        const $alert = $(alert(
            `Old NFTs have not been approved for! ` +
            `Did your approval transaction actually get confirmed? ` +
            `Wait a little bit and then retry.`,
            Alert.warning
        ));
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
    const src_balances: BigNumber[] = await src_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce((acc, b) => acc && b.isZero(), true);
    if (src_zero) {
        const $alert = $(alert(
            `Your old NFT balance is zero; nothing to migrate here.`,
            Alert.warning
        ));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    const nz = filter(ids, src_balances, { zero: false });
    try {
        $(`.alert`).remove();
        await tgt_xpower.migrateBatch(nz.ids, nz.balances);
        const $alert = $(alert(
            `Your old NFTs have successfully been migrated! ;)`,
            Alert.success, { id: 'success' }
        ));
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
$('button.burn-empty-nft').on('click', async function burnEmpty(ev) {
    const $burn = $(ev.target);
    if ($burn.hasClass('thor')) {
        await burn(Token.THOR, { $burn });
    }
    if ($burn.hasClass('loki')) {
        await burn(Token.LOKI, { $burn });
    }
    if ($burn.hasClass('odin')) {
        await burn(Token.ODIN, { $burn });
    }
});
async function burn(token: Token, { $burn }: {
    $burn: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const src_version = $burn.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const src_xpower = await XPowerNftFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const v3a_balances: BigNumber[] = await src_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug(
        `[${src_version}:balances]`, v3a_balances.map((b) => b.toString())
    );
    const zz = filter(ids, v3a_balances, {
        zero: true
    });
    try {
        $(`.alert`).remove();
        await src_xpower.burnBatch(
            x40(address), zz.ids, zz.balances
        );
        const $alert = $(alert(
            `Your old empty NFTs have successfully been burned! ;)`,
            Alert.success, { id: 'success' }
        ));
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
