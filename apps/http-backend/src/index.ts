import express from 'express'

const app = express()
const PORT = 3000



app.listen(PORT,()=>{
    console.log(`Your app is running on ${PORT}`)
})