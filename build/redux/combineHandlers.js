"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
exports.buildHandler = (handlers) => {
    return lodash_1.default.reduce(handlers, (result, value, keyString) => {
        keyString.split(',').map((key) => (result[key] = value));
        return result;
    }, {});
};
const combineHandlers = (handlers, defaultState) => {
    return function reducer(state = defaultState, action) {
        const handler = handlers[action.type];
        return handler ? handler(state, action) : state;
    };
};
exports.default = {
    combineHandlers: (handlers, defaultState) => combineHandlers(handlers, defaultState),
};
