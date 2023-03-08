import { IResponse } from './types/getPhoneTypes.js';
import { IProfile } from './types/balanceType.js';
import { IOrderResponse } from './types/orderResponse.js';
export declare const FiveSim: (apiKey: string) => {
    getBalance: () => Promise<IProfile>;
    getAuthorizationNumber: (country: string, operator: string, name: string) => Promise<IResponse>;
    checkOrder: () => Promise<IOrderResponse>;
    finishOrder: () => Promise<IOrderResponse>;
    banNumber: () => Promise<IOrderResponse>;
    cancelOrder: () => Promise<IOrderResponse>;
    waitForCode: (interval?: number, stopCheckAfter?: number) => Promise<string>;
};
