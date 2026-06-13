import { WebSocketServer,WebSocket }  from 'ws'
import  jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'
import {parse} from "cookie"
import { prisma } from "@repo/db/prisma";
import { CustomUserPayload } from '../types/express';

const port = Number(process.env.PORT) || 8080
const wss = new WebSocketServer({ port})

interface User{
    ws:WebSocket,
    userId:string,
    rooms:number[]
}

const users:User[] = []

wss.on('connection',(ws,request)=>{
    console.log("NEW CONNECTION")
    try {
        console.log("cookies:", request.headers.cookie)
        const cookies = parse(request.headers.cookie || "")
        const token = cookies.token
        console.log("TOKEN exists:" ,!!token)

    if(!token){
        console.log("NO TOKEN, CLOSING")
        ws.close()
        return
    }

    const decoded = jwt.verify(token,JWT_SECRET) 

    if(typeof decoded === "string"){
        ws.close()
        return
    }

    const user = decoded as CustomUserPayload
    const userId= user.id

    users.push({
        userId,
        rooms:[],
        ws
    })

    ws.on('message',async(data)=>{
        console.log("RAW MESSAGE:",data.toString())
        const parsedData = JSON.parse(data.toString())
        console.log("PARSED:",parsedData)
        if(parsedData.type === "join_room"){
            const user = users.find(x=>x.ws===ws)
            user?.rooms.push(Number(parsedData.roomId))
        }

        if(parsedData.type==="chat"){
            const roomId= Number(parsedData.roomId)
            const message = parsedData.message
        
            await prisma.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            })
            

            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId
                    }))
                }
            })
        }
    })
        
    } catch (error) {
        ws.close()
        console.log("MESSAGE ERROR:",error)
        
    }

    
})