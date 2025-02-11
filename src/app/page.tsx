"use client";
import { useEffect, useState } from "react";
import MatrixRain from "@/components/MatrixRain";
import "./globals.css";
import { Cobe } from "@/components/eldoraui/cobeglobe";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [status, setStatus] = useState<"before" | "live" | "ended">("before");

  useEffect(() => {
    const startDate = new Date("Feb 13, 2025 17:00:00").getTime();
    const endDate = new Date("Feb 18, 2025 23:59:59").getTime();

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
    <div className="flex flex-col bg-zinc-900 max-h-screen h-[100dvh] items-center justify-center py-12">
      <MatrixRain />
      <div className="flex flex-col z-10">
        <h2 className="text-center text-4xl/snug md:text-5xl font-extrabold text-black dark:text-white font-SuperchargeHalftone">
          Introduction To Programming
        </h2>
        {status === "before" && (
          <p className="text-center text-sm md:text-lg font-normal text-neutral-700 dark:text-neutral-200 w-[80%] md:w-[70%] mt-2 mx-auto font-mono">
            Registration opens in:
          </p>
        )}
        {status === "live" && (
          <p className="text-center text-sm md:text-lg font-normal text-orange-400 w-[80%] md:w-[70%] mt-2 mx-auto font-mono">
            Registration is live! Register now before it ends.
          </p>
        )}
        {status === "ended" && (
          <p className="text-center text-sm md:text-lg font-normal text-red-600 w-[80%] md:w-[70%] mt-2 mx-auto font-mono">
            Registration has ended. Thank you for your interest.
          </p>
        )}
      </div>

      {/* Countdown Timer */}
      {timeLeft && (
        <div className="flex flex-row gap-8 mt-8 z-10">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div key={unit} className="flex flex-col items-center">
              <span className="text-6xl font-bold text-gray-300">
                {timeLeft[unit as keyof typeof timeLeft]}
              </span>
              <span className="text-sm text-neutral-400 uppercase">{unit}</span>
            </div>
          ))}
        </div>
      )}

      <Cobe />

      <button
        className={`px-8 py-4 mt-10 text-base font-bold rounded-lg transition-all duration-300 ${status === "live"
            ? "bg-gray-800 text-white hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 hover:scale-105 dark:bg-gray-100 dark:text-gray-800 dark:hover:from-green-300 dark:hover:to-blue-400"
            : "bg-gray-500 text-gray-300 cursor-not-allowed"
          } z-10 shadow-md`}
        disabled={status !== "live"}
      >
        Register Now →
      </button>
    </div>
  );
}
