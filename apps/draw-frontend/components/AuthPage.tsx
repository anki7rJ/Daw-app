
"use client"

import { HTTP_BACKEND } from "@/config"
import api from "@/lib/api"
import { useState } from "react"


export function AuthPage({isSignin}:{isSignin:boolean}){
    const [name , setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const endpoint = isSignin?`${HTTP_BACKEND}/signin`:`${HTTP_BACKEND}/signup`
            const body = isSignin?{email,password}:{email,password,name,confirmPassword}
            await api.post(endpoint,body)
            
        } catch (error) {
            
            
        } finally {
            setLoading(false)
        }




        

    }
    return <main className=" min-h-screen flex bg-black  text-white justify-center items-center">
        <section className="bg-zinc-900 p-6 rounded-xl text-white w-full max-w-md ">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isSignin && (

                    
                    <>
                    <label htmlFor="Name">Name:</label>
                    <input 
                    type="Name" 
                    className="border rounded-2xl p-2"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                     />
                    
                    </>
                )}
                {
                    !isSignin && (
                        <>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input 
                        type="Confirm Password"
                        placeholder="Enter Your Confirm Password"
                        className="border rounded-2xl p-2"
                        value={confirmPassword}
                        onChange={(e)=>setPassword(e.target.value)}
                    
                        />
                        

                        
                        </>
                    )
                }
                <label htmlFor="Email">Email:</label>
                <input type="Email"
                className="border rounded-2xl p-2"
                 placeholder="Enter Your Email"
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                  />
                  <label htmlFor="Password">Password:</label>
                <input type="Password"
                 placeholder="Enter Your Password"
                 className="border rounded-2xl p-2"
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                  />
                <button className=" border rounded-xl  px-4 py-2 text-base self-center hover:cursor-pointer" type="submit">{isSignin?"Signin":"Signup"}</button>
            </form>
        </section>
            


    </main>
  


}