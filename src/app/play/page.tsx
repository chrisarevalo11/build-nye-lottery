"use client";

import { Lottery } from "@/containers/Lottery";
import { motion } from "motion/react";

export default function LotteryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <section className="pt-[100px]">
        <Lottery />
      </section>
    </motion.div>
  );
}
