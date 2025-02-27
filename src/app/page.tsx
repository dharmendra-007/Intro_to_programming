"use client";
import { useEffect, useState } from "react";
import MatrixRain from "@/components/MatrixRain";
import "./globals.css";
import { Cobe } from "@/components/eldoraui/cobeglobe";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [status, setStatus] = useState<"before" | "live" | "ended">("before");

  useEffect(() => {
    // const startDate = new Date("2025-02-13T17:00:00Z").getTime();
    // const endDate = new Date("2025-02-27T23:59:59Z").getTime();
    const startDate = new Date(Date.UTC(2025, 1, 13, 11, 30, 0)).getTime(); // 17:00 IST (UTC+5:30)
    const endDate = new Date(Date.UTC(2025, 2, 2, 18, 29, 59)).getTime(); // 23:59:59 IST (UTC+5:30)

    const interval = setInterval(() => {
      const now = new Date().getTime();

      if (now < startDate) {
        setStatus("before");
        const distance = startDate - now;
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else if (now >= startDate && now <= endDate) {
        setStatus("live");
        const distance = endDate - now;
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setStatus("ended");
        setTimeLeft(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-zinc-900 max-h-screen h-[100dvh] items-center justify-between py-6 relative">
      <Image src='/images/Enigma.png' height={80} width={80} alt="logo" className="absolute sm:top-8 sm:left-8 max-sm:hidden z-10" />
      <MatrixRain />
      <div className="flex flex-col z-10">
        <h2 className="text-center text-4xl md:text-5xl lg:text-7xl font-extrabold text-white font-life-style-regular md:my-3">
          {/* Introduction To Programming */}
          Induction 2.0
        </h2>
        <h5 className="text-center text-xs md:text-sm lg:text-lg font-medium text-white">
          {/* Introduction To Programming */}
          (For Second Year Students Only)
        </h5>
        {status === "before" && (
          <p className="text-center text-sm md:text-lg font-normal text-neutral-200 w-[80%] md:w-[70%] mt-2 mx-auto font-mono ">
            Registration opens in:
          </p>
        )}
        {status === "live" && (
          <p className="text-center text-sm md:text-lg font-normal text-orange-400 w-[80%] md:w-[70%] mt-2 mx-auto font-mono">
            Registration is live! Register now before it ends.
          </p>
        )}
        {status === "ended" && (
          <p className="text-center text-sm md:text-lg font-semibold text-red-600 w-[80%] md:w-[70%] mt-3 mx-auto font-mono">
            Registration has ended. Thank you for your interest.
          </p>
        )}
        {timeLeft && (
          <div className="flex flex-row gap-8 mt-4 z-10 mx-auto">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div key={unit} className="flex flex-col items-center">
                <span className="text-xl md:text-5xl font-bold text-gray-300">
                  {timeLeft[unit as keyof typeof timeLeft]}
                </span>
                <span className="text-sm text-neutral-400 uppercase">{unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Countdown Timer */}

      <Cobe />

      <Link
        href={status === "live" ? "/register" : '/'}
        onClick={(e) => {
          if (status !== "live") {
            e.preventDefault();
          }
        }}
        className={`px-9 py-3 text-lg font-bold rounded-full transition-transform duration-300 z-10 shadow-md ${status === "live"
            ? "bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-lg active:translate-y-1 active:border-blue-500"
            : "bg-gray-400 text-gray-200 border-gray-500 cursor-not-allowed"
          }`}
      >
        Register Now
      </Link>



    </div>
  );
}
