"use client";

import ConnectButton from "@/components/ConnectButton";
import { METADATA } from "@/config";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function Header() {
  useGSAP(() => {
    gsap.from(".header", {
      y: "-200px",
      duration: 1,
      delay: 1.5,
      ease: "power4.out",
    });
  }, []);

  return (
    <header
      className="header fixed left-0 right-0 z-50 mx-auto mt-4 w-[90%] max-w-[600px] border-4 border-black bg-white"
      style={{ boxShadow: "8px 6px 0px #000" }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[48.875rem] items-center gap-2 px-4 leading-tight md:gap-4">
        <Link href="/" className="flex flex-1 items-center gap-2">
          {!!METADATA.logo && (
            <>
              <Image
                src={METADATA.logo}
                width={180}
                height={36}
                className="h-9 w-auto"
                priority
                alt={METADATA.name}
              />
              <h1 className="hidden font-pixel text-3xl uppercase text-background lg:block">
                Build
              </h1>
            </>
          )}
          {!!METADATA.title && (
            <h1 className="font-serif text-sm leading-tight md:text-2xl">
              {METADATA.title}
            </h1>
          )}
        </Link>

        <ConnectButton />
      </div>
    </header>
  );
}
