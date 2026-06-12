import { Tool } from "@/components/Canvas"
import { getExistingShapes } from "./http"


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

}|{
    type:"pencil"
    startX:number
    startY:number
    endX:number
    endY:number

}



export class Game{
    private canvas:HTMLCanvasElement
    private ctx:CanvasRenderingContext2D
    private existingShapes:Shape[]
    private roomId:Number
    private socket:WebSocket
    private clicked:boolean
    private startX :number=0
    private startY:number=0
    private selectedTool:Tool ="circle"



    constructor(canvas:HTMLCanvasElement,roomId:Number,socket:WebSocket){
        this.canvas=canvas
        this.ctx = canvas.getContext("2d")! 
        this.existingShapes=[]
        this.roomId = roomId
        this.socket = socket
        this.clicked = false
        
        this.init()
        this.initHandlers()
        this.initMouseHandlers()
    }
    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup",this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler)
    }

    setTool(tool:"circle" | "pencil" | "rect"){
        this.selectedTool=tool
    }


    async init(){
        this.existingShapes = await getExistingShapes(this.roomId)
        this.clearCanvas()


    }

    initHandlers(){
         this.socket.onmessage=(event)=>{
                const message = JSON.parse(event.data)

                if(message.type=="chat"){
                    const parsedShape = JSON.parse(message.message)
                    this.existingShapes.push(parsedShape)
                    this.clearCanvas()
                }


            }
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        this.existingShapes.forEach((shape)=>{

            if(shape.type =="rect"){
                this.ctx.strokeStyle="white"
                this.ctx.strokeRect(
                    shape.x,
                    shape.y,
                    shape.width,
                    shape.height
                )

            }else if(shape.type ==="circle"){

                this.ctx.beginPath()
                this.ctx.arc(shape.centerX,shape.centerY,Math.abs(shape.radius),0,Math.PI*2)
                this.ctx.stroke()
                this.ctx.closePath()

            }
        })
    }
    mouseDownHandler=(e:any)=>{
         const {x,y} = this.getMousePos(e)

        this.clicked = true
        this.startX = x
        this.startY = y

    }
    mouseUpHandler=(e:any)=>{
        this.clicked = false
                const {x,y} = this.getMousePos(e)

                const width = x-this.startX
                const height = y- this.startY
                //@ts-ignore
                const selectedTool = this.selectedTool
                let shape :Shape |null = null
                if(selectedTool==="rect"){
                    shape = {
                    //@ts-ignore
                    type:"rect",
                    x:this.startX,
                    y:this.startY,
                    height,
                    width
                }

                }else if(selectedTool==="circle"){
                    const radius = Math.max(width,height)/2
                    shape = {
                    //@ts-ignore
                    type:"circle",
                    radius:radius,
                    centerX:this.startX+radius,
                    centerY:this.startY+radius,
                
                }
 
                }
                if(!shape){
                    return
                }
                this.existingShapes.push(shape)
                
                

                this.socket.send(JSON.stringify({
                    type:"chat",
                    roomId:Number(this.roomId),
                    message:JSON.stringify(shape)
                }))
               



    }
    mouseMoveHandler=(e:any)=>{
        if(this.clicked){

            const {x,y} = this.getMousePos(e)
            const width = x- this.startX
            const height = y-this.startY
            this.clearCanvas()
            this.ctx.strokeStyle= "white"
            //@ts-ignore
            const selectedTool = this.selectedTool
            
            
            if(selectedTool==="rect"){
                this.ctx.strokeRect(this.startX,this.startY,width,height)
                console.log("printing from rect slected tool")
                
            }else if(selectedTool==="circle"){
                
                console.log("printing from circle slected tool")
                const  radius = Math.max(width,height)/2
                const   centerX = this.startX+radius
                const  centerY = this.startY+radius
                
                this.ctx.beginPath()
                this.ctx.arc(centerX,centerY,Math.abs(radius),0,Math.PI*2)
                this.ctx.stroke()
                this.ctx.closePath()
            }
                    
                    

        }


    }
    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler)
        this.canvas.addEventListener("mouseup",this.mouseUpHandler)
         this.canvas.addEventListener("mousemove",this.mouseMoveHandler)
    }
    getMousePos(e:MouseEvent){
    const rect = this.canvas.getBoundingClientRect()
    return{
        x:e.clientX - rect.left,
        y:e.clientY-rect.top
    }

}

    


}