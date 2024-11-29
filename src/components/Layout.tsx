"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import JustBuildIt from "./icons/JustBuildIt";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <>
      {path !== "/" ? <Header /> : null}
      <main className="relative mx-auto w-full max-w-[1200px] px-4">
        <JustBuildIt className="fixed left-0 right-0 top-0 z-[-1] mx-auto h-svh scale-[1.9] object-cover opacity-20" />

        {children}
      </main>
    </>
  );
}
