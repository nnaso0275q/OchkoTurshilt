"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FaMapMarkerAlt, FaPhone, FaParking } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/us/Header";
import MonthlyCalendar from "@/components/event-halls/DayCalendar";
import Image from "next/image";

interface EventHall {
  id: number;
  name: string;
  location?: string | null;
  capacity?: string | null;
  description?: string | null;
  suitable_events: string[];
  created_at?: Date | string | null;
  images: string[];
  phonenumber?: string | null;
  menu: string[];
  parking_capacity?: number | null;
  additional_informations: string[];
  informations_about_hall: string[];
  advantages: string[];
  localtion_link?: string | undefined;
}

export default function SelectedEventHall() {
  const params = useParams();
  const eventHallId = params.id as string;

  const [eventHallData, setEventHallData] = useState<EventHall | null>(null);

  const [api, setApi] = useState<CarouselApi>();
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      autoplayPlugin.current?.reset();
      autoplayPlugin.current?.play();
    });
  }, [api]);

  const getSelectedEventHall = useCallback(async () => {
    if (!eventHallId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/selected-event-hall`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventHallId }),
      });
      const data = await res.json();
      console.log("selectedEventHallData", data);

      setEventHallData(data.data);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    }
  }, [eventHallId]);

  useEffect(() => {
    getSelectedEventHall();
  }, [getSelectedEventHall]);

  return (
    <div className="min-h-screen bg-black pb-20">
      <Header />
      <div className="w-full relative">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          setApi={setApi}
        >
          <CarouselContent>
            {eventHallData?.images?.map((src: string, index: number) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-[70vh] overflow-hidden flex items-center justify-center">
                  <Image
                    fill
                    src={src}
                    alt={eventHallData?.name || "Event Hall Image"}
                    className="object-cover animate-fadeIn"
                  />

                  <div className="absolute inset-0 bg-black/40 animate-fadeIn" />

                  <div className="absolute z-10 bg-black/30 backdrop-blur-[2px] px-8 py-4 rounded-lg border border-white/20">
                    <h1 className="text-white text-4xl md:text-6xl font-bold text-center tracking-wide">
                      {eventHallData?.name}
                    </h1>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation arrows */}
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 text-white">
        {/* Location and Contact Info */}
        <div className="bg-neutral-900 rounded-lg p-6 my-20">
          <div className="space-y-1">
            <div className="text-white-100 flex gap-5 items-center">
              <FaMapMarkerAlt size={24} color="blue" />
              {eventHallData?.location}
              <a
                href={eventHallData?.localtion_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
              >
                Show on map
              </a>
            </div>
          </div>

          <div>
            <div className="p-4 flex gap-16">
              <div className="flex items-center gap-2">
                <FaPhone color="blue" />
                <strong> Утас:</strong> {eventHallData?.phonenumber}
              </div>
              <div className="flex items-center gap-2">
                <FaPeopleGroup size={24} color="blue" />
                <strong>Хүчин чадал:</strong> {eventHallData?.capacity}
              </div>
              <div className="flex items-center gap-2">
                <MdOutlineRestaurantMenu size={24} color="blue" />
                <strong>Меню:</strong> {eventHallData?.menu}
              </div>
              <div className="flex items-center gap-2">
                <FaParking size={24} color="blue" />
                <strong>Машины зогсоол:</strong>{" "}
                {eventHallData?.parking_capacity}
              </div>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="bg-neutral-900 rounded-lg">
          <div className="p-6 space-y-4">
            <p>{eventHallData?.description}</p>

            <ul className="pl-6 space-y-1">
              {eventHallData?.advantages?.map(
                (advantage: string, index: number) => (
                  <li key={index} className="flex gap-2 items-center">
                    <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />
                    {advantage}
                  </li>
                )
              )}
            </ul>

            <p>
              <strong>Хаяг:</strong> {eventHallData?.location}
            </p>
          </div>
        </div>

        <div className="flex  justify-between my-20">
          <div className="p-6 space-y-4 bg-neutral-900 rounded-lg">
            <h3 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-2 mb-4">
              Нэмэлт мэдээлэл
            </h3>
            <ul className="pl-6 space-y-1">
              {eventHallData?.additional_informations?.map(
                (info: string, index: number) => (
                  <li key={index} className="flex gap-2 items-center">
                    <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />
                    {info}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Suitable Events */}
          <div className="bg-neutral-900 rounded-lg">
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-2 mb-4">
                Тохиромжтой хүлээн авалтууд
              </h3>
              <ul className="pl-6 space-y-1">
                {eventHallData?.suitable_events?.map(
                  (suitable_event: string, index: number) => (
                    <li key={index} className="flex gap-2 items-center">
                      <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />
                      {suitable_event}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Hall Specs */}
          <div className="p-6 space-y-3 bg-neutral-900 rounded-lg ">
            <h3 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-2 mb-4">
              Танхимын мэдээлэл
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {eventHallData?.informations_about_hall?.map(
                (info: string, index: number) => (
                  <li key={index} className="flex gap-2 items-center">
                    <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />

                    {info}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto my-20">
        <h2 className="text-3xl font-bold text-white text-center border-b-2 border-blue-500 pb-4 mb-8">
          Манай үйлчлүүлэгчдийн сэтгэгдэл
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 rounded-lg p-6 space-y-4">
            <div className="flex gap-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-white italic">
              {`Гайхалтай орчин, мэргэжлийн үйлчилгээ. Хуримын баярыг маань
              дурсамжтай болгосонд баярлалаа!`}
            </p>
            <div className="border-t border-gray-400 pt-4">
              <p className="text-white font-semibold">Батболд Б.</p>
              <p className="text-gray-300 text-sm">Хурим</p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-neutral-900 rounded-lg p-6 space-y-4">
            <div className="flex gap-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-white italic">
              {`"Компанийн арга хэмжээ зохион байгуулахад тохиромжтой. Техник
              хэрэгсэл, сандал ширээ бүгд гоё байсан."`}
            </p>
            <div className="border-t border-gray-400 pt-4">
              <p className="text-white font-semibold">Сарантуяа Ч.</p>
              <p className="text-gray-300 text-sm">Корпорац арга хэмжээ</p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-neutral-900 rounded-lg p-6 space-y-4">
            <div className="flex gap-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-white italic">
              {`Төгс байршил, үйлчилгээ сайхан. Хүүгийнхээ төрсөн өдрийг энд
              тэмдэглэсэн нь маш таатай байлаа!`}
            </p>
            <div className="border-t border-gray-400 pt-4">
              <p className="text-white font-semibold">Эрдэнэ М.</p>
              <p className="text-gray-300 text-sm">Төрсөн өдөр</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <MonthlyCalendar hallId={eventHallId}></MonthlyCalendar>
      </div>
    </div>
  );
}
