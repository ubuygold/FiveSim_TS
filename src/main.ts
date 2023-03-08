import { IResponse } from './types/getPhoneTypes.js';
import { IProfile } from './types/balanceType.js';
import axios from "axios";
import Delay from "delay";
import { IOrderResponse } from './types/orderResponse.js';
import _ from 'lodash';
import { IState } from './types/IState.js';

export const FiveSim = (apiKey: string) => {

    let state: IState = { id: undefined, stopCheck: false };

    const getId = (state: IState): number | undefined => {
        if (state.id !== undefined) {
            return state.id;
        } else {
            throw new Error("Id is undefined");
        };
    };

    const updateId = (state: IState, id: number): IState => { return { ...state, id: id }; };

    const stopChecking = (state: IState): IState => { return { ...state, stopCheck: true }; };

    const getStopCheck = (state: IState): boolean => { return state.stopCheck; };

    const axiosConfig = {
        baseURL: "https://5sim.net/v1/user/",
        headers: {
            "Authorization": "Bearer " + apiKey
        }
    };

    const getBalance = async (): Promise<IProfile> => {
        let response = await axios.get("profile", axiosConfig);
        if (response.status === 200) {
            return response.data;
        } else { throw new Error("Error getting balance"); }
    };

    const getAuthorizationNumber = async (country: string, operator: string, name: string): Promise<IResponse> => {
        let response = await axios.get("buy/activation/" + country + "/" + operator + "/" + name, axiosConfig);
        if (response.status === 200) {
            state = updateId(state, response.data.id);
            return response.data;
        } else { throw new Error("Error getting number"); }
    };

    const checkOrder = async (): Promise<IOrderResponse> => {
        const id = getId(state);
        let response = await axios.get("check/" + id, axiosConfig);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error checking order");
        }
    };

    const finishOrder = async (): Promise<IOrderResponse> => {
        const id = getId(state);
        state = stopChecking(state);
        let response = await axios.get("finish/" + id, axiosConfig);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error finishing order");
        }

    };

    const banNumber = async (): Promise<IOrderResponse> => {
        const id = getId(state);
        state = stopChecking(state);
        let response = await axios.get("ban/" + id, axiosConfig);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error banning number");
        }
    };

    const cancelOrder = async (): Promise<IOrderResponse> => {
        const id = getId(state);
        state = stopChecking(state);
        let response = await axios.get("cancel/" + id, axiosConfig);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error cancelling order");
        }

    };

    const waitForCode = async (interval = 500, stopCheckAfter = 100000): Promise<string> => {
        const id = getId(state);
        state = stopChecking(state);
        let stopCheck: boolean = false;
        new Promise(async () => {
            await Delay(stopCheckAfter);
            state = stopChecking(state);
        });

        let code: string | undefined = undefined;

        while (true) {
            if (getStopCheck(state)) {
                break;
            }
            await Delay(interval);
            try {
                let phoneCheck = await checkOrder();
                // assert phoneCheck is not undefined
                if (phoneCheck === undefined) { continue; }
                code = phoneCheck.sms[0].code;
                await finishOrder();
                return code;
            } catch (e) {

            }
        }
        if (code === undefined) {
            throw new Error("No code found");
        }
        return code;

    };


    return {
        getBalance: getBalance,
        getAuthorizationNumber: getAuthorizationNumber,
        checkOrder: checkOrder,
        finishOrder: finishOrder,
        banNumber: banNumber,
        cancelOrder: cancelOrder,
        waitForCode: waitForCode
    };


};
