
"use client"
import { HTTP_BACKEND, WS_URL } from "@/config"

import { useEffect,  useState } from "react"
import Canvas from "./Canvas"

import api from "@/lib/api"






export default function RoomCanvas ({slug}:{slug:string}){
    
    const [socket,setSocket] = useState<WebSocket|null>(null)
    const [roomId,setRoomId] = useState<number | null>(null)

    useEffect(() => {
    async function loadRoom() {
        const res = await api.get(`${HTTP_BACKEND}/room/${slug}`)

        setRoomId(res.data.roomId)
    }

    loadRoom()
}, [slug])

    useEffect(()=>{
         if(roomId === null){
            return
         }
        
        
        const token = localStorage.getItem("token")
        const ws = new WebSocket(`${WS_URL}?token=${token}`);


        ws.onopen= ()=>{
           
            setSocket(ws)
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }
       
        return ()=>{
            ws.close()

        }
    },[roomId])

    if(roomId === null){
        return <div>Loading room...</div>
    }
    if(!socket){
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId ={roomId} socket={socket}  />
        
        
    </div>
}