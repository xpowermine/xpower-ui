export type Refresh = {
    type: 'refresh/by-date', payload: {
        date: string
    }
};
export const refresh = (): Refresh => ({
    type: 'refresh/by-date', payload: {
        date: new Date().toISOString()
    }
});
export type Action = Refresh;
