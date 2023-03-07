import { IPhoneResponse } from './types/getPhoneTypes.js';
import { IProfile } from './types/balanceType.js';
import axios from "axios"
import Delay from "delay"
import { IOrderResponse } from './types/orderResponse.js';

export class FiveSim {
    apiKey: string;
    stopCheck: boolean;
    interval: number;
    stopCheckAfter: number;
    id: number | undefined;
    manualId: number | undefined;

    constructor(apiKey: string) {
        this.apiKey = apiKey
        this.stopCheck = false
        this.interval = 500
        this.stopCheckAfter = 100000
    }

    getBalance = async (): Promise<IProfile> => {

        const config = {
            method: "get",
            url: "https://5sim.net/v1/user/profile",
            headers: {
                'Authorization': 'Bearer ' + this.apiKey
            }
        }
        let response = await axios(config)
        if (response.status === 200) {
            return response.data
        } else { throw new Error("Error getting balance") }
    }

    getAuthorizationNumber = async (country: string, operator: string, name: string): Promise<IPhoneResponse> => {
        let config = {
            method: 'get',
            url: 'https://5sim.net/v1/user/buy/activation/' + country + '/' + operator + '/' + name,
            headers: {
                'Authorization': 'Bearer ' + this.apiKey
            }
        }
        let response = await axios(config)
        this.id = response.data.id
        if (response.status === 200) {
            return response.data
        } else { throw new Error("Error getting number") }
    }

    waitForCode = async (manualId?: number, interval?: number, stopCheckAfter?: number): Promise<string> => {
        if (!this.isIdSet(manualId)) {
            throw new Error("Must request number first")
        }
        if (interval !== undefined) {
            this.interval = interval
        }

        if (stopCheckAfter !== undefined) {
            this.stopCheckAfter = stopCheckAfter
        }


        new Promise(async () => {
            await Delay(this.stopCheckAfter)
            this.stopCheck = true
        })

        let code = undefined
        while (true) {
            if (this.stopCheck) {
                break
            }
            await Delay(this.interval)
            try {
                let phoneCheck = await this.checkOrder()
                // assert phoneCheck is not undefined
                if (phoneCheck === undefined) { continue }
                code = phoneCheck.sms[0].code;
                new Promise(async () => {
                    await this.finishOrder(this.id)
                })
                break
            } catch (e) {

            }
        }

        if (code === undefined) {
            throw new Error("No code found")
        }
        return code

    }

    checkOrder = async (manualId?: number): Promise<IOrderResponse> => {
        if (!this.isIdSet(manualId)) {
            throw new Error("Must request number first")
        }

        let config = {
            method: 'get',
            url: 'https://5sim.net/v1/user/check/' + this.id,
            headers: {
                'Authorization': 'Bearer ' + this.apiKey
            }
        }

        let response = await axios(config)
        return response.data

    }
    finishOrder = async (manualId?: number): Promise<IOrderResponse> => {
        this.stopChecking()
        if (!this.isIdSet(manualId)) {
            console.log("Must request number first")
            throw new Error("Must request number first")
        }

        let config = {
            method: 'get',
            url: 'https://5sim.net/v1/user/finish/' + this.id,
            headers: {
                'Authorization': 'Bearer ' + this.apiKey
            }
        }
        let response = await axios(config)
        return response.data

    }

    cancelOrder = async (manualId?: number): Promise<IOrderResponse> => {
        if (!this.isIdSet(manualId)) {
            console.log("Must request number first")
            throw new Error("Must request number first")
        }
        this.stopChecking()
        let config = {
            method: 'get',
            url: 'https://5sim.net/v1/user/cancel/' + this.id,
            headers: {
                'Authorization': 'Bearer ' + this.apiKey
            }
        }
        let response = await axios(config)

        return response.data

    }
    banNumber = async (manualId?: number): Promise<IOrderResponse> => {
        if (!this.isIdSet(manualId)) {
            console.log("Must request number first")
            throw new Error("Must request number first")
        }
        this.stopChecking()
        let config = {
            method: 'get',
            url: 'https://5sim.net/v1/user/ban/' + this.id,
            headers: {
                'Authorization': 'Bearer ' + this.apiKey
            }


        }
        let response = await axios(config)
        return response.data
    }
    isIdSet = (manualId: number | undefined): boolean => {
        if (this.id === undefined && manualId === undefined) {
            return false
        }
        if (this.id === undefined) {
            this.id = manualId
        }
        return true;
    }
    stopChecking = () => {
        this.stopCheck = true
    }

}
