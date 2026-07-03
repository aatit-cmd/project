import app from "./app";
import { connectDatabase } from "./config/db.config";
const PORT =8080;
const DBI_URI = "mongodb://localhost:27017/project"
//* connect database
connectDatabase(DBI_URI);

//* listen
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})