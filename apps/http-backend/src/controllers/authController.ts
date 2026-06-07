import { NextFunction, Request, Response } from "express"
import { signinSchema,signUpSchema } from "@repo/common/validation"
import { prisma } from "@repo/db/prisma"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'





export const signup = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const response = signUpSchema.safeParse(req.body)
        if(!response.success){
            return res.status(400).json({
                status:false,
                message:"SignUp failed"
            })

        }

        const {email, password,name} = response.data

        const checkUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(checkUser){
            return res.status(400).json({
                status:false,
                message:`user with ${email} already exist`
            })
        }


        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await prisma.user.create({
            data:{
                email:email,
                password:hashedPassword,
                name:name
            }
        })


        res.status(201).json({
            success:true,
            message:`User Created ${ newUser.name}.`
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            error:error
        })
        
    }

}


export const signin = async (req:Request,res:Response,next:NextFunction)=>{
  try {
      const response = signinSchema.safeParse(req.body)
    
    if(!response.success){
        return res.status(400).json({
            success:false,
            message:"Login Failed"
        })
    }
    const {email,password} = response.data

    const foundUser = await prisma.user.findUnique({
        where:{
            email:email
        }

    })
    const hashedPassword = foundUser.password

    const verifyPassword = await bcrypt.compare(password,hashedPassword)

    if(!verifyPassword){
        res.status(400).json({
            status:false,
            message:"Password Incorrect"
        })
    }

    const token = jwt.sign({id:foundUser.id,email:foundUser.email} , process.env.JWT_SECRET!,{expiresIn:"1h"})
    res.cookie("token",token,{
        path:'/',
        httpOnly:true,
        maxAge:60*60*1000
    })

    res.status(200).json({
        status:true,
        message:"User logged In"
    })
    
  } catch (error) {
    return res.status(500).json({
        status:false,
        message:"Unable to sign in"
    })
    
  }


}


export const logout = (req:Request,res:Response)=>{
    try {
        res.clearCookie("token",{
            path:'/',
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        res.status(200).json({
            status:true,
            message:"User Logged out"
        })
        
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:"Unabale to logout"
        })
        
    }

}