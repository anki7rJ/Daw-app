import { HTTP_BACKEND } from "@/config"
import axios from "axios"
import { clear } from "console"


type Shape = {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} |{
    type:"circle"
    centerX:number
    centerY:number
    radius:number

}

function getMousePos(e:MouseEvent, canvas:HTMLCanvasElement){
    const rect = canvas.getBoundingClientRect()
    return{
        x:e.clientX - rect.left,
        y:e.clientY-rect.top
    }

}


export async function initDraw(canvas:HTMLCanvasElement, roomId:string, socket:WebSocket){
            const ctx = canvas.getContext("2d")

            let existingShpaes:Shape[] = await getExistingShapes(roomId)

            if(!ctx){ 
                return
            }
            
            socket.onmessage=(event)=>{
                const message = JSON.parse(event.data)

                if(message.type=="chat"){
                    const parsedShape = JSON.parse(message.message)
                    existingShpaes.push(parsedShape)
                    clearCanvas(existingShpaes,canvas,ctx)
                }


            }

            clearCanvas(existingShpaes,canvas,ctx)

            let clicked = false 
            let startX =0
            let startY=0
            
            canvas.addEventListener("mousedown",(e)=>{
                const {x,y} = getMousePos(e,canvas)
                clicked = true
                startX = x
                startY = y


            })

            canvas.addEventListener("mouseup",(e)=>{
                const {x,y} = getMousePos(e,canvas)
                clicked = false

                const width = x-startX
                const height = y- startY
                const shape:Shape = {
                    type:"rect",
                    x:startX,
                    y:startY,
                    height,
                    width
                }
                existingShpaes.push(shape)

                socket.send(JSON.stringify({
                    type:"chat",
                    message:JSON.stringify({
                        shape
                    })

                }))
               


            })

            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                    const {x,y} = getMousePos(e,canvas)
                    const width = x- startX
                    const height = y-startY
                    clearCanvas(existingShpaes,canvas,ctx)
                    ctx.strokeStyle= "white"
                    
                    ctx.strokeRect(startX,startY,width,height)
                    

                }

            })



}


function clearCanvas(existingShpaes:Shape[] , canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    existingShpaes.forEach((shape)=>{
        
        if(shape.type =="rect"){
            ctx.strokeStyle="white"
            ctx.strokeRect(
                shape.x,
                shape.y,
                shape.width,
                shape.height
            )
             
        }
    })
    
     
}

async function getExistingShapes(roomId:string){
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    const messages = res.data.messages

    const shapes = messages.forEach((x:{message:string})=>{
        const messageData = JSON.parse(x.message)
        return messageData
    })

    return shapes

      


}

