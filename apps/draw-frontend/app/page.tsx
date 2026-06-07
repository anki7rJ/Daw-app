
import Link from "next/link";


export default function Home(){
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <section className="max-w-4xl text-center">
         <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Visualize Ideas, Together
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Create diagrams, wireframes, and sketches on an infinite canvas.
          Collaborate in real time and turn thoughts into clear visuals.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
          >
            New User? Sign Up
          </Link>

          <Link
            href="/signin"
            className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-white hover:text-black transition"
          >
            Already a User? Sign In
          </Link>
        </div>

      </section>

    </main>
  )
}