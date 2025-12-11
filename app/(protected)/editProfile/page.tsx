/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/home");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user data.");

        const data = await res.json();
        setUser(data.user);
        setName(data.user.name);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/editProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");

      setSuccess("Хэрэглэгчийн нэр амжилттай шинэчлэгдлээ!");
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-neutral-400 text-lg">
          Түр хүлээнэ үү...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-black text-white pt-32 px-4">
      <div className="max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold mb-8">Миний профайл</h1>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">И-мэйл</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-neutral-800 text-neutral-400 px-4 py-3 rounded-lg 
                         border border-neutral-700 cursor-not-allowed"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Нэр</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (success) setSuccess(null);
                if (error) setError(null);
              }}
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg 
                         border border-neutral-700 focus:border-blue-500 focus:outline-none
                         transition-all"
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle size={18} /> {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={18} /> {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !!success}
            className={`w-full text-white font-semibold py-3 rounded-lg transition-colors duration-300 
              ${
                success
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
              }`}
          >
            {saving
              ? "Хадгалж байна..."
              : success
              ? "Хадгалагдлаа!"
              : "Хадгалах"}
          </button>
        </form>
      </div>
    </div>
  );
}
