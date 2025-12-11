import React, { useEffect, useRef } from "react";
import { Layers, CalendarCheck, Music, ShieldCheck } from "lucide-react";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: <Layers className="w-10 h-10 text-blue-500" />,
    title: "Vast Selection",
    description:
      "Explore a diverse range of top-quality event halls, from intimate lofts to grand ballrooms, all in one place.",
  },
  {
    icon: <CalendarCheck className="w-10 h-10 text-blue-500" />,
    title: "Seamless Booking",
    description:
      "Our intuitive platform makes it easy to check availability, get quotes, and book your perfect venue in minutes.",
  },
  {
    icon: <Music className="w-10 h-10 text-blue-500" />,
    title: "Talented Performers",
    description:
      "Elevate your event by hiring from our curated list of professional musicians, DJs, and entertainers.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
    title: "Verified & Trusted",
    description:
      "Every venue and performer on our platform is verified to ensure you receive the highest quality and reliability.",
  },
];

export const WhyChooseUs = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { ref, inView } = useInView({ threshold: 0.2 });
  const fadeRef = useRef<number | null>(null); // requestAnimationFrame id

  // Smooth fade function using requestAnimationFrame
  const fadeVolume = (target: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

    const step = () => {
      const diff = target - audio.volume;
      if (Math.abs(diff) < 0.01) {
        audio.volume = target;
        return;
      }
      // Smooth easing: volume += diff * 0.05
      audio.volume += diff * 0.05;
      fadeRef.current = requestAnimationFrame(step);
    };

    fadeRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start muted so autoplay works
    audio.muted = true;
    audio.volume = 0;

    // Start playing silently
    audio.play().catch(() => {});

    if (inView) {
      audio.muted = false; // unmute
      fadeVolume(1); // fade in
    } else {
      fadeVolume(0); // fade out
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative text-white min-h-screen flex flex-col justify-center overflow-hidden snap-start py-12 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Background Music */}
      <audio ref={audioRef} loop playsInline>
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-extrabold text-4xl lg:text-5xl mb-4">
            Why Choose Us?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-neutral-400">
            We provide an all-in-one solution to make your event planning
            effortless and exceptional.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-neutral-800 transition-transform hover:scale-105 hover:bg-black/60"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-neutral-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
