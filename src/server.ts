import "dotenv/config"
import app from "./app";
import { connectDatabase } from "./config/db.config";
import ENV_CONFIG from "./config/env.config";
import { verifyMailServerConnection } from "./config/nodemailer.config";
// dotenv.config()
 
const PORT = ENV_CONFIG.PORT;
const DBI_URI = ENV_CONFIG.DB_URI;

//* connect database
connectDatabase(DBI_URI);

//* listen
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  verifyMailServerConnection();
});
