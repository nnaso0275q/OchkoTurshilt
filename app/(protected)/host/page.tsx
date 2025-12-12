"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import HostCard from "@/components/us/Host";
import { RotateCcw } from "lucide-react";
import { use, useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { MdOutlinePersonSearch } from "react-icons/md";

// DESIGN COMPONENTS

type HostDB = {
  id: number;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  title: string;
  image: string;
  tags: string[];
  rating: number;
  status: "Боломжтой" | "Захиалагдсан" | "Хүлээгдэж байна";
  price: number;
};

const Host = ({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) => {
  const params = use(searchParams);

  const bookingIdFromUrl = params?.booking; // Get booking ID from URL

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");

  const [priceRange, setPriceRange] = useState([2000000, 10000000]);
  const [minRating, setMinRating] = useState("0");
  const [maxRating, setMaxRating] = useState("5");

  // Data States
  const [hosts, setHosts] = useState<HostDB[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<HostDB[]>([]);

  // Booking states
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // FETCH BOOKINGS
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const bookingsData = data.bookings || [];
        setBookings(bookingsData);

        // If booking ID is in URL, find and select that specific booking
        if (bookingIdFromUrl && bookingsData.length > 0) {
          const matchingBooking = bookingsData.find(
            (b: any) => b.id === parseInt(bookingIdFromUrl)
          );

          if (matchingBooking) {
            setSelectedBooking(matchingBooking);
            console.log(
              "✅ Auto-selected booking for host page:",
              matchingBooking
            );
          } else {
            setSelectedBooking(bookingsData[0]);
          }
        } else if (bookingsData.length > 0) {
          setSelectedBooking(bookingsData[0]);
        }
      });
  }, [bookingIdFromUrl]);

  // FETCH HOSTS
  useEffect(() => {
    fetch("/api/hosts")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: HostDB, b: HostDB) => b.rating - a.rating);
        setHosts(sorted);
        setFilteredHosts(sorted);
      });
  }, []);

  // APPLY FILTER LOGIC
  const handleFilter = () => {
    let result = [...hosts];

    // SEARCH
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // TAG FILTER
    if (selectedTag !== "all") {
      result = result.filter((h) => h.tags.includes(selectedTag));
    }

    // STATUS FILTER
    if (availability !== "all") {
      result = result.filter((h) => h.status === availability);
    }

    // RATING FILTER
    result = result.filter(
      (h) => h.rating >= Number(minRating) && h.rating <= Number(maxRating)
    );

    // PRICE FILTER
    result = result.filter(
      (h) => h.price >= priceRange[0] && h.price <= priceRange[1]
    );

    setFilteredHosts(result);
  };

  // RESET FILTERS
  const handleReset = () => {
    setSearchQuery("");
    setSelectedTag("all");
    setAvailability("all");
    setPriceRange([2000000, 10000000]);
    setMinRating("0");
    setMaxRating("5");

    setFilteredHosts(hosts);
  };

  return (
    <div className="min-h-screen bg-[#09090D] text-white px-32">
      <h1 className="text-3xl font-bold mb-6 pt-[108px] pb-[72px] text-center">
        Discover Your Ideal Host or MC
      </h1>

      {/* FILTER CARD */}
      <div className="rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur-[20px] border border-white/10">
        {/* TOP ROW */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 min-w-[280px]">
            <MdOutlinePersonSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
            <Input
              type="text"
              placeholder="Хөтлөгч хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-full border border-white/10 bg-white/5 text-white placeholder:text-white/40 pl-12 pr-4 focus-visible:ring-2 focus-visible:ring-blue-500/50  focus-visible:border-blue-500/50 outline-none"
            />
          </div>

          {/* TAG FILTER */}
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="h-12 w-[200px] rounded-xl border-white/10 bg-white/5 text-white backdrop-blur-sm">
              <SelectValue placeholder="Төрөл сонгох" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1A1A24]/95 backdrop-blur-xl text-white">
              <SelectItem value="all">Бүгд</SelectItem>
              <SelectItem value="Телевизийн хөтлөгч">
                Телевизийн хөтлөгч
              </SelectItem>
              <SelectItem value="Комеди">Комеди</SelectItem>
              <SelectItem value="Эвент">Эвент</SelectItem>
              <SelectItem value="Энтертайнмент">Энтертайнмент</SelectItem>
            </SelectContent>
          </Select>

          {/* STATUS FILTER */}
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger className="h-12 w-[180px] rounded-xl border-white/10 bg-white/5 text-white backdrop-blur-sm">
              <SelectValue placeholder="Боломжит байдал" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1A1A24]/95 backdrop-blur-xl text-white ">
              <SelectItem value="all">Бүгд</SelectItem>
              <SelectItem value="Боломжтой">Боломжтой</SelectItem>
              <SelectItem value="Захиалагдсан">Захиалагдсан</SelectItem>
              <SelectItem value="Хүлээгдэж байна">Хүлээгдэж байна</SelectItem>
            </SelectContent>
          </Select>

          {/* RESET BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-wrap items-end gap-6">
          {/* RATING */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-white/70">
              Үнэлгээ:
            </label>

            <Input
              type="number"
              min="0"
              max="5"
              step="1"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="h-10 w-20 rounded-xl border-white/10 bg-white/5 text-center text-white focus-visible:ring-2 focus-visible:ring-blue-500/50  focus-visible:border-blue-500/50 outline-none"
            />

            <span className="text-white/40">-</span>

            <Input
              type="number"
              min="0"
              max="5"
              step="1"
              value={maxRating}
              onChange={(e) => setMaxRating(e.target.value)}
              className="h-10 w-20 rounded-xl border-white/10 bg-white/5 text-center text-white focus-visible:ring-2 focus-visible:ring-blue-500/50  focus-visible:border-blue-500/50 outline-none"
            />
          </div>

          {/* PRICE RANGE */}
          <div className="flex-1 min-w-[280px]">
            <label className="mb-3 block text-sm font-medium text-white/70">
              Үнийн хязгаар: {priceRange[0].toLocaleString()}₮ –{" "}
              {priceRange[1].toLocaleString()}₮
            </label>

            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={2000000}
              max={10000000}
              step={100000}
            />
          </div>

          {/* SEARCH BUTTON */}
          <Button
            onClick={handleFilter}
            className="h-12 rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 px-8 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-blue-600 transition-all"
          >
            <IoMdSearch className=" w-5" />
            Хайх
          </Button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="pt-12 pb-8 flex gap-4 flex-wrap">
        {filteredHosts.map((host) => (
          <HostCard
            key={host.id}
            host={host}
            selectedBooking={selectedBooking}
          />
        ))}
      </div>
    </div>
  );
};
export default Host;
