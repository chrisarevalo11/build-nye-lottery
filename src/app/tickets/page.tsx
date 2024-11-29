"use client";

import { Tickets } from "@/containers/Tickets";
import { motion } from "motion/react";

export default function TicketsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <section className="pt-[100px]">
        <Tickets />
      </section>
    </motion.div>
  );
}
