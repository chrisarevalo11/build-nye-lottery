"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
    </motion.div>
  );
}
