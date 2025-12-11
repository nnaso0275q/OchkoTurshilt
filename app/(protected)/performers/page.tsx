"use client";
import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { Filter } from "lucide-react";

export default function PerformersPage() {
  const router = useRouter();
  const [performers, setPerformers] = useState<any[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [minPopularity, setMinPopularity] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]); // All bookings for availability check
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingPerformer, setBookingPerformer] = useState<number | null>(null);
  const bookingRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetchPerformers();
    fetchGenres();
  }, []);
  useEffect(() => {
    setIsLoadingBookings(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("User not logged in → first booking cannot auto-select");
    }
    fetch("/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const bookingsData = data.bookings || [];

        setBookings(bookingsData);
        setAllBookings(bookingsData);
        setBookings(data.bookings);

        if (bookingsData.length > 0 && token) {
          setSelectedBooking(bookingsData[0]);
          console.log("Auto-selected first booking:", bookingsData[0]);
        }
      })
      .finally(() => setIsLoadingBookings(false));
  }, []);

  // Check if performer is booked for the selected time slot
  const isPerformerBooked = (performerId: number) => {
    if (!selectedBooking) return false;

    return allBookings.some((booking) => {
      // Compare dates by converting both to date strings (YYYY-MM-DD)
      const bookingDate = new Date(booking.date).toISOString().split("T")[0];
      const selectedDate = new Date(selectedBooking.date)
        .toISOString()
        .split("T")[0];

      return (
        booking.performersid === performerId &&
        bookingDate === selectedDate &&
        booking.starttime === selectedBooking.starttime &&
        booking.status !== "cancelled"
      );
    });
  };

  // Get performer availability status
  const getPerformerAvailability = (performerId: number) => {
    if (!selectedBooking) return "Сонголт хийнэ үү";

    // Find if performer has a booking for the selected time slot
    const performerBooking = allBookings.find((booking) => {
      // Compare dates by converting both to date strings (YYYY-MM-DD)
      const bookingDate = new Date(booking.date).toISOString().split("T")[0];
      const selectedDate = new Date(selectedBooking.date)
        .toISOString()
        .split("T")[0];

      return (
        booking.performersid === performerId &&
        bookingDate === selectedDate &&
        booking.starttime === selectedBooking.starttime &&
        booking.status !== "cancelled"
      );
    });

    // Debug logging - log ALL bookings for this performer
    const allPerformerBookings = allBookings.filter(
      (b) => b.performersid === performerId
    );
    if (allPerformerBookings.length > 0) {
      console.log(
        `Performer ID ${performerId} all bookings:`,
        allPerformerBookings
      );
      console.log(`Selected booking date/time:`, {
        date: selectedBooking?.date,
        dateFormatted: new Date(selectedBooking?.date)
          .toISOString()
          .split("T")[0],
        starttime: selectedBooking?.starttime,
      });
    }

    if (!performerBooking) return "Боломжтой";

    // Check booking status
    if (performerBooking.status === "pending") return "Хүлээгдэж байна";
    if (performerBooking.status === "approved") return "Захиалагдсан";

    return "Боломжтой";
  };

  const fetchPerformers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/performers");
      const data = await res.json();
      console.log("Fetched performers:", data.performers);

      setPerformers(data.performers || []);
    } catch (error) {
      console.error("Error fetching performers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleOnPerformerBooking = async (performerId: number) => {
    try {
      setBookingPerformer(performerId);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Захиалга хийхийн тулд эхлээд нэвтэрнэ үү.");
        setBookingPerformer(null);
        return;
      }

      if (!selectedBooking) {
        alert("Та эхлээд Event Hall-оос сонголт хийнэ үү.");
        setBookingPerformer(null);
        return;
      }

      const hallId = selectedBooking.hallid;
      const starttime = selectedBooking.starttime;

      const bookeddate = selectedBooking.date;
      console.log({ bookeddate });

      const res = await fetch("/api/performer-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ performerId, hallId, starttime, bookeddate }),
      });

      const data = await res.json();

      if (data.success) {
        alert(
          "Уран бүтээлчийг захиалах хүсэлт явууллаа. Таньд мэдэгдэл ирнэ, Dashboard хэсгээс харна уу!"
        );
      } else {
        alert(data.message || "Захиалга амжилтгүй боллоо.");
      }
    } catch (error) {
      console.error("Error booking performer:", error);
      alert("Серверийн алдаа.");
    } finally {
      setBookingPerformer(null);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch("/api/performers/genres");
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking);
    console.log("Selected Booking Details:", {
      id: booking.id,
      date: booking.date,
      starttime: booking.starttime,
      endtime: booking.endtime,
      hallId: booking.hallid,
      hallName: booking.event_halls?.name,
      status: booking.status,
    });
    // Scroll the selected booking into view
    setTimeout(() => {
      const element = bookingRefs.current[booking.id];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  const availabilityOptions = ["Боломжтой", "Захиалагдсан", "Хүлээгдэж байна"];

  const filteredPerformers = performers.filter((performer) => {
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => performer.genre?.includes(genre));

    // Filter by booking-based availability
    const performerAvailability = getPerformerAvailability(performer.id);
    const availabilityMatch =
      selectedAvailability.length === 0 ||
      selectedAvailability.includes(performerAvailability);

    // Debug logging
    if (selectedAvailability.length > 0) {
      console.log(`Performer ${performer.name}:`, {
        availability: performerAvailability,
        selectedFilters: selectedAvailability,
        matches: selectedAvailability.includes(performerAvailability),
      });
    }

    const popularityMatch = (performer.popularity || 0) >= minPopularity;
    const priceMatch =
      Number(performer.price) >= minPrice &&
      Number(performer.price) <= maxPrice;

    return genreMatch && availabilityMatch && popularityMatch && priceMatch;
  });

  const sortedPerformers = [...filteredPerformers].sort((a, b) => {
    if (sortBy === "popularity")
      return (b.popularity || 0) - (a.popularity || 0);
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Боломжтой":
        return "bg-green-600";
      case "Хүлээгдэж байна":
        return "bg-yellow-600";
      case "Захиалагдсан":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  /** FIXED FILTER SIDEBAR (removed sticky from inside) */
  const FilterControls = ({ isPopover = false }: { isPopover?: boolean }) => (
    <div
      className={`w-full bg-neutral-900 rounded-lg flex flex-col ${
        isPopover ? "max-h-[80vh] overflow-y-auto p-3" : "p-6"
      }`}
    >
      <h2 className="text-xl font-bold text-white mb-4">
        Таны захиалсан Event hall
      </h2>

      {/* Scrollable bookings list */}
      <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scroll">
        {isLoadingBookings
          ? // Skeleton loading for bookings
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl bg-neutral-800/60 border border-neutral-700/40 p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="space-y-2 mb-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3 mt-2" />
              </div>
            ))
          : bookings?.map((b: any) => (
              <div
                key={b.id}
                ref={(el) => {
                  bookingRefs.current[b.id] = el;
                }}
                onClick={() => handleBookingSelect(b)}
                className={`rounded-xl bg-neutral-800/60 border p-4 hover:bg-neutral-800/80 transition-colors backdrop-blur-sm cursor-pointer ${
                  selectedBooking?.id === b.id
                    ? "border-blue-500 bg-neutral-800/80"
                    : "border-neutral-700/40"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-white">
                    {b.event_halls?.name ?? "Event Hall"}
                    {selectedBooking?.id === b.id && (
                      <span className="ml-2 text-blue-400 text-sm">
                        ✓ Сонгогдсон
                      </span>
                    )}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                      b.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : b.status === "approved"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* Details */}
                <div className="text-sm text-neutral-300 space-y-1 mb-2">
                  <div>
                    <span className="font-medium text-neutral-100">Өдөр:</span>{" "}
                    {new Date(b.date).toLocaleDateString()}
                  </div>

                  <div>
                    <span className="font-medium text-neutral-100">
                      Эхлэх цаг:
                    </span>{" "}
                    {b.starttime}
                  </div>
                </div>

                {/* Description */}
                <p className="text-neutral-400 text-sm mb-2 leading-relaxed">
                  {b.event_description}
                </p>

                {/* Location */}
                <div className="text-neutral-500 text-sm flex items-center gap-1">
                  <span>📍</span>
                  <span className="truncate">{b.event_halls?.location}</span>
                </div>
              </div>
            ))}
      </div>

      {/* Filters */}
      <h2 className="font-bold text-white mb-4 mt-3">Шүүлтүүр</h2>

      {/* Genre */}
      <div className="mb-6">
        <h3
          className="font-semibold mb-3 flex items-center gap-2 cursor-pointer hover:text-neutral-300"
          onClick={() => setIsGenreOpen(!isGenreOpen)}
        >
          🎵 Төрөл
          {isGenreOpen ? (
            <FaChevronUp className="ml-auto" />
          ) : (
            <FaChevronDown className="ml-auto" />
          )}
        </h3>

        {isGenreOpen && (
          <div className="space-y-2">
            {genres.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={(checked: any) =>
                    checked
                      ? setSelectedGenres([...selectedGenres, genre])
                      : setSelectedGenres(
                          selectedGenres.filter((g) => g !== genre)
                        )
                  }
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Боломжтой эсэх</h3>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedAvailability.includes(option)}
                onCheckedChange={(checked: any) =>
                  checked
                    ? setSelectedAvailability([...selectedAvailability, option])
                    : setSelectedAvailability(
                        selectedAvailability.filter((a) => a !== option)
                      )
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popularity */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Алдартай байдал</h3>
        <div className="px-2 py-4">
          <Slider
            min={0}
            max={100000}
            step={5000}
            value={[minPopularity]}
            onValueChange={(value) => setMinPopularity(value[0])}
            className="w-full"
          />
        </div>
        <div className="text-sm text-gray-400 mt-3 flex justify-between px-2">
          <span>Хамгийн бага: {minPopularity.toLocaleString()}</span>
          <span className="text-xs text-gray-500">Макс: 100,000</span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">💰 Үнийн хүрээ</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">
              Хамгийн бага:
            </label>
            <Select
              value={minPrice.toString()}
              onValueChange={(value) => setMinPrice(parseInt(value))}
            >
              <SelectTrigger className="w-full bg-neutral-800 text-white border-neutral-700 hover:border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                <SelectItem value="0">0₮</SelectItem>
                <SelectItem value="500000">500,000₮</SelectItem>
                <SelectItem value="1000000">1,000,000₮</SelectItem>
                <SelectItem value="1500000">1,500,000₮</SelectItem>
                <SelectItem value="2000000">2,000,000₮</SelectItem>
                <SelectItem value="3000000">3,000,000₮</SelectItem>
                <SelectItem value="5000000">5,000,000₮</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">
              Хамгийн их:
            </label>
            <Select
              value={maxPrice.toString()}
              onValueChange={(value) => setMaxPrice(parseInt(value))}
            >
              <SelectTrigger className="w-full bg-neutral-800 text-white border-neutral-700 hover:border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                <SelectItem value="1000000">1,000,000₮</SelectItem>
                <SelectItem value="2000000">2,000,000₮</SelectItem>
                <SelectItem value="3000000">3,000,000₮</SelectItem>
                <SelectItem value="5000000">5,000,000₮</SelectItem>
                <SelectItem value="10000000">10,000,000₮</SelectItem>
                <SelectItem value="100000000">Хязгааргүй</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500 flex justify-between px-1">
          <span>{minPrice.toLocaleString()}₮</span>
          <span>—</span>
          <span>
            {maxPrice === 100000000 ? "∞" : maxPrice.toLocaleString() + "₮"}
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedGenres([]);
          setSelectedAvailability([]);
          setMinPopularity(0);
          setMinPrice(0);
          setMaxPrice(100000000);
          setSortBy("popularity");
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Шүүлтүүр цэвэрлэх
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 sm:px-8 pt-28">
      <div className="flex gap-8">
        {/* FIXED SIDEBAR */}
        <div className="w-80 shrink-0 hidden lg:block">
          <div className="sticky top-28">
            <FilterControls isPopover={false} />
          </div>
        </div>

        {/* Performer Grid */}
        <div className="flex-1 w-full">
          <div className="flex justify-between">
            <h1 className="text-4xl font-bold mb-8">Уран бүтээлчид хайх</h1>
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">Эрэмбэлэх:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-neutral-800 text-white border-neutral-700 hover:border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                  <SelectItem
                    value="popularity"
                    className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                  >
                    Алдартай байдал
                  </SelectItem>
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
          <div className="flex justify-between items-center mb-8">
            {/* Mobile Popover */}
            <div className="lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="gap-2 bg-white text-black hover:bg-neutral-200 ">
                    <Filter className="h-4 w-4" />
                    Шүүлтүүр
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 bg-neutral-900 text-white border border-neutral-800">
                  <FilterControls isPopover={true} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-4 text-gray-400 text-sm">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              `${sortedPerformers.length} уран бүтээлч олдлоо`
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-neutral-900 rounded-lg overflow-hidden"
                >
                  <Skeleton className="h-60 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 flex-1" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {sortedPerformers.map((performer) => (
                  <div
                    key={performer.id}
                    className="bg-neutral-900 rounded-lg overflow-hidden hover:scale-[1.02] transition"
                  >
                    <div className="relative h-90 bg-neutral-800">
                      {performer.image ? (
                        <Image
                          src={performer.image}
                          alt={performer.name}
                          fill
                          className="object-cover"
                          unoptimized
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/400x300?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          No Image
                        </div>
                      )}

                      <div
                        className={`absolute top-3 left-3 ${getAvailabilityColor(
                          getPerformerAvailability(performer.id)
                        )} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {getPerformerAvailability(performer.id)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-1">
                        {performer.name}
                      </h3>

                      <p className="text-neutral-400 text-sm mb-3 truncate">
                        {performer.performance_type || performer.genre}
                      </p>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaStar className="text-yellow-400" />
                          <span className="font-semibold">
                            {performer.popularity
                              ? Number(performer.popularity).toLocaleString()
                              : "N/A"}
                          </span>
                          <span className="text-xs text-gray-400">
                            Viberate
                          </span>
                        </div>

                        <div className="text-lg font-bold text-blue-600">
                          {Number(performer.price).toLocaleString()}₮
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/performers/${performer.id}`)
                          }
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg"
                        >
                          Профайл үзэх
                        </button>

                        <button
                          onClick={() => HandleOnPerformerBooking(performer.id)}
                          disabled={bookingPerformer === performer.id}
                          className={`flex-1 text-white py-2 rounded-lg transition-colors ${
                            bookingPerformer === performer.id
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {bookingPerformer === performer.id
                            ? "Түр хүлээнэ үү..."
                            : "Захиалах"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!isLoading && sortedPerformers.length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <div className="text-neutral-400 text-lg mb-2">
                      Уучлаарай, уран бүтээлч олдсонгүй
                    </div>
                    <div className="text-neutral-500 text-sm">
                      Шүүлтүүрийг өөрчилж дахин оролдоно уу
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
