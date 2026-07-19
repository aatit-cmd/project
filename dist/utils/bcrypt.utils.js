"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//* hashPassword
const hashPassword = async (password) => {
    try {
        // salt
        const salt = await bcryptjs_1.default.genSalt(10);
        // hash
        const hash = await bcryptjs_1.default.hash(password, salt);
        return hash;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.hashPassword = hashPassword;
//* compare password
const comparePassword = async (password, hash) => {
    try {
        return await bcryptjs_1.default.compare(password, hash);
    }
    catch (error) {
        throw error;
    }
};
exports.comparePassword = comparePassword;
