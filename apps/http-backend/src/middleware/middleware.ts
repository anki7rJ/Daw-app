import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { CustomUserPayload } from "../types/express"
import {JWT_SECRET }from '@repo/backend-common/config'

export function authMiddleware(req:Request, res:Response, next:NextFunction){
    try {
        console.log("cookie header:", req.headers.cookie)
        console.log("cookies object:", req.cookies)
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                status:false,
                message:"user in not authorized"
            })
        }
        const userVerification = jwt.verify(token!,JWT_SECRET!) as CustomUserPayload

        if(!userVerification){
            return res.status(401).json({
                satatus:false,
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
