"use client";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      
      <div className="bg-white/20 backdrop-blur-xl w-full max-w-5xl rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">

       

        {/* RIGHT SIDE – IMAGE */}
        <div className="relative flex items-center justify-center bg-black/30">
          <img
            src="/together.jpg" 
            alt="Signup Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative  text-center px-6">
            <h2 className="text-white text-3xl font-bold drop-shadow-lg">
              Welcome to Proxima
            </h2>
            <p className="text-indigo-200 text-lg mt-2 font-medium drop-shadow">
              Working closely together
            </p>
            <p className="text-indigo-600 text-lg mt-2 font-medium drop-shadow">
              Signup to connect with PROXIMA
            </p>
          </div>
        </div>

         {/* LEFT SIDE – FORM */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Sign Up
          </h2>

          <form className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm font-semibold">Username</label>
              <input
                type="text"
                className="w-full mt-1 p-3 rounded-lg bg-white/40 border border-white/50 outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-3 rounded-lg bg-white/40 border border-white/50 outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold">Password</label>
              <input
                type="password"
                className="w-full mt-1 p-3 rounded-lg bg-white/40 border border-white/50 outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-purple-700 to-indigo-900 text-white py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-800">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-purple-900 underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
