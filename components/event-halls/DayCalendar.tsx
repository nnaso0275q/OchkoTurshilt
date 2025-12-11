"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DateForm from "./DateForm";
import generateCalendar from "@/lib/utilfunction/GenerateCalendar";
import useSWR from "swr";
import { publicFetcher } from "@/lib/fetcherpublic";

export default function BookingCalendar({
  hallId,
}: {
  hallId: number | string;
}) {
  const { data, isLoading } = useSWR("/api/booking-all", publicFetcher);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<
    { date: string; type: "am" | "pm" | "udur" }[]
  >([]);

  const bookings = data?.filter((b: any) => b.hallid == hallId) || [];

  if (isLoading) return <p className="text-white">Уншиж байна...</p>;

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const TimeBox = ({
    type,
    day,
  }: {
    type: "am" | "pm" | "udur";
    day: number;
  }) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const labelMap = {
      am: "08:00 - 12:00",
      pm: "18:00 - 22:00",
      udur: "09:00 - 18:00",
    };
    const label = labelMap[type];

    const isPast = new Date(dateStr).getTime() < new Date(todayStr).getTime();
    const dayBookings = bookings.filter(
      (b: any) => new Date(b.date).toISOString().split("T")[0] === dateStr
    );

    const isAmBooked = dayBookings.some(
      (b: { starttime: string }) =>
        parseInt(b.starttime.split(":")[0], 10) === 8
    );
    const isPmBooked = dayBookings.some(
      (b: { starttime: string }) =>
        parseInt(b.starttime.split(":")[0], 10) === 18
    );
    const isUdureBooked = dayBookings.some(
      (b: { starttime: string }) =>
        parseInt(b.starttime.split(":")[0], 10) === 9
    );

    // Захиалга эсвэл өнгөрсөн өдөр шалгах
    let isAvailable = !isPast;
    if (
      (type === "am" && (isAmBooked || isUdureBooked)) ||
      (type === "pm" && (isPmBooked || isUdureBooked)) ||
      (type === "udur" && (isUdureBooked || isAmBooked || isPmBooked))
    ) {
      isAvailable = false;
    }

    if (isPast) return null;

    const isSelected = selected.some(
      (sel) => sel.date === dateStr && sel.type === type
    );

    const handleSelect = (day: number, type: "am" | "pm" | "udur") => {
      const newDate = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      setSelected((prev) => {
        const exists = prev.find((s) => s.date === newDate && s.type === type);
        if (exists)
          return prev.filter((s) => !(s.date === newDate && s.type === type));
        const newSelected = prev.filter((s) => !(s.date === newDate));
        return [...newSelected, { date: newDate, type }];
      });
    };

    if (!isAvailable) {
      return (
        <div className="text-red-700 bg-red-400 w-full rounded-xl border p-2 text-center text-sm font-medium">
          Захиалгатай
        </div>
      );
    }

    return (
      <button
        onClick={() => handleSelect(day, type)}
        disabled={!isAvailable}
        className={`w-full rounded-xl border p-2 text-center text-sm font-medium transition-all ${
          isSelected
            ? "bg-blue-600 text-white shadow-md scale-[1.05]"
            : "bg-white hover:bg-blue-50"
        }`}
      >
        {label}
      </button>
    );
  };

  const daysOfWeek = [
    "Даваа",
    "Мягмар",
    "Лхагва",
    "Пүрэв",
    "Баасан",
    "Бямба",
    "Ням",
  ];
  const weeks = generateCalendar(currentYear, currentMonth);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-2/3 border-2 rounded-md p-4 bg-neutral-800">
        <div className="flex justify-between items-center mb-4 text-white">
          <h2 className="text-2xl font-bold">
            {currentYear} – {currentMonth + 1} сар
          </h2>
          <Button variant="outline" className="text-black" onClick={nextMonth}>
            ›
          </Button>
        </div>

        <div className="grid grid-cols-7 text-center font-semibold text-white mb-2">
          {daysOfWeek.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeks.map((week) =>
            week.map((dayObj, j) => {
              const { day, current } = dayObj;

              if (!current)
                return (
                  <div
                    key={j}
                    className="min-h-[110px] bg-gray-300 rounded-xl p-2"
                  >
                    {day}
                  </div>
                );

              const dateStr = `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast =
                new Date(dateStr).getTime() < new Date(todayStr).getTime();
              const dayBookings = bookings.filter(
                (b: { date: string }) =>
                  new Date(b.date).toISOString().split("T")[0] === dateStr
              );

              const isAmBooked = dayBookings.some(
                (b: { starttime: string }) =>
                  parseInt(b.starttime.split(":")[0], 10) === 8
              );
              const isPmBooked = dayBookings.some(
                (b: { starttime: string }) =>
                  parseInt(b.starttime.split(":")[0], 10) === 18
              );
              const isUdureBooked = dayBookings.some(
                (b: { starttime: string }) =>
                  parseInt(b.starttime.split(":")[0], 10) === 9
              );
              const isPartial = isAmBooked || isPmBooked;
              console.log(isPartial);

              return (
                <div
                  key={j}
                  className={`min-h-[110px] border rounded-xl p-2 flex flex-col gap-2 ${
                    isPast
                      ? "bg-gray-400"
                      : isUdureBooked
                      ? "bg-red-300"
                      : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isPast
                        ? "text-black"
                        : isUdureBooked
                        ? "text-red-700"
                        : "text-black"
                    }`}
                  >
                    {day}
                  </div>
                  <TimeBox type="am" day={day} />
                  <TimeBox type="pm" day={day} />
                  <TimeBox type="udur" day={day} />
                </div>
              );
            })
          )}
        </div>
      </div>

      <DateForm selected={selected} hallId={hallId} />
    </div>
  );
}
