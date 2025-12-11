"use client";

import Link from "next/link";

type HostType = {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  status: "Боломжтой" | "Захиалагдсан" | "Хүлээгдэж байна";
  tags: string[];
  price: number;
};

const handleBooking = async (hostId: number) => {
  try {
    const res = await fetch("/api/hosts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostId,
        userId: 1,
        date: new Date(),
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Booking request sent!");
    } else {
      alert("Something went wrong!");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending booking request.");
  }
};

export default function HostCard({ host }: { host: HostType }) {
  const isBooked = host.status === "Захиалагдсан";
  return (
    <div className="bg-[#1E2128FF] p-6 rounded-xl h-[478px] w-[374px] border border-gray-800 text-white hover:border-gray-600 transition">
      <img
        src={host.image}
        className="w-[120px] h-[120px] rounded-full mx-auto object-cover"
      />

      <h2 className="text-center mt-3 font-semibold text-xl">{host.name}</h2>
      <p className="text-center text-sm text-gray-400">{host.title}</p>

      {/* Tags */}
      <div className="flex justify-center items-center gap-2 flex-wrap mt-3">
        {host.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs bg-[#1E1E24] py-1 px-3 border border-blue-400   rounded-lg h-[30px] text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Rating */}
      <p className="text-center mt-4 font-semibold">⭐ {host.rating}/5</p>

      <div
        className={`pt-2 flex items-center justify-center text-xs   font-medium${
          host.status === "Боломжтой"
            ? "bg-[#00C853]  text-[#00C853] "
            : host.status === "Захиалагдсан"
            ? "bg-[#FF1744] text-[#FF1744] "
            : "bg-[#FFC400] text-[#FFC400] "
        }`}
      >
        {host.status}
      </div>

      {/* PRICE */}
      <p className="text-center text-blue-500 py-6 font-bold text-xl">
        {Number(host.price).toLocaleString()}₮
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between   space-x-2">
        <Link
          href={`/host/${host.id}`}
          className="flex-1 bg-[#000000FF] border border-blue-700 text-blue-700 py-2 rounded-lg hover:bg-[#2A2A35] text-sm text-center flex justify-center items-center"
        >
          Профайл үзэх
        </Link>

        <div className="relative flex-1 group">
          <button
            disabled={isBooked}
            onClick={() => !isBooked && handleBooking(host.id)}
            className={`w-full py-2 rounded-lg text-sm text-center transition
            ${
              isBooked
                ? "bg-gray-700 text-gray-400 cursor-not-allowed group-hover:opacity-30"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            Захиалах
          </button>

          {isBooked && (
            <div className="absolute left-1/2 top-[-38px] -translate-x-1/2 bg-red-700/90 text-xs text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
              Захиалагдсан
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
