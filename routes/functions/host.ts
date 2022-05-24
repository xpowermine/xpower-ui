import { Request } from 'express';

export function host(req: Request): string {
    const xfp = req.headers['x-forwarded-proto'];
    const protocol = xfp ? xfp : req.protocol;
    const xfh = req.headers['x-forwarded-host'];
    const authority = xfh ? xfh : req.headers.host;
    return `${protocol}://${authority}`;
}
export default host;
