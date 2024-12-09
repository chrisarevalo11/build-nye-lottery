import { SupportedChainCheck } from "@/components/SupportedChainCheck";
import { Toaster } from "@/components/ui/sonner";
import { METADATA } from "@/config";
import "@/globals.css";
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { wagmiConfig } from "@/lib/wagmi";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "@fontsource-variable/pixelify-sans";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

/* export const metadata: Metadata = {
  title: METADATA.name,
  description: METADATA.description,
  icons: METADATA.icon,
  metadataBase: new URL(METADATA.url),
}; */

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    (await headers()).get("cookie"),
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "overflow-x-hidden leading-7")}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <Providers initialState={initialState}>
          <Layout>{children}</Layout>
          <Toaster />
          <SupportedChainCheck />
        </Providers>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
