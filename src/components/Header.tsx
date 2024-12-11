"use client";

import { METADATA } from "@/config";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";

export default function Header() {
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();

  console.log(primaryWallet);

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      className="fixed left-0 right-0 z-50 mx-auto mt-4 w-[90%] max-w-[600px] border-4 border-black bg-white"
      style={{ boxShadow: "8px 6px 0px #000" }}
    >
      <div className="mx-auto flex items-center justify-between gap-2 p-2 leading-tight md:gap-4">
        <Link href="/" className="flex items-center gap-2">
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

        <DynamicWidget />
      </div>
    </motion.div>
  );
}
