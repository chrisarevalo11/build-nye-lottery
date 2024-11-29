"use client";

import { METADATA } from "@/config";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import gsap from "gsap";
import { Button } from "./ui/button";
import PixelDiamond from "./icons/PixelDiamond";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  useGSAP(() => {
    const text = new SplitType("#hero-text");
    gsap.fromTo(
      text.chars,
      {
        y: "200%",
      },
      {
        y: 0,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.1,
      },
    );

    gsap.from(".hero-description", {
      opacity: 0,
      delay: 0.5,
      duration: 1,
      ease: "sine.in",
    });

    gsap.from(".date", {
      opacity: 0,
      delay: 2,
      duration: 0.5,
      ease: "sine.in",
    });

    gsap.from(".cta", {
      opacity: 0,
      delay: 2.5,
      duration: 0.5,
      ease: "sine.in",
    });
  }, []);

  return (
    <div className="grid min-h-svh place-content-center">
      <div className="space-y-2 text-center">
        <div className="relative mx-auto w-fit">
          <span className="date absolute right-[-30px] top-[-50px] ml-2 rotate-[10deg] border border-gray-300 p-1 font-pixel text-sm text-gray-300 opacity-75 md:right-[-50px] md:top-[-40px]">
            Starting on <br /> December 25th
          </span>
          <h1
            className="relative mx-auto w-fit scroll-m-20 overflow-hidden font-pixel text-6xl font-extrabold md:text-7xl lg:text-8xl"
            id="hero-text"
          >
            {METADATA.name}
          </h1>
        </div>

        <p className="hero-description opacity-90">
          {METADATA.longDescription}
        </p>

        <div className="cta flex items-center justify-center gap-5 pt-5">
          <button className="font-pixel hover:underline">Read more</button>
          <Button
            variant={"white"}
            className="font-pixel text-2xl"
            onClick={() => router.push("/tickets")}
          >
            <PixelDiamond className="size-4" />
            <span>Play</span>
            <PixelDiamond className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
