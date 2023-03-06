export declare class FiveSim {
    apiKey: string;
    stopCheck: boolean;
    interval: number;
    stopCheckAfter: number;
    id: number | undefined;
    constructor(apiKey: string);
    getBalance: () => Promise<any>;
    getAuthorizationNumber: (country: string, operator: string, name: string) => Promise<any>;
    waitForCode: (manualId: number | undefined, interval: number | undefined, stopCheckAfter: number | undefined) => Promise<any>;
    checkOrder: (manualId: number | undefined) => Promise<any>;
    finishOrder: (manualId: number | undefined) => Promise<any>;
    cancelOrder: (manualId: number | undefined) => Promise<any>;
    banNumber: (manualId: number | undefined) => Promise<any>;
    isIdSet: (manualId: number | undefined) => boolean;
    stopChecking: () => void;
}
