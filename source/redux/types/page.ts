export enum Page {
    None = 'none',
    Home = 'home',
    Nfts = 'nfts',
    Staking = 'staking',
    About = 'about',
}
export function Pages(): Set<Page> {
    const ref = Page as typeof Page & {
        _set?: Set<Page>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(Page));
    }
    return ref._set;
}
export default Page;
