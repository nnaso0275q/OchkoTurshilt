/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaMapMarkerAlt, FaPhone, FaParking } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineRestaurantMenu } from "react-icons/md";

import { Header } from "@/components/us/Header";
import MonthlyCalendar from "@/components/event-halls/DayCalendar";
import { CarouselMy } from "@/components/us/CarouselMy";

interface EventHall {
  rating: number;
  id: number;
  name: string;
  location?: string | null;
  capacity?: string | null;
  description?: string | null;
  suitable_events: string[];
  images: string[];
  phonenumber?: string | null;
  menu: string[];
  parking_capacity?: number | null;
  additional_informations: string[];
  informations_about_hall: string[];
  advantages: string[];
  localtion_link?: string;
}

export default function SelectedEventHall() {
  const params = useParams();
  const eventHallId = params.id as string;

  const [eventHallData, setEventHallData] = useState<EventHall | null>(null);

  const getSelectedEventHall = useCallback(async () => {
    if (!eventHallId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/selected-event-hall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventHallId }),
      });
      const data = await res.json();
      setEventHallData(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    }
  }, [eventHallId]);

  useEffect(() => {
    getSelectedEventHall();
  }, [getSelectedEventHall]);

  return (
    <div className="min-h-screen bg-black pb-20 overflow-y-scroll snap-y snap-mandatory">
      {/* === Carousel Section using your CarouselMy === */}
      {eventHallData && eventHallData.images.length > 0 && (
        <CarouselMy
          halls={[
            {
              id: eventHallData.id,
              name: eventHallData.name,
              title: eventHallData.name,
              description: eventHallData.description || "",
              duureg: "",
              rating: eventHallData.rating || 0,
              images: eventHallData.images,
            },
          ]}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6 text-white">
        {/* Location and Contact Info */}
        <div className="bg-neutral-900 rounded-lg p-6 my-20">
          <div className="space-y-1">
            <div className="text-white-100 flex gap-5 items-center">
              <FaMapMarkerAlt size={24} color="blue" />
              {eventHallData?.location}
              {eventHallData?.localtion_link && (
                <a
                  href={eventHallData.localtion_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
                >
                  Show on map
                </a>
              )}
            </div>
          </div>

          <div className="p-4 flex gap-16 flex-wrap">
            <div className="flex items-center gap-2">
              <FaPhone color="blue" />
              <strong>Утас:</strong> {eventHallData?.phonenumber}
            </div>
            <div className="flex items-center gap-2">
              <FaPeopleGroup size={24} color="blue" />
              <strong>Хүчин чадал:</strong> {eventHallData?.capacity}
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineRestaurantMenu size={24} color="blue" />
              <strong>Меню:</strong> {eventHallData?.menu.join(", ")}
            </div>
            <div className="flex items-center gap-2">
              <FaParking size={24} color="blue" />
              <strong>Машины зогсоол:</strong> {eventHallData?.parking_capacity}
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="bg-neutral-900 rounded-lg">
          <div className="p-6 space-y-4">
            <p>{eventHallData?.description}</p>

            <ul className="pl-6 space-y-1">
              {eventHallData?.advantages?.map((advantage, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />
                  {advantage}
                </li>
              ))}
            </ul>

            <p>
              <strong>Хаяг:</strong> {eventHallData?.location}
            </p>
          </div>
        </div>

        {/* Additional Info & Suitable Events */}
        <div className="flex flex-col lg:flex-row justify-between my-20 gap-6">
          <div className="p-6 space-y-4 bg-neutral-900 rounded-lg flex-1">
            <h3 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-2 mb-4">
              Нэмэлт мэдээлэл
            </h3>
            <ul className="pl-6 space-y-1">
              {eventHallData?.additional_informations?.map((info, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />
                  {info}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 space-y-4 bg-neutral-900 rounded-lg flex-1">
            <h3 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-2 mb-4">
              Тохиромжтой хүлээн авалтууд
            </h3>
            <ul className="pl-6 space-y-1">
              {eventHallData?.suitable_events?.map((event, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />
                  {event}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 space-y-3 bg-neutral-900 rounded-lg flex-1">
            <h3 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-2 mb-4">
              Танхимын мэдээлэл
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {eventHallData?.informations_about_hall?.map((info, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <IoMdCheckmarkCircleOutline className="text-green-400 shrink-0" />
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-6xl mx-auto my-20">
        <MonthlyCalendar hallId={eventHallId} />
      </div>
    </div>
  );
}
