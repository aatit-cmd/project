"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        //! if error
        if (!result.success) {
            const errors = result.error.issues.map(({ message, path }) => {
                return { path: path.join("."), message };
            });
            return next(new appError_utils_1.default("validation error", 400, errors));
        }
        //* if validation success
        req.body = result.data.body;
        req.params = result.data.params;
        Object.assign(req.query, result.data.query);
        next();
    };
};
exports.validate = validate;
