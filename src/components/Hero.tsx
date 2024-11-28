"use client";

import { METADATA } from "@/config";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import gsap from "gsap";

export default function Hero() {
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
  }, []);

  return (
    <div className="grid min-h-svh place-content-center">
      <div className="space-y-2 text-center">
        <h1
          className="scroll-m-20 overflow-hidden font-pixel text-6xl font-extrabold md:text-7xl lg:text-8xl"
          id="hero-text"
        >
          {METADATA.name}
        </h1>
        <div className="hero-description">{METADATA.longDescription}</div>
      </div>
    </div>
  );
}
