import { App } from '../app';
import { Tokenizer } from '../token';
import { Token } from '../redux/types';

export function address({
    infix, version, token
}: {
    infix: string, version?: typeof App.version, token?: Token
}): string {
    if (version === undefined) {
        version = App.version;
    }
    const symbol = Tokenizer.symbolAlt(token ?? App.token);
    const element_id = `#g-${symbol}_${infix}_${version}`;
    const address = $(element_id).data('value');
    if (!address) {
        throw new Error(`missing ${element_id}`);
    }
    return address;
}
export default address;
