/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  view: "login" | "signup";
  onViewChange: (view: "login" | "signup") => void;
  onLoginSuccess: (user: { name: string; role: string; email: string }) => void;
}

export function AuthForm({
  view,
  onViewChange,
  onLoginSuccess,
}: AuthFormProps) {
  console.log("🎯 AuthForm rendered with onLoginSuccess:", typeof onLoginSuccess, onLoginSuccess);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/logIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login response data:", data);
      console.log("User role:", data.user.role);

      // Store the token
      localStorage.setItem("token", data.token);

      // Pass user data to the parent component (Header) which will handle redirect
      console.log("About to call onLoginSuccess with:", data.user);
      console.log("onLoginSuccess function is:", onLoginSuccess);
      console.log("Calling onLoginSuccess now...");
      onLoginSuccess(data.user);
      console.log("onLoginSuccess called successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      console.log("Signup response data:", data);

      // Store the token
      localStorage.setItem("token", data.token);

      // Pass user data to the parent component (Header) which will handle redirect
      console.log("About to call onLoginSuccess with:", data.user);
      console.log("onLoginSuccess function is:", onLoginSuccess);
      console.log("Calling onLoginSuccess now...");
      onLoginSuccess(data.user);
      console.log("onLoginSuccess called successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLoginView = view === "login";

  return (
    <div
      className="w-full max-w-sm border-none shadow-xl rounded-2xl 
      bg-neutral-900/80 backdrop-blur-xl
      animate-in fade-in zoom-in-90 duration-200"
    >
      <div className="p-8 text-white">
        <h2 className="text-3xl font-bold mb-2 text-center">
          {isLoginView ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-center text-neutral-400 mb-8">
          {isLoginView
            ? "Log in to continue your journey."
            : "Sign up to get started."}
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={isLoginView ? handleLogin : handleSignup}>
          <div className="space-y-4">
            {!isLoginView && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-8 disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : isLoginView ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => onViewChange(isLoginView ? "signup" : "login")}
            className="text-sm text-neutral-400 hover:text-white"
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
