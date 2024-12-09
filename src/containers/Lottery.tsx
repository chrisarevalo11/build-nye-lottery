"use client";

import { TicketPurchase } from "@/components/TicketPurchase";
import { ErrorBoundary } from "react-error-boundary";

export function Lottery() {
  return (
    <div>
      <header className="my-10 text-center font-pixel">
        <h1 className="whitespace-nowrap text-4xl md:text-7xl">
          Build NYE Lottery
        </h1>
        <h2 className="text-2xl md:text-4xl">Day 1</h2>
      </header>
      <ErrorBoundary fallback={<p>Error fetching tickets…</p>}>
        <TicketPurchase onPurchase={() => {}} />
      </ErrorBoundary>
    </div>
  );
}
