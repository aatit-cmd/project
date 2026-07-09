import "dotenv/config"
import app from "./app";
import { connectDatabase } from "./config/db.config";

// dotenv.config()
 
const PORT = process.env.PORT;
const DBI_URI = process.env.DBI_URI ?? "";

//* connect database
connectDatabase(DBI_URI);

//* listen
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
