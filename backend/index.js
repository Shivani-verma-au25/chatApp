import {app} from './src/app.js'
import { connectionToDatabase } from './src/db/database.js';

const port = process.env.PORT || 5001


connectionToDatabase().then(() =>{
    app.listen( port , () => {
        console.log(`Server is Running on Port localhost:${port}`)
}) 
})
.catch((error) =>{
    console.log("error in connecting to databse" , error);
    
})

