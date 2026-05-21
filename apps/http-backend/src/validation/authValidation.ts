import z, { email } from "zod"

export const signinSchema = z.object({
    email:z.string().email(),
    password:z.string().min(4).max(9)

})



export const signUpSchema  = signinSchema.extend({
    name:z.string().min(4),
    confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
    message:"password don't match",
    path:["confirmPassword"]
})



