import { IPhoneResponse } from './types/getPhoneTypes.js';
import { IProfile } from './types/balanceType.js';
import { IOrderResponse } from './types/orderResponse.js';
export declare class FiveSim {
    apiKey: string;
    stopCheck: boolean;
    interval: number;
    stopCheckAfter: number;
    id: number | undefined;
    manualId: number | undefined;
    constructor(apiKey: string);
    getBalance: () => Promise<IProfile>;
    getAuthorizationNumber: (country: string, operator: string, name: string) => Promise<IPhoneResponse>;
    waitForCode: (manualId?: number | undefined, interval?: number | undefined, stopCheckAfter?: number | undefined) => Promise<string>;
    checkOrder: (manualId?: number | undefined) => Promise<IOrderResponse>;
    finishOrder: (manualId?: number | undefined) => Promise<IOrderResponse>;
    cancelOrder: (manualId?: number | undefined) => Promise<IOrderResponse>;
    banNumber: (manualId?: number | undefined) => Promise<IOrderResponse>;
    isIdSet: (manualId: number | undefined) => boolean;
    stopChecking: () => void;
}
