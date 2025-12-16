"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/us/Header";
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Edit,
  Eye,
  MapPin,
  Star,
} from "lucide-react";

export default function HallOwnerDashboard() {
  const [isHallOwner, setIsHallOwner] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const router = useRouter();

  // Check if user is hall owner
  useEffect(() => {
    const checkHallOwner = async () => {
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

        if (data.user.role !== "hallowner") {
          router.push("/home");
          return;
        }

        setUserInfo(data.user);
        setIsHallOwner(true);
        fetchMyHalls(token);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/home");
      }
    };

    checkHallOwner();
  }, [router]);

  const fetchMyHalls = async (token: string) => {
    try {
      const res = await fetch("/api/hallowner/my-halls", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();

        // Redirect to edit page of first hall if they have any halls
        if (data.halls && data.halls.length > 0) {
          router.push(`/hallowner-dashboard/edit/${data.halls[0].id}`);
          return;
        }

        setHalls(data.halls || []);

        // Calculate stats
        let totalBookings = 0;
        let pendingBookings = 0;

        data.halls.forEach((hall: any) => {
          totalBookings += hall.booking?.length || 0;
          pendingBookings +=
            hall.booking?.filter((b: any) => b.status === "pending")?.length ||
            0;
        });

        setStats({
          totalBookings,
          pendingBookings,
          totalRevenue: 0,
          monthlyRevenue: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isHallOwner === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Танхимын эзний самбар
          </h1>
          <p className="text-gray-400">Сайн байна уу, {userInfo?.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">{stats.totalBookings}</span>
            </div>
            <h3 className="text-gray-300 text-sm">Нийт захиалга</h3>
          </div>

          <div className="bg-linear-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold">
                {stats.pendingBookings}
              </span>
            </div>
            <h3 className="text-gray-300 text-sm">Хүлээгдэж буй</h3>
          </div>

          <div className="bg-linear-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold">
                ₮{stats.totalRevenue.toLocaleString()}
              </span>
            </div>
            <h3 className="text-gray-300 text-sm">Нийт орлого</h3>
          </div>

          <div className="bg-linear-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">
                ₮{stats.monthlyRevenue.toLocaleString()}
              </span>
            </div>
            <h3 className="text-gray-300 text-sm">Сарын орлого</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-2xl font-bold mb-6">Үйлдлүүд</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/eventhall-form")}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 p-6 rounded-xl text-left transition-all shadow-lg hover:shadow-blue-500/50"
            >
              <Building2 className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Танхим нэмэх</h3>
              <p className="text-sm text-gray-300">
                Шинэ танхимын мэдээлэл нэмэх
              </p>
            </button>

            <button
              onClick={() => router.push("/booking-response")}
              className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 p-6 rounded-xl text-left transition-all shadow-lg hover:shadow-green-500/50"
            >
              <Calendar className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Захиалга харах</h3>
              <p className="text-sm text-gray-300">Захиалгуудыг удирдах</p>
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 p-6 rounded-xl text-left transition-all shadow-lg hover:shadow-orange-500/50"
            >
              <Users className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Профайл</h3>
              <p className="text-sm text-gray-300">Хувийн мэдээлэл засах</p>
            </button>
          </div>
        </div>

        {/* My Halls Section */}
        <div className="mt-8 bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Миний танхимууд</h2>
            <span className="text-gray-400">{halls.length} танхим</span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Уншиж байна...</p>
            </div>
          ) : halls.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-4">
                Танд одоогоор танхим байхгүй байна
              </p>
              <button
                onClick={() => router.push("/eventhall-form")}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Танхим нэмэх
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {halls.map((hall) => (
                <div
                  key={hall.id}
                  className="bg-linear-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {/* Hall Image */}
                  {hall.images && hall.images.length > 0 ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={hall.images[0]}
                        alt={hall.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-neutral-800 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-600" />
                    </div>
                  )}

                  {/* Hall Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{hall.name}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{hall.location || "Байршил тодорхойгүй"}</span>
                      </div>

                      {hall.rating && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{hall.rating} үнэлгээ</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{hall.capacity || "Багтаамж тодорхойгүй"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{hall.booking?.length || 0} захиалга</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/hallowner-dashboard/edit/${hall.id}`)
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Засах
                      </button>
                      <button
                        onClick={() => router.push(`/event-halls/${hall.id}`)}
                        className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
