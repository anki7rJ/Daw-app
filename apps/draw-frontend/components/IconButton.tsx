import { ReactNode } from "react";

export function IconButton({
    icon,onClick,activated
}:{
    icon: ReactNode,
    onClick:()=>void,
    activated:boolean
}){

    return <div className={`pointer rounded-full border p-2 bg-black hover:bg-gray ${activated?"text-red-400":"text-white"}`} onClick={onClick}>
        {icon}
    </div>
    
    

}