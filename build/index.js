"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sayHello_1 = __importDefault(require("./sayHello"));
exports.sayHello = sayHello_1.default;
exports.vas = () => 'VASILIS';
exports.default = {
    sayHello: sayHello_1.default,
};
