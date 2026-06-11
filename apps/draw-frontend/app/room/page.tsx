"use client"

import { HTTP_BACKEND } from "@/config"
import api from "@/lib/api"

import { useRouter } from "next/navigation"
import { useState } from "react"


export default function RoomPage() {
  const router = useRouter()
  const [slug, setSlug] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function createRoom(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const trimmedSlug = slug.trim()
    if (!trimmedSlug) {
      setError("Enter a room name")
      return
    }

    try {
      setLoading(true)
      const response = await api.post( `${HTTP_BACKEND}/room`,{ slug: trimmedSlug })

      const roomId = response.data.roomId
      router.push(`/canvas/${trimmedSlug}`)
    } catch (error) {
      setError("Unable to create room. Please signin first or try another name.")
    } finally {
      setLoading(false)
    }
  }

  async function joinRoom(e:React.FormEvent) {
    e.preventDefault()
    const trimmedSlug = slug.trim()
    if (!trimmedSlug) {
        setError("Enter a room name")
        return
    }

    try {
      setLoading(true)
      setError("")
      
      
      await api.get(`${HTTP_BACKEND}/room/${slug}`)
      
      
       router.push(`/canvas/${trimmedSlug}`)
      
     
      
      
    } catch (error:any) {
      if(error.response?.status===401){
        setError("Please sign in first")
        router.push("/signin")
        return
      }

      if(error.response?.status===404){
        setError("Room does not exist")
        return
      }
      setError("Something went wrong")
      
    }
    finally{
      setLoading(false)
    }
    
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-zinc-900 rounded-xl p-6">
        <form onSubmit={createRoom} className="flex flex-col gap-4">
          <label htmlFor="slug">Room name</label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="test-room"
            className="border border-zinc-700 bg-black rounded-xl p-3 text-white"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="border border-zinc-700 rounded-xl px-4 py-2 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create room"}
            
          </button>
          <button
            type="button"
            onClick={joinRoom}
          >
            {loading ? "Joining..." : "Join room"}
          </button>

          
        </form>
      </section>
    </main>
  )
}
