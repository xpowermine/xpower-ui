import React from 'react';

export function Avalanche(
    { source, height, width }: Partial<{
        source: string, height: string, width: string
    }>
) {
    if (source === undefined) {
        source = '/images/png/avalanche-icon/avalanche-64x64.png';
    }
    return <img
        alt="Avalanche"
        height={height ?? 24}
        src={source}
        width={width ?? 24}
    />;
}
export default Avalanche;
