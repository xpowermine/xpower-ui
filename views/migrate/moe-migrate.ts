/* eslint @typescript-eslint/no-explicit-any: [off] */
import './moe-migrate.scss';

import { Blockchain } from '../../source/blockchain';
import { alert, Alert, x40 } from '../../source/functions';
import { Token } from '../../source/redux/types';
import { XPowerFactory } from '../../source/contract';

$(window).on('load', async function enableAllowanceButton() {
    if (await Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approve = $('.approve-allowance');
            $approve.prop('disabled', false);
        });
    }
});
$('button.approve-allowance').on(
    'click', async function approveTokens(ev) {
        const $approve = $(ev.target);
        const $allowance = $approve.parents('form.moe-allowance');
        const $migration = $allowance.next('form.moe-migration');
        if ($approve.hasClass('thor')) {
            await approve(Token.THOR, {
                $approve, $execute: $migration.find('.execute-migration.thor')
            });
        }
        if ($approve.hasClass('loki')) {
            await approve(Token.LOKI, {
                $approve, $execute: $migration.find('.execute-migration.loki')
            });
        }
        if ($approve.hasClass('odin')) {
            await approve(Token.ODIN, {
                $approve, $execute: $migration.find('.execute-migration.odin')
            });
        }
    }
);
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
    const src_xpower = await XPowerFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $approve.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const src_balance = await src_xpower.balanceOf(
        x40(address)
    );
    const src_allowance = await src_xpower.allowance(
        x40(address), tgt_xpower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toNumber()
    );
    if (src_allowance.gte(src_balance)) {
        const $alert = $(alert(
            `Allowance has already been approved; you can migrate now.`,
            Alert.info
        ));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    }
    try {
        $(`.alert`).remove();
        await src_xpower.increaseAllowance(
            tgt_xpower.address, src_balance.sub(src_allowance)
        );
        const $alert = $(alert(
            `Allowance has successfully been approved; you can migrate now.`,
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
$('button.execute-migration').on(
    'click', async function migrateTokens(ev) {
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
    }
);
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
    const src_xpower = await XPowerFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $execute.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const src_balance = await src_xpower.balanceOf(
        x40(address)
    );
    console.debug(
        `[${src_version}:balance]`, src_balance.toNumber()
    );
    if (src_balance.isZero()) {
        const $alert = $(alert(
            `Your old balance is zero; nothing to migrate here.`,
            Alert.warning
        ));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    const tgt_spender = tgt_xpower.address;
    const src_allowance = await src_xpower.allowance(
        x40(address), tgt_spender
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toNumber()
    );
    if (src_allowance.isZero()) {
        const $alert = $(alert(
            `Old allowance is zero; approve allowance! ` +
            `Did your allowance transaction actually get confirmed? ` +
            `Wait a little bit and then retry.`,
            Alert.warning
        ));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    try {
        $(`.alert`).remove();
        await tgt_xpower.migrate(src_balance);
        const $alert = $(alert(
            `Your old balance has successfully been migrated! ;)`,
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
