/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Star, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import EventHallsSkeleton from "@/components/us/EventHallSkeleton";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import EventHallsPage from "./EventHallFilter";

export default function EventHalls() {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();

        if (data) {
          setOriginalHalls(data.data);
          setFilteredHalls(data.data);
          console.log(data.data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    getData();
  }, []);

  // SORTING
  useEffect(() => {
    const sorted = [...filteredHalls];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => {
        const priceA = Array.isArray(a.price) ? Math.min(...a.price) : a.price;
        const priceB = Array.isArray(b.price) ? Math.min(...b.price) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => {
        const priceA = Array.isArray(a.price) ? Math.min(...a.price) : a.price;
        const priceB = Array.isArray(b.price) ? Math.min(...b.price) : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredHalls(sorted);
  }, [sortBy]);

  return (
    <div className="flex mt-3">
      <div className="w-full min-h-screen mt-25 bg-black text-white flex flex-col md:flex-row gap-6 md:px-8 px-5">
        {/* FILTER SECTION */}
        <div className="w-full md:w-fit">
          {/* MOBILE FILTER */}
          <div className="md:hidden flex justify-between items-center mt-8 mb-6 w-full">
            <h1 className="text-3xl font-bold">Ивэнт холл хайх</h1>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-2 bg-white px-6 text-black hover:bg-neutral-200 py-2">
                  <Filter size={16} /> Шүүлтүүр
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80 max-w-[90vw] bg-neutral-900 text-white border border-neutral-800 p-4 rounded-lg shadow-lg flex flex-col max-h-[80vh] overflow-y-auto mx-auto z-100">
                <EventHallsPage
                  originalData={originalHalls}
                  onFilterChange={setFilteredHalls}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* DESKTOP FILTER */}
          <div className="hidden md:block w-80">
            <EventHallsPage
              originalData={originalHalls}
              onFilterChange={setFilteredHalls}
            />
          </div>
        </div>

        {/* EVENT HALLS GRID */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-4">Эвэнт халл хайх</h1>

            {/* SORT DROPDOWN ABOVE GRID */}

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">Эрэмбэлэх:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="filter-input w-52 bg-neutral-900">
                  <SelectValue placeholder="Багаас их" />
                </SelectTrigger>
                <SelectContent className="filter-dropdown bg-neutral-900 w-52">
                  <SelectItem
                    value="price-high"
                    className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                  >
                    Үнэ: Ихээс бага
                  </SelectItem>
                  <SelectItem
                    value="price-low"
                    className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                  >
                    Үнэ: Багаас их
                  </SelectItem>
                  <SelectItem
                    value="name"
                    className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                  >
                    Нэр
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && <EventHallsSkeleton />}

            {!loading &&
              filteredHalls.map((hall) => (
                <div
                  key={hall.id}
                  className="bg-neutral-900 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200 flex flex-col"
                >
                  <div className="relative h-60 bg-neutral-800">
                    <Image
                      src={
                        hall.images[0] ||
                        "https://img.freepik.com/premium-vector/image-icon-design-vector-template_1309674-943.jpg"
                      }
                      alt={hall.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold truncate">{hall.name}</h2>

                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <div className="flex items-center gap-1 truncate w-[80%]">
                        <span className="flex items-center gap-1">
                          {" "}
                          <MapPin className="z-50" size={14} />
                          {hall.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} />
                        <span>{hall.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-400 text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{hall.capacity} хүн</span>
                      </div>
                      <span className="font-semibold">${hall.price[1]}</span>
                    </div>

                    <Button
                      onClick={() => router.push(`/event-halls/${hall.id}`)}
                      className="mt-auto w-full bg-neutral-600 hover:bg-neutral-700 text-white py-2 rounded-lg"
                    >
                      Дэлгэрэнгүй
                    </Button>
                  </div>
                </div>
              ))}
            {!loading && filteredHalls.length === 0 && (
              <div className="col-span-full text-center mt-10 text-neutral-400 text-lg">
                Илэрц олдсонгүй.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
