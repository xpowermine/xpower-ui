import { App } from '../../../source/app';
import { update } from '../../../source/functions';
import { Address, Amount, Supply, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel, NftLevels } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React from 'react';
import { NftImage } from './image';
import { NftTxTarget } from './tx-target';
import { NftTxAmount } from './tx-amount';
import { NftTxSender } from './tx-sender';
import { NftTxExpander } from './tx-expander';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    level: NftLevel;
    toggled: boolean;
}
type State = Record<NftLevel, Record<NftIssue, {
    target: {
        valid: boolean | null,
        value: Address | null
    };
    amount: {
        valid: boolean | null,
        value: Amount | null
    };
}>>
function state(
    target = { valid: null, value: null },
    amount = { valid: null, value: null }
) {
    const state = Object.fromEntries(
        Array.from(NftLevels()).map((nft_level) => [
            nft_level, Object.fromEntries(
                Array.from(Years()).map((nft_issue) => [
                    nft_issue, { target, amount }
                ])
            )
        ])
    );
    return state as State;
}
export class NftDetail extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = state();
    }
    render() {
        const years = Array.from(Years()).reverse();
        return <React.Fragment>{
            years.map((year) => this.$row(
                years[0], year, this.props.level
            ))
        }</React.Fragment>;
    }
    $row(
        curr_year: NftIssue,
        nft_issue: NftIssue,
        nft_level: NftLevel,
    ) {
        const nft_token = Nft.token(
            this.props.token
        );
        const core_id = Nft.coreId({
            issue: nft_issue,
            level: nft_level,
        });
        const full_id = Nft.fullId({
            issue: nft_issue,
            level: nft_level,
            token: nft_token
        });
        const nfts = App.getNfts({
            issue: nft_issue,
            level: nft_level,
            token: nft_token
        });
        const nft = nfts.items[full_id] ?? {
            amount: 0n, supply: 0n
        };
        return <React.Fragment key={core_id}>
            <div className='row year'
                data-year={nft_issue} data-state={
                    curr_year - nft_issue ? 'off' : 'on'
                }
                style={{
                    display: curr_year - nft_issue ? 'none' : 'flex'
                }}
            >
                <div className='col-sm nft-details-lhs'>
                    {this.$image(nft_issue, nft_level)}
                </div>
                <div className='col-sm nft-details-rhs'>
                    {this.$issue(nft_issue, nft_level)}
                    {this.$balance(nft_issue, nft_level, nft)}
                    {this.$supply(nft_issue, nft_level, nft)}
                    {this.$expander(nft_level)}
                    {this.$target(nft_issue, nft_level, nft)}
                    {this.$amount(nft_issue, nft_level, nft)}
                    {this.$sender(nft_issue, nft_level)}
                </div>
            </div>
            <hr className='year' style={{
                display: curr_year - nft_issue ? 'none' : 'block'
            }} />
        </React.Fragment>;
    }
    $image(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { toggled, token } = this.props;
        return <NftImage
            token={token}
            level={nft_level}
            issue={nft_issue}
            toggled={toggled}
        />;
    }
    $issue(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        return <React.Fragment>
            <label className='form-label'>
                Year of Issuance
            </label>
            <div className='input-group nft-issuance-year'>
                <input className='form-control' readOnly
                    type='number' value={nft_issue}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Year of issuance of these ${Nft.nameOf(nft_level)} NFTs`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $balance(
        nft_issue: NftIssue, nft_level: NftLevel,
        { amount: balance }: { amount: Amount }
    ) {
        return <React.Fragment>
            <label className='form-label'>
                Personal Balance
            </label>
            <div className='input-group nft-balance'>
                <input className='form-control' readOnly
                    type='number' value={balance.toString()}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Personal balance of ${Nft.nameOf(nft_level)} NFTs (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $supply(
        nft_issue: NftIssue, nft_level: NftLevel,
        { supply }: { supply: Supply }
    ) {
        return <React.Fragment>
            <label className='form-label'>
                Total Supply
            </label>
            <div className='input-group nft-total-supply'>
                <input className='form-control' readOnly
                    type='number' value={supply.toString()}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Total supply of ${Nft.nameOf(nft_level)} NFTs minted so far (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $expander(
        nft_level: NftLevel
    ) {
        return <NftTxExpander
            level={nft_level}
        />;
    }
    $target(
        nft_issue: NftIssue, nft_level: NftLevel,
        { amount: balance }: { amount: Amount }
    ) {
        const by_level = this.state[nft_level];
        const by_issue = by_level[nft_issue];
        const { target } = by_issue;
        return <NftTxTarget
            balance={balance}
            issue={nft_issue}
            level={nft_level}
            valid={target.valid}
            onChange={(value, flag) => {
                update<State>.bind(this)({
                    [nft_level]: {
                        [nft_issue]: {
                            target: { valid: flag, value }
                        }
                    }
                });
            }}
        />;
    }
    $amount(
        nft_issue: NftIssue, nft_level: NftLevel,
        { amount: balance }: { amount: Amount }
    ) {
        const by_level = this.state[nft_level];
        const by_issue = by_level[nft_issue];
        const { amount } = by_issue;
        return <NftTxAmount
            balance={balance}
            issue={nft_issue}
            level={nft_level}
            valid={amount.valid}
            value={amount.value}
            onChange={(value, flag) => {
                update<State>.bind(this)({
                    [nft_level]: {
                        [nft_issue]: {
                            amount: { valid: flag, value }
                        }
                    }
                });
            }}
        />;
    }
    $sender(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { token } = this.props;
        const by_level = this.state[nft_level];
        const by_issue = by_level[nft_issue];
        const { target, amount } = by_issue;
        return <NftTxSender
            token={token}
            issue={nft_issue}
            level={nft_level}
            target={target}
            amount={amount}
            onSent={() => {
                update<State>.bind(this)({
                    [nft_level]: {
                        [nft_issue]: {
                            amount: {
                                valid: null,
                                value: null
                            }
                        }
                    }
                });
            }}
        />;
    }
}
export default NftDetail;
