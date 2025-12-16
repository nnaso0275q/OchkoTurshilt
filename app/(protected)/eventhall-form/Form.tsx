"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrashIcon } from "lucide-react";

export default function EventHallForm() {
  const [name, setName] = useState<string>("");
  const [hallName, setHallName] = useState<string>("");
  const [suitableEvents, setSuitableEvents] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [menu, setMenu] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationLink, setLocationLink] = useState<string>("");
  const [parkingCapacity, setParkingcapacity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [additional, setAdditional] = useState<string>("");
  const [aboutHall, setAboutHall] = useState<string>("");
  const [advantages, setAdvantages] = useState<string>("");
  const [booking, setBooking] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
    if (index === images.length) setImages([...newImages]);
  };

  const deleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base64Images = await Promise.all(
        images.map(async (img) => {
          const arrayBuffer = await img.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return `data:${img.type};base64,${buffer.toString("base64")}`;
        })
      );
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          hallName,
          suitableEvents,
          price,
          rating,
          menu,
          location,
          locationLink,
          parkingCapacity,
          description,
          additional,
          aboutHall,
          advantages,
          booking,
          capacity,
          phoneNumber,
          email,
          images: base64Images,
        }),
      });
      const data = await response.json();
      alert(data.message);
      setName("");
      setHallName("");
      setSuitableEvents("");
      setPrice("");
      setRating("");
      setMenu("");
      setLocation("");
      setLocationLink("");
      setParkingcapacity("");
      setDescription("");
      setAdditional("");
      setAboutHall("");
      setAdvantages("");
      setBooking("");
      setCapacity("");
      setPhoneNumber("");
      setEmail("");
      setImages([]);
    } catch (error) {
      console.error(error);
      alert("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="relative p-2 rounded-3xl border border-blue-900 w-full max-w-4xl">
        <div className="rounded-3xl p-10 space-y-8">
          <h1 className="text-4xl font-bold text-center text-gray-100 drop-shadow-md">
            ✨ Event Hall Form
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Холбоо барих хүний нэр */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Холбоо барих хүний нэр *
              </div>
              <Input
                type="name"
                className="h-14 rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 shadow-sm transition"
                placeholder="Холбоо барих хүний нэр"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Заалны нэр */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Заалны нэр *
              </div>
              <Input
                className="h-14 rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 shadow-sm transition"
                placeholder="Жишээ: Оргил Зочид Буудал"
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
              />
            </div>

            {/* Хаяг / Байршил */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Хаяг / Байршил *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="УБ, ХУД..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Холбоо барих утас */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Холбоо барих утас *
              </div>
              <Input
                className="h-14 rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 shadow-sm transition"
                placeholder="9999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* И-мэйл хаяг */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                И-мэйл хаяг *
              </div>
              <Input
                className="h-14 rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 shadow-sm transition"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Suitable Events */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Suitable Events *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="Хүлээн авалт, хурим, концерт..."
                value={suitableEvents}
                onChange={(e) => setSuitableEvents(e.target.value)}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Price *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-14 p-3 shadow-sm transition"
                placeholder="Жишээ: 500,000₮ / өдөр"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Rating *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-14 p-3 shadow-sm transition"
                placeholder="Жишээ: 4.5/5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>

            {/* Menu */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">Menu *</div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="Жишээ: Тусгай цэс"
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
              />
            </div>

            {/* Parking Capacity */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Parking Capacity *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-14 p-3 shadow-sm transition"
                placeholder="Жишээ: 50 машины зогсоол"
                value={parkingCapacity}
                onChange={(e) => setParkingcapacity(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Description *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="Заалны тухай товч мэдээлэл"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Additional */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Additional *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="Нэмэлт боломжууд"
                value={additional}
                onChange={(e) => setAdditional(e.target.value)}
              />
            </div>

            {/* About Hall */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                About Hall *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="Заалны дэлгэрэнгүй мэдээлэл"
                value={aboutHall}
                onChange={(e) => setAboutHall(e.target.value)}
              />
            </div>

            {/* Advantages */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Advantages *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="Давуу талууд"
                value={advantages}
                onChange={(e) => setAdvantages(e.target.value)}
              />
            </div>

            {/* Booking */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Booking *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
                placeholder="Бүртгэх боломжууд"
                value={booking}
                onChange={(e) => setBooking(e.target.value)}
              />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                capacity *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-14 p-3 shadow-sm transition"
                placeholder="Хүний тоо"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="text-gray-300 font-medium text-sm">Зургууд *</div>
              <div className="flex flex-wrap gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <Image
                      src={URL.createObjectURL(img)}
                      alt="Image"
                      width={220}
                      height={150}
                      className="rounded-xl border border-gray-600 shadow-sm object-cover"
                    />
                    <TrashIcon
                      onClick={() => deleteImage(i)}
                      className="absolute top-2 right-2 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      size={26}
                    />
                  </div>
                ))}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAddImage(e, images.length)}
                  className="h-[150px] w-[220px] border-2 border-dashed border-gray-600 rounded-xl text-sm text-white  placeholder-gray-400 shadow-sm cursor-pointer flex items-center justify-center text-center"
                />
              </div>
            </div>

            {/* Location link */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Location link *
              </div>
              <Textarea
                className="rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-20 p-3 shadow-sm transition"
                placeholder="Жишээ: Google Maps link"
                value={locationLink}
                onChange={(e) => setLocationLink(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-linear-to-r from-blue-600 to-blue-900 hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </Button>
          </form>

          <Link href="/home">
            <Button className="w-full h-14 text-white rounded-xl bg-linear-to-r from-blue-600 to-blue-900 hover:brightness-110 hover:scale-[1.02] transition-all">
              🏠 Нүүр хуудас руу буцах
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
