"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        full_name: zod_1.z
            .string("full_name must be string")
            .min(2, "full_name must be at least 3 characters long")
            .max(50, "full_name must not exceed 50 characters"),
        email: zod_1.z.email({
            error: (issue) => issue.input === undefined
                ? "email is required"
                : "invalid email format",
        }),
        password: zod_1.z
            .string("password must be string")
            .min(6, "password must be at least 6 characters long"),
    }),
    params: zod_1.z.object({}).default({}),
    query: zod_1.z.object({}).default({})
});
