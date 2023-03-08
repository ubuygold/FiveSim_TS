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
export const FiveSim = (apiKey) => {
    let state = { id: undefined, stopCheck: false };
    const getId = (state) => {
        if (state.id !== undefined) {
            return state.id;
        }
        else {
            throw new Error("Id is undefined");
        }
        ;
    };
    const updateId = (state, id) => { return Object.assign(Object.assign({}, state), { id: id }); };
    const stopChecking = (state) => { return Object.assign(Object.assign({}, state), { stopCheck: true }); };
    const getStopCheck = (state) => { return state.stopCheck; };
    const axiosConfig = {
        baseURL: "https://5sim.net/v1/user/",
        headers: {
            "Authorization": "Bearer " + apiKey
        }
    };
    const getBalance = () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield axios.get("profile", axiosConfig);
        if (response.status === 200) {
            return response.data;
        }
        else {
            throw new Error("Error getting balance");
        }
    });
    const getAuthorizationNumber = (country, operator, name) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield axios.get("buy/activation/" + country + "/" + operator + "/" + name, axiosConfig);
        if (response.status === 200) {
            state = updateId(state, response.data.id);
            return response.data;
        }
        else {
            throw new Error("Error getting number");
        }
    });
    const checkOrder = () => __awaiter(void 0, void 0, void 0, function* () {
        const id = getId(state);
        let response = yield axios.get("check/" + id, axiosConfig);
        if (response.status === 200) {
            return response.data;
        }
        else {
            throw new Error("Error checking order");
        }
    });
    const finishOrder = () => __awaiter(void 0, void 0, void 0, function* () {
        const id = getId(state);
        state = stopChecking(state);
        let response = yield axios.get("finish/" + id, axiosConfig);
        if (response.status === 200) {
            return response.data;
        }
        else {
            throw new Error("Error finishing order");
        }
    });
    const banNumber = () => __awaiter(void 0, void 0, void 0, function* () {
        const id = getId(state);
        state = stopChecking(state);
        let response = yield axios.get("ban/" + id, axiosConfig);
        if (response.status === 200) {
            return response.data;
        }
        else {
            throw new Error("Error banning number");
        }
    });
    const cancelOrder = () => __awaiter(void 0, void 0, void 0, function* () {
        const id = getId(state);
        state = stopChecking(state);
        let response = yield axios.get("cancel/" + id, axiosConfig);
        if (response.status === 200) {
            return response.data;
        }
        else {
            throw new Error("Error cancelling order");
        }
    });
    const waitForCode = (interval = 500, stopCheckAfter = 100000) => __awaiter(void 0, void 0, void 0, function* () {
        new Promise(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Delay(stopCheckAfter);
            state = stopChecking(state);
        }));
        let code = undefined;
        while (true) {
            if (getStopCheck(state)) {
                break;
            }
            yield Delay(interval);
            try {
                let phoneCheck = yield checkOrder();
                // assert phoneCheck is not undefined
                if (phoneCheck === undefined) {
                    continue;
                }
                code = phoneCheck.sms[0].code;
                yield finishOrder();
            }
            catch (e) {
            }
        }
        if (code === undefined) {
            throw new Error("No code found");
        }
        return code;
    });
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
