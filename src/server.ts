process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error);
  process.exit(1);
});

import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/db.config";
import ENV_CONFIG from "./config/env.config";
import { verifyMailServerConnection } from "./config/nodemailer.config";
// dotenv.config()
import mongoose from "mongoose";

const PORT = ENV_CONFIG.PORT;
const DBI_URI = ENV_CONFIG.DB_URI;

//* connect database
connectDatabase(DBI_URI);

//* listen
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  // sendEmail();
  verifyMailServerConnection();
});

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection:", error);
  process.exit(1);
});

// development ctrl + c
process.on("SIGINT", () => {
  console.log("SIGINT");
  server.close(async (error) => {
    console.log(error);
    await mongoose.disconnect();
    process.exit(0);
  });
  process.exit(0);
});

// production (pm2 , docker)
process.on("SIGTERM", (error) => {
  console.log("SIGTERM");
  server.close(async (error) => {
    console.log(error);
    await mongoose.disconnect();
    process.exit(0);
  });
});
