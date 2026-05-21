import express from 'express'
import router from './routes/authRoutes'


const app = express()

app.use(express.json())
const PORT = 3000

app.use('/auth',router)
app.listen(PORT,()=>{
    console.log(`Your app is running on ${PORT}`)
})