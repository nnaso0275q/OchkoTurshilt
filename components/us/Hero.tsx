/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Users, DollarSign, Star } from "lucide-react";

export const Hero = () => {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();

        if (data) {
          setOriginalHalls(data.data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <section className="bg-black text-white w-full min-h-screen flex flex-col justify-start snap-start overflow-hidden py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* Main Hero Text */}
        <h2
          className="font-extrabold text-5xl lg:text-8xl mb-4 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          Featured Event Halls
        </h2>
        <p
          className="max-w-3xl mx-auto text-lg text-blue-600 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          Таны арга хэмжээнд тохирох тансаг, өргөн болон тухтай заалуудыг эндээс
          олно уу. Том танхимаас эхлээд цэцэрлэгт хүрээлэнгийн жижиг заал
          хүртэл— танай арга хэмжээнд яг тохирсон орон зайг санал болгож байна.
        </p>
      </div>

      {/* Featured Cards Grid */}
      <div className="container mx-auto px-4 mt-12 lg:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {originalHalls.slice(0, 6).map((hall, index) => (
            <div
              key={hall.id}
              className="bg-neutral-900 rounded-lg overflow-hidden transform hover:shadow-xl hover:scale-[1.02] transition-transform duration-200"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={
                    hall.images?.[0] ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={hall.name}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-80"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-white">{hall.name}</h3>
                <p className="text-sm text-neutral-400 mt-1">{hall.location}</p>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800 text-sm text-neutral-300">
                  {/* Capacity */}
                  <div
                    className="flex items-center gap-1.5"
                    title="Хүний багтаамж"
                  >
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span>{hall.capacity} хүн</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1.5" title="Цагийн үнэ">
                    <DollarSign className="w-4 h-4 text-neutral-400" />
                    <span>{hall.price?.[0]}₮ / цаг</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5" title="Үнэлгээ">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{hall.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
