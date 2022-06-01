import { applyMiddleware, compose } from 'redux';
import { logger } from './logger';

export function middleware<Ext, S>(configuration: {
    /** flag for console logging */
    logger: boolean
}) {
    return [
        compose(
            configuration.logger
                ? applyMiddleware<Ext, S>(logger)
                : applyMiddleware<Ext, S>()
        )
    ];
}
export default middleware;
