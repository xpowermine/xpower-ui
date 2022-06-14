import { Page } from "../types";

export type SwitchPage = {
    type: 'page/switch', payload: {
        page: Page
    }
};
export const switchPage = (
    page: Page
): SwitchPage => ({
    type: 'page/switch', payload: {
        page
    }
});
export type Action = SwitchPage;
