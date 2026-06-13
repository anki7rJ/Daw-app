
"use client"

import { HTTP_BACKEND } from "@/config"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"


export function AuthPage({isSignin}:{isSignin:boolean}){
    const router = useRouter()
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
            const endpoint = isSignin?`${HTTP_BACKEND}/auth/signin`:`${HTTP_BACKEND}/auth/signup`
            const body = isSignin?{email,password}:{email,password,name,confirmPassword}
        
            const res = await api.post(endpoint,body)
            if(res.data.token){
                localStorage.setItem("token",res.data.token)
            }
            router.push(isSignin ? "/room" : "/signin")

            
        } catch (error:any) {

            setError(error.response?.data?.message || "something went wrong")

            
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
                    type="name" 
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
                        type="password"
                        placeholder="Enter Your Confirm Password"
                        className="border rounded-2xl p-2"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    
                        />
                        

                        
                        </>
                    )
                }
                <label htmlFor="Email">Email:</label>
                <input type="email"
                className="border rounded-2xl p-2"
                 placeholder="Enter Your Email"
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                  />
                  <label htmlFor="Password">Password:</label>
                <input type="password"
                 placeholder="Enter Your Password"
                 className="border rounded-2xl p-2"
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                  />
                <button className=" border rounded-xl  px-4 py-2 text-base self-center hover:cursor-pointer" type="submit">{loading?"Loading...":isSignin?"Signin":"Signup"}</button>
                {loading&&(
                    <p className="text-center text-sm">Authenticating...</p>
                )}
            </form>
            {error &&(
                <p className="text-red-500 text-center">{error}</p>
            )}
        </section>
            


    </main>
  


}
