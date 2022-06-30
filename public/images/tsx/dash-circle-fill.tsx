import React from 'react';

export function DashCircle(
    { fill } = { fill: false }
) {
    return fill
        ? <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-dash-circle-fill' fill='currentColor' width='16' height='16' viewBox='0 0 16 16'>
            <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z' />
        </svg>
        : <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-dash-circle' fill='currentColor' width='16' height='16' viewBox='0 0 16 16'>
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z' />
        </svg>;
}
export default DashCircle;
