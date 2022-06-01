import { App } from '../app';
import { Token } from '../redux/types';

export function address({
    infix, version, token
}: {
    infix: string, version?: typeof App.version, token?: Token
}): string {
    if (version === undefined) {
        version = App.version;
    }
    const id = `#g-${token ?? App.token}_${infix}_${version}`;
    const address = $(id).data('value');
    if (!address) {
        throw new Error(`missing ${id}`);
    }
    return address;
}
export default address;
