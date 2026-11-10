
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-navy">

      <div className="flex flex-col items-center animate-pulse">

        <Image
          src="/RKFoodLogo.png"
          alt="RK Frozen Food"
          width={180}
          height={180}
          priority
          className="h-36 w-36 object-contain sm:h-44 sm:w-44"
        />

        <h1 className="mt-4 text-3xl font-bold tracking-wider text-white">
          RK FROZEN FOOD
        </h1>

        <p className="mt-2 text-xs font-semibold tracking-[2px] text-white">
          STAY FRESH... STAY HEALTHY...
        </p>

      </div>

      {/* Loading Animation */}
      <div className="mt-10 h-1 w-32 overflow-hidden rounded-full bg-white/30">
        <div className="h-full w-full origin-left animate-pulse rounded-full bg-white" />
      </div>

    </div>
  );
};

export default SplashScreen;
