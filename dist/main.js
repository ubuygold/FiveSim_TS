var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import Delay from "delay";
export class FiveSim {
    constructor(apiKey) {
        this.getBalance = () => __awaiter(this, void 0, void 0, function* () {
            const config = {
                method: "get",
                url: "https://5sim.net/v1/user/profile",
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey
                }
            };
            let response = yield axios(config);
            if (response.status === 200) {
                return response.data;
            }
            else {
                throw new Error("Error getting balance");
            }
        });
        this.getAuthorizationNumber = (country, operator, name) => __awaiter(this, void 0, void 0, function* () {
            let config = {
                method: 'get',
                url: 'https://5sim.net/v1/user/buy/activation/' + country + '/' + operator + '/' + name,
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey
                }
            };
            let response = yield axios(config);
            this.id = response.data.id;
            if (response.status === 200) {
                return response.data;
            }
            else {
                throw new Error("Error getting number");
            }
        });
        this.waitForCode = (manualId, interval, stopCheckAfter) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isIdSet(manualId)) {
                throw new Error("Must request number first");
            }
            if (interval !== undefined) {
                this.interval = interval;
            }
            if (stopCheckAfter !== undefined) {
                this.stopCheckAfter = stopCheckAfter;
            }
            new Promise(() => __awaiter(this, void 0, void 0, function* () {
                yield Delay(this.stopCheckAfter);
                this.stopCheck = true;
            }));
            let code = undefined;
            while (true) {
                if (this.stopCheck) {
                    break;
                }
                yield Delay(this.interval);
                try {
                    let phoneCheck = yield this.checkOrder();
                    // assert phoneCheck is not undefined
                    if (phoneCheck === undefined) {
                        continue;
                    }
                    code = phoneCheck.sms[0].code;
                    new Promise(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.finishOrder(this.id);
                    }));
                    break;
                }
                catch (e) {
                }
            }
            if (code === undefined) {
                throw new Error("No code found");
            }
            return code;
        });
        this.checkOrder = (manualId) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isIdSet(manualId)) {
                throw new Error("Must request number first");
            }
            let config = {
                method: 'get',
                url: 'https://5sim.net/v1/user/check/' + this.id,
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey
                }
            };
            let response = yield axios(config);
            return response.data;
        });
        this.finishOrder = (manualId) => __awaiter(this, void 0, void 0, function* () {
            this.stopChecking();
            if (!this.isIdSet(manualId)) {
                console.log("Must request number first");
                throw new Error("Must request number first");
            }
            let config = {
                method: 'get',
                url: 'https://5sim.net/v1/user/finish/' + this.id,
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey
                }
            };
            let response = yield axios(config);
            return response.data;
        });
        this.cancelOrder = (manualId) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isIdSet(manualId)) {
                console.log("Must request number first");
                throw new Error("Must request number first");
            }
            this.stopChecking();
            let config = {
                method: 'get',
                url: 'https://5sim.net/v1/user/cancel/' + this.id,
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey
                }
            };
            let response = yield axios(config);
            return response.data;
        });
        this.banNumber = (manualId) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isIdSet(manualId)) {
                console.log("Must request number first");
                throw new Error("Must request number first");
            }
            this.stopChecking();
            let config = {
                method: 'get',
                url: 'https://5sim.net/v1/user/ban/' + this.id,
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey
                }
            };
            let response = yield axios(config);
            return response.data;
        });
        this.isIdSet = (manualId) => {
            if (this.id === undefined && manualId === undefined) {
                return false;
            }
            if (this.id === undefined) {
                this.id = manualId;
            }
            return true;
        };
        this.stopChecking = () => {
            this.stopCheck = true;
        };
        this.apiKey = apiKey;
        this.stopCheck = false;
        this.interval = 500;
        this.stopCheckAfter = 100000;
    }
}
