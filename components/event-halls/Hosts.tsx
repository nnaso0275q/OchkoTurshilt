"use client";

type HostType = {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  status: "Available" | "Booked" | "Inquire";
  tags: string[];
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
  return (
    <div className="bg-[#1E2128FF] p-6 rounded-xl h-[478px] w-[374px] border border-gray-800 text-white hover:border-gray-600 transition">
      <img
        src="pro.png"
        className="w-24 h-24 rounded-full mx-auto object-cover"
      />

      <h2 className="text-center mt-3 font-semibold text-xl">{host.name}</h2>
      <p className="text-center text-sm text-gray-400">{host.title}</p>

      {/* Tags */}
      <div className="flex justify-center gap-2 flex-wrap mt-3">
        {host.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs bg-[#1E1E24] py-1 px-3 rounded-lg text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Rating */}
      <p className="text-center mt-4 font-semibold">⭐ {host.rating} / 5.0</p>

      <div
        className={`py-2 pt-8 pb-6 flex items-center justify-center text-xs  font-medium${
          host.status === "Available"
            ? "bg-[#00C853]  text-[#00C853] "
            : host.status === "Booked"
            ? "bg-[#FF1744] text-[#FF1744] "
            : "bg-[#FFC400] text-[#FFC400] "
        }`}
      >
        {host.status}
      </div>
      <div></div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4 space-x-2">
        <button className="flex-1 bg-[#000000FF]  text-blue-700 py-2 rounded-lg hover:bg-[#2A2A35] text-sm">
          View Profile
        </button>

        <button
          onClick={() => handleBooking(host.id)}
          className="flex-1 bg-blue-700 py-2 rounded-lg hover:bg-blue-800 text-sm text-center"
        >
          Book now
        </button>
      </div>
    </div>
  );
}
