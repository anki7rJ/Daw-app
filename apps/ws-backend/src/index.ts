import { WebSocketServer }  from 'ws'
import  jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'

const wss = new WebSocketServer({ port:8080})

wss.on('connection',(ws,request)=>{
    const url = request.url // ws://roulltte-api?token=123233
    if(!url){
        return 
    }
    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get('token') || ""
    const decoded = jwt.verify(token,JWT_SECRET) 

    if(typeof decoded =="string"){
        ws.close()
        return
    }

    if(!decoded || !decoded.user?.id){
        ws.close()
        return
    }
 
    ws.on('message',(data)=>{
        ws.send('pong')
       
    })
})