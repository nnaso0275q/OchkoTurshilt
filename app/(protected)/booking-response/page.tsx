"use client";
import { use, useEffect, useState } from "react";

import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Booking {
  id: number;
  status: "approved" | "cancelled";
  event_halls: { name: string };
  User: { name: string };
  performers: { name: string };
  date: string;
  starttime: string;
}

const Skeleton = ({ lines = 4 }: { lines?: number }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-3/5 bg-slate-700 rounded-md" />
      <div className="h-40 bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-md bg-slate-700" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/2 bg-slate-700 rounded" />
            <div className="h-4 w-3/4 bg-slate-700 rounded" />
            <div className="h-4 w-2/3 bg-slate-700 rounded" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-6 bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-white/10 py-2">
    <span className="text-gray-400">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const BookingResponsePage = ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string; action?: string }>;
}) => {
  const params = use(searchParams);
  console.log("BookingResponsePage params:", params);

  const bookingIdParam = params.bookingId;
  const actionParam = params.action;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "accepted" | "declined">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Захиалгын статус өөрчлөгдөж байна..."
  );

  const Skeleton = ({ lines = 4 }: { lines?: number }) => {
    return (
      <div className="space-y-5 animate-pulse">
        {/* Title Skeleton */}
        <div className="h-7 w-2/4 bg-slate-700/60 rounded-lg backdrop-blur-sm" />

        {/* Card Skeleton */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 shadow-lg backdrop-blur">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-lg bg-slate-700/60" />

            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-1/2 bg-slate-700/60 rounded" />
              <div className="h-4 w-3/4 bg-slate-700/60 rounded" />
              <div className="h-4 w-2/3 bg-slate-700/60 rounded" />
            </div>
          </div>

          {/* Grid Skeleton Lines */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: lines }).map((_, idx) => (
              <div key={idx} className="h-6 bg-slate-700/60 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (
      bookingIdParam &&
      (actionParam === "approve" || actionParam === "decline")
    ) {
      handleBookingResponse(Number(bookingIdParam), actionParam);
    } else {
      setLoading(false);
      setStatus("declined");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingIdParam, actionParam]);

  const handleBookingResponse = async (
    bookingId: number,
    action: "approve" | "decline"
  ) => {
    try {
      const res = await fetch(
        `/api/booking-response?bookingId=${bookingId}&action=${action}`
      );
      const data = await res.json();

      if (data.success && data.booking) {
        setBooking(data.booking);
        setStatus(
          data.booking.status === "cancelled" ? "declined" : "accepted"
        );
      } else {
        setStatus("declined");
      }
    } catch (error) {
      console.error(error);
      setStatus("declined");
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => window.location.reload();

  // ---------- Loading / Skeleton UI ----------
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Түр хүлээнэ үү</h1>
          <p className="text-gray-300 text-sm mb-6">
            Захиалгын мэдээллийг татаж байна — богино хугацаанд бэлэн болно.
          </p>

          <Skeleton lines={4} />

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReload}
              className="px-6 py-3 bg-slate-800 rounded-md text-white/80 hover:bg-slate-700"
            >
              Цуцлах
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Accepted UI ----------
  if (status === "accepted") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Захиалга баталгаажлаа!
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Таны арга хэмжээ амжилттай баталгаажсан тул дэлгэрэнгүйг доор харна
            уу.
          </p>

          {booking ? (
            <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
              <h2 className="text-lg font-semibold text-emerald-400 mb-4">
                Захиалгын мэдээлэл
              </h2>
              <Info label="Event Hall" value={booking.event_halls.name} />
              <Info
                label="Өдөр"
                value={new Date(booking.date).toLocaleDateString("mn-MN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <Info label="Эхлэх цаг" value={booking.starttime} />
              <Info label="Захиалагч" value={booking.User.name} />
              <Info label="Performer" value={booking.performers.name} />
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
              <Skeleton lines={3} />
            </div>
          )}

          {/* <button
            onClick={handleReload}
            className="px-8 py-4 text-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
          >
            Бусад захиалга руу буцах
          </button> */}
        </div>
      </div>
    );
  }

  // ---------- Declined UI ----------
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <XCircle className="w-24 h-24 text-red-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Захиалга татгалзлаа
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Уучлаарай, таны захиалга батлагдаагүй. Боломжит өөр өдөр сонгоно уу.
        </p>

        {booking ? (
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <h2 className="text-lg font-semibold text-red-400 mb-4">
              Захиалгын дэлгэрэнгүй
            </h2>
            <Info label="Event Hall" value={booking.event_halls.name} />
            <Info
              label="Өдөр"
              value={new Date(booking.date).toLocaleDateString("mn-MN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <Info label="Эхлэх цаг" value={booking.starttime} />
            <Info label="Захиалагч" value={booking.User.name} />
            <Info label="Performer" value={booking.performers.name} />
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <Skeleton lines={3} />
          </div>
        )}

        {/* <button
          onClick={handleReload}
          className="px-8 py-4 text-lg bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
        >
          Өөр өдөр туршиж үзэх
        </button> */}
      </div>
    </div>
  );
};

export default BookingResponsePage;
