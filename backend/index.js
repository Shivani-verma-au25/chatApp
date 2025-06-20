import { connectionToDatabase } from './src/db/database.js';
import { server } from './src/app.js';
const port = process.env.PORT || 5001


connectionToDatabase().then(() =>{
    server.listen( port , () => {
        console.log(`Server is Running on Port localhost:${port}`)
}) 
})
.catch((error) =>{
    console.log("error in connecting to databse" , error);
    
})

