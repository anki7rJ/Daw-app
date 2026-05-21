import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { CustomUserPayload } from "../types/express"

export function authMiddleware(req:Request, res:Response, next:NextFunction){
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                status:"false",
                message:"user in not authorized"
            })
        }
        const userVerification = jwt.verify(token!,process.env.JWT_SECRET!) as CustomUserPayload

        if(!userVerification){
            return res.status(401).json({
                satatus:"false",
                message:"User is not verified"

            })

        }
        req.user = userVerification
        next()

        
    } catch (error) {
        return res.status(401).json({
            status:false,
            message:"Invalid or expired token"
        })
        
    }

}