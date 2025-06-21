import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import {Server} from 'socket.io'
import path from 'path'

const __dirname = path.resolve();
const app = express()

export const server = http.createServer(app)

export const io = new Server(server , {
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


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname , '../dist')))   

    app.get('*', (req ,res) => {
        res.sendFile(path.join(__dirname ,"../dist" ,"index.html"))
    })
}


// sockets
// used to store online users


export function getReceiveSocketId (useId)  {
    return userSocketMap[useId]
 }

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
    console.log("✅A user connected " , socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    

     // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect" , () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
}) 



export {app}