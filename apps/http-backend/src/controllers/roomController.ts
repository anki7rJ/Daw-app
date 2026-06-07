import { prisma } from "@repo/db/prisma";
import { NextFunction, Request, Response } from "express";


export const room = (req:Request,res:Response,next:NextFunction)=>{



}

export const chats = (req:Request,res:Response,next:NextFunction)=>{
    try {
        const roomId = Number(req.params.roomId)
        const messages = prisma.chats.findMany({
            where:{
                roomId:roomId
            },
            orderBy:{
                id:"desc"
            },
            take:50
        })

        res.json({
            messages
        })
        
    } catch (error) {
        res.json({
            messages:[]
        })
        
    }

}

export const slug = (req:Request,res:Response,next:NextFunction)=>{

}