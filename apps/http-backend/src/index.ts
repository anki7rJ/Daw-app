import express from 'express'
import router from './routes/authRoutes'
import cookieParser from 'cookie-parser';


const app = express()

app.use(express.json())
app.use(cookieParser())
const PORT = 3001

app.use('/auth',router)

app.listen(PORT,()=>{
    console.log(`Your app is running on ${PORT}`)
})