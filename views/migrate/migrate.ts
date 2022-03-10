/* eslint @typescript-eslint/no-explicit-any: [off] */
import './migrate.scss';

import { Blockchain } from '../../source/blockchain';
import { alert, Alert, x40 } from '../../source/functions';
import { Token } from '../../source/redux/types';
import { XPowerFactory } from '../../source/xpower';

$(window).on('load', function enableAllowanceButton() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approve = $('.approve-allowance');
            $approve.prop('disabled', false);
        });
    }
});
$('button.approve-allowance').on('click', async function approveTokens(ev) {
    const $approve = $(ev.target);
    if ($approve.hasClass('para')) {
        await approve(Token.PARA, {
            $approve, $execute: $('.execute-migration.para')
        });
    }
    if ($approve.hasClass('aqch')) {
        await approve(Token.AQCH, {
            $approve, $execute: $('.execute-migration.aqch')
        });
    }
    if ($approve.hasClass('qrsh')) {
        await approve(Token.QRSH, {
            $approve, $execute: $('.execute-migration.qrsh')
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
    const v2_xpower = XPowerFactory({ token, version: 'v2' });
    const v3_xpower = XPowerFactory({ token, version: 'v3b' });
    const v2_balance = await v2_xpower.balanceOf(x40(address));
    const v2_allowance = await v2_xpower.allowance(x40(address), v3_xpower.address);
    console.debug('[v2:allowance]', v2_allowance.toNumber());
    if (v2_allowance.gte(v2_balance)) {
        const $alert = $(alert(`Allowance has already been approved; you can migrate now.`, Alert.info));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    }
    try {
        $(`.alert`).remove();
        await v2_xpower.increaseAllowance(
            v3_xpower.address, v2_balance.sub(v2_allowance)
        );
        const $alert = $(alert(`Allowance has successfully been approved; you can migrate now.`, Alert.success));
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
$('button.execute-migration').on('click', async function migrateTokens(ev) {
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
    const v2_xpower = XPowerFactory({ token, version: 'v2' });
    const v2_balance = await v2_xpower.balanceOf(x40(address));
    console.debug('[v2:balance]', v2_balance.toNumber());
    if (v2_balance.isZero()) {
        const $alert = $(alert(`Old balance is zero; nothing to migrate here. Do you have the correct wallet address selected?`, Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    const v3_xpower = XPowerFactory({ token, version: 'v3b' });
    const v3_spender = v3_xpower.address;
    const v2_allowance = await v2_xpower.allowance(x40(address), v3_spender);
    console.debug('[v2:allowance]', v2_allowance.toNumber());
    if (v2_allowance.isZero()) {
        const $alert = $(alert(`Old allowance is zero; approve allowance! Did your allowance transaction actually get confirmed? Wait a little bit and then retry.`, Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    try {
        $(`.alert`).remove();
        await v3_xpower.migrate(v2_balance);
        const $alert1 = $(alert(`Your old balance has successfully been migrated! ;)`, Alert.success, {
            id: 'success'
        }));
        $alert1.insertAfter($execute.parent('div'));
        const $alert2 = $(alert('Don\'t forget to add the new tokens to your Metamask wallet.', Alert.info, {
            id: 'info'
        }));
        $alert2.insertAfter($alert1);
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
