import { createRoomSchema } from "@repo/common/validation";
import { prisma } from "@repo/db/prisma";
import { NextFunction, Request, Response } from "express";


export const room =  async (req:Request,res:Response,next:NextFunction)=>{
   const parsedData = createRoomSchema.safeParse(req.body)

   if(!parsedData.success){

        return res.status(400).json({
            status:false,
            message:parsedData.error.issues[0]?.message
            })
   }

    const user = req.user

    if(!user){
        return res.status(401).json({
            status:false,
            message:"unauthorized"
        })
    }

    try {
        const room = await prisma.room.create({
            data:{
                slug:parsedData.data.slug,
                adminId:user.id
            }
        })

        res.json({
            roomId:room.id
        })


        
    } catch (error) {
        res.status(411).json({
            message:"Room already exists with this name"
        })
        
    }
   }

export const chats = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const roomId = Number(req.params.roomId)

        if (!Number.isInteger(roomId)) {
            return res.status(400).json({
                messages:[],
                message:"Invalid room id"
            })
        }

        const messages = await prisma.chat.findMany({
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
interface RoomParams{
    slug:string
}
export const getRoomBySlug = async (req:Request<RoomParams>,res:Response)=>{
    const {slug} = req.params
    const room = await prisma.room.findUnique({
        where:{
            slug
        }
    })

    if(!room){
        return res.status(404).json({
            message:"Room not found"
        })
    }

    res.json({
        roomId:room.id
    })

}



