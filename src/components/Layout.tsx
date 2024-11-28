"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative mx-auto w-full max-w-[1200px] px-4">
        {children}
      </main>
    </>
  );
}
