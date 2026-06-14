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
    points:{
        x:number
        y:number
    }[]

}



export class Game{
    private canvas:HTMLCanvasElement
    private ctx:CanvasRenderingContext2D
    private existingShapes:Shape[]
    private roomId:number
    private socket:WebSocket
    private clicked:boolean
    private startX :number=0
    private startY:number=0
    private selectedTool:Tool ="circle"
    private currentPoints:{x:number,y:number}[]=[]



    constructor(canvas:HTMLCanvasElement,roomId:number,socket:WebSocket){
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
            }else if(shape.type ==="pencil"){
                if(shape.points.length<2) return
                this.ctx.beginPath()
                this.ctx.moveTo(shape.points[0].x, shape.points[0].y)
                for(let i=1;i<shape.points.length;i++){
                    this.ctx.lineTo(shape.points[i].x, shape.points[i].y)
                }
                this.ctx.stroke()
            }
        })
    }
    mouseDownHandler=(e:any)=>{
         const {x,y} = this.getMousePos(e)

        this.clicked = true
        this.startX = x
        this.startY = y
        if(this.selectedTool==="pencil"){
            this.currentPoints=[{x,y}]
        }

    }
    mouseUpHandler=(e:any)=>{
    

        this.clicked = false
        const {x,y} = this.getMousePos(e)
    
        
        const width = x-this.startX
        const height = y- this.startY
        
        const selectedTool = this.selectedTool
        let shape :Shape |null = null
        if(selectedTool==="rect"){
            shape = {
            
            type:"rect",
            x:this.startX,
            y:this.startY,
            height,
            width
        }
        }else if(selectedTool==="circle"){
            const radius = Math.max(width,height)/2
            shape = {
            
            type:"circle",
            radius:radius,
            centerX:this.startX+radius,
            centerY:this.startY+radius,
            }
        
        }
        else if(selectedTool==="pencil"){
            shape = {
                type:"pencil",
                points:[...this.currentPoints]
            }
            this.currentPoints=[]
        
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

            if(this.selectedTool === "pencil"){
            this.currentPoints.push({x,y})

            this.clearCanvas()

            this.ctx.beginPath()

            for(let i=1;i<this.currentPoints.length;i++){
                this.ctx.moveTo(
                    this.currentPoints[i-1].x,
                    this.currentPoints[i-1].y
                )

                this.ctx.lineTo(
                    this.currentPoints[i].x,
                    this.currentPoints[i].y
                )
            }

            this.ctx.stroke()
            return
        }

            
            const width = x- this.startX
            const height = y-this.startY
            this.clearCanvas()
            this.ctx.strokeStyle= "white"
            
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