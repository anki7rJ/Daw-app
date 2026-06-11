import { WS_URL } from "@/config"
import { initDraw } from "@/draw"

import { useEffect, useRef, useState } from "react"

export default function Canvas({
    roomId,
    socket
}:{
    socket:WebSocket
    roomId:Number

},){

    const canvasRef = useRef<HTMLCanvasElement>(null)
    

    useEffect(()=>{
        if(canvasRef.current){
            initDraw(canvasRef.current,roomId,socket)
        }

    },[canvasRef])


    return <div>
        <canvas ref={canvasRef} width={2000} height={1000} ></canvas>
    </div>
}