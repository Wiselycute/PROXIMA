"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed");
        setLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push("/home/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      
      <div className="bg-white/20 backdrop-blur-xl w-full max-w-5xl rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">

         {/* RIGHT SIDE – FULL IMAGE WITH CENTERED TEXT */}
        <div className="relative bg-black/30 w-full h-full flex items-center justify-center">
          <img
            src="/together.jpg"
            alt="Sign In Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative text-center px-6">
            <h2 className="text-white text-4xl font-bold drop-shadow-lg">
              Welcome to back to Proxima
            </h2>
            <p className="text-indigo-200 text-lg mt-2 font-medium drop-shadow">
              Working closely together
            </p>
            <p className="text-indigo-800 text-lg mt-2 font-medium drop-shadow">
              Enter your personal datails to access your account
            </p>
            
          </div>
        </div>

        {/* LEFT SIDE – FORM */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Sign In
          </h2>

          <p className="text-center text-gray-700 mb-6 font-medium">
            Welcome back. Enter your personal details to access your account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg bg-white/40 border border-white/50 outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg bg-white/40 border border-white/50 outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-purple-700 to-indigo-900 text-white py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-800">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-purple-900 underline">
              Sign Up
            </Link>
          </p>
        </div>

       

      </div>

    </div>
  );
}
