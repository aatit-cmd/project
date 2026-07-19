"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception:", error);
    process.exit(1);
});
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./config/db.config");
const env_config_1 = __importDefault(require("./config/env.config"));
const nodemailer_config_1 = require("./config/nodemailer.config");
// dotenv.config()
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = env_config_1.default.PORT;
const DBI_URI = env_config_1.default.DB_URI;
//* connect database
(0, db_config_1.connectDatabase)(DBI_URI);
//* listen
const server = app_1.default.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    // sendEmail();
    (0, nodemailer_config_1.verifyMailServerConnection)();
});
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection:", error);
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT");
    server.close(async (error) => {
        console.log(error);
        await mongoose_1.default.disconnect();
        process.exit(0);
    });
    process.exit(0);
});
process.on("SIGTERM", (error) => {
    console.log("SIGTERM");
    server.close(async (error) => {
        console.log(error);
        await mongoose_1.default.disconnect();
        process.exit(0);
    });
});
