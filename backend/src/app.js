import exprees from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = exprees()


// middlewaers
app.use(exprees.json())
app.use(exprees.urlencoded({extended : true}))
app.use(cookieParser())
app.use(exprees.static('public'))
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

export {app}