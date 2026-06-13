import express from 'express'
import router from './routes/authRoutes'
import cookieParser from 'cookie-parser';
import controllerRouter from "./routes/controllerRoutes";
import cors from 'cors'

const app = express()

app.use(cors({
    origin:["http://localhost:3000",process.env.FRONTEND_URL!],
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

const PORT = Number(process.env.PORT)||3001

app.use('/auth',router)
app.use("/", controllerRouter)
app.listen(PORT,()=>{
    console.log(`Your app is running on ${PORT}`)
})