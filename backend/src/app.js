import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import {Server} from 'socket.io'

const app = express()

export const server = http.createServer(app)

const io = new Server(server , {
    cors: {
    origin: ["http://localhost:5173"],
  }
})


// middlewaers
app.use(express.json({limit: '50mb' }))
app.use(express.urlencoded({extended : true , limit: "50mb"}))
app.use(cookieParser())
app.use(express.static('public'))
app.use(cors({
    origin : process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    // methods : ['GET','POST','PUT']
}))


// importing routers here
import AuthRouter from './routes/auth.router.js' 
import messageRouter from "./routes/message.router.js"


app.use('/api/auth', AuthRouter)
app.use('/api/message', messageRouter)


// sockets

io.on('connection', (socket) => {
    console.log("✅A user connected " , socket.id);

    socket.on("disconnect" , () => {
        console.log("❌A user disconnected", socket.id);
    })
})


export {app}