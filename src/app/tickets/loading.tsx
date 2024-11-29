"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 grid place-content-center bg-black/30"
    >
      <h1 className="font-pixel text-3xl font-bold">Loading…</h1>
    </motion.div>
  );
}
