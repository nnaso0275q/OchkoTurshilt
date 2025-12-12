"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Header } from "@/components/us/Header";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [form, setForm] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  const [modalState, setModalState] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    action: "accept" | "decline";
  } | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/home");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/home");
          return;
        }

        const data = await res.json();
        if (data.user.role !== "admin") {
          router.push("/home");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/home");
      }
    };

    checkAdmin();
  }, [router]);

  const getUserBookings = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/getforms`);
      const data = await res.json();
      setForm(data.data || []);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getUserBookings();
    }
  }, [isAdmin]);

  const handleActionClick = (id: string, action: "accept" | "decline") => {
    setSelectedRequest({ id, action });
  };

  const handleConfirm = async () => {
    if (!selectedRequest) return;
    setLoadingId(selectedRequest.id);

    try {
      const res = await fetch(`http://localhost:3000/api/form/form-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRequest.id }), // <== object болгож дамжуулах
      });

      if (res.ok) {
        setForm((prev) =>
          prev.filter((item) => item.id !== selectedRequest.id)
        );
      } else {
        console.error("API error:", await res.text());
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoadingId(null);
      setSelectedRequest(null);
    }
  };

  const handleCancel = () => {
    setSelectedRequest(null);
  };

  // Show loading while checking admin status
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!form) return <div>Loading...</div>;
  const openModal = (images: string[], index: number) => {
    setModalState({ images, currentIndex: index });
  };

  const closeModal = () => setModalState(null);

  const prevImage = () => {
    if (!modalState) return;
    setModalState({
      ...modalState,
      currentIndex:
        (modalState.currentIndex - 1 + modalState.images.length) %
        modalState.images.length,
    });
  };

  const nextImage = () => {
    if (!modalState) return;
    setModalState({
      ...modalState,
      currentIndex: (modalState.currentIndex + 1) % modalState.images.length,
    });
  };
  console.log("form", form);
  return (
    <div className="bg-black min-h-screen">
      <Header />
      <main className=" text-white p-4 md:p-10 mx-auto">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Таньд ирсэн хүсэлтүүд :
            </h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {form.map((item) => (
              <Card
                key={item.id}
                className="bg-neutral-900/60 border border-neutral-800 shadow-xl transition-transform hover:scale-[1.02] duration-200 text-white rounded-xl overflow-hidden flex flex-col"
              >
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">
                      {item.hallname}
                    </h2>
                    <p className="text-sm text-gray-400 mb-1">
                      Нэр: {item.name}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">
                      И-мэйл: {item.email}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">
                      Утас: {item.number}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      Байршил: {item.location}
                    </p>

                    {item.images && item.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {item.images.map((img: string, idx: number) => (
                          <img
                            key={idx}
                            src={img}
                            alt={item.hallname}
                            className="h-24 w-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                            onClick={() => openModal(item.images, idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Buttons pinned to bottom */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleActionClick(item.id, "accept")}
                      className="flex-1 bg-green-600/90 hover:bg-green-600 py-2 rounded-lg font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleActionClick(item.id, "decline")}
                      className="bg-red-600 hover:bg-red-600 px-4 py-2 rounded-lg font-medium"
                    >
                      Decline
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <button
                className="absolute top-3 right-3 text-white text-3xl hover:text-red-400"
                onClick={closeModal}
              >
                <X />
              </button>

              <button
                className="absolute left-3 top-1/2 -transition-y-1/2 text-white text-4xl"
                onClick={prevImage}
              >
                <ChevronLeft />
              </button>
              <img
                src={modalState.images[modalState.currentIndex]}
                alt="Modal"
                className="max-h-[90vh] mx-auto object-contain rounded-xl shadow-2xl"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-4xl"
                onClick={nextImage}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
        {/* Confirm Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-white">
              <h2 className="text-lg font-semibold mb-4">
                Та энэ хүсэлтийг
                {selectedRequest.action} баталгаажуулахдаа итгэлтэй байна уу?
              </h2>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                  {loadingId === selectedRequest.id ? "Loading..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
