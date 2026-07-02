import app from "./app";

const PORT =8080;

//* connect database

//* listen
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})