


import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton"
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react"
import { Game } from "@/draw/Game"


export type Tool= "circle" | "rect" | "pencil"
export default function Canvas({
    roomId,
    socket
}:{
    socket:WebSocket
    roomId:number

},){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const[selectedTool,setSelectedTool] = useState<Tool>("circle")
    const [game,setGame] = useState<Game>()

    
    useEffect(()=>{
        game?.setTool(selectedTool)
        
    },[selectedTool,game])
    
    useEffect(()=>{
        if(canvasRef.current){
            const g = new Game(canvasRef.current,roomId,socket)
            setGame(g)
            
            return ()=>{
                g.destroy()
            }   
        }
        

    },[socket,roomId])


    return <div style={{
        height:"100vh",
        overflow:"hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} ></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
       
    </div>
}

function Topbar({selectedTool,setSelectedTool}:{
    selectedTool:Tool
    setSelectedTool:(s:Tool) =>void
}){
     return <div style={{ 
            position:"fixed",
            top:10,
            left:10
        }}>
            <div className="flex gap-2">
            <IconButton
                onClick={()=>{
                    setSelectedTool("pencil")
                }}
                activated = {selectedTool==="pencil"}
            
                icon={<Pencil/>}
            />
            <IconButton
                onClick={()=>{
                    setSelectedTool("rect")
                }}
                activated={selectedTool==="rect"}
                icon={<RectangleHorizontalIcon/>} />
            <IconButton 
                onClick={()=>{
                    setSelectedTool("circle")
                }}
                activated= {selectedTool==="circle"
                }
                icon={<Circle/>} 
                
                />
            </div>

        </div>
}