  import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

  export default function nextConfig(phase) {
    const isBuild = phase === PHASE_PRODUCTION_BUILD;

    /** @type {import('next').NextConfig} */
    const nextConfig = {
      experimental: {
            
      },
      reactStrictMode: true, 
    };
  
    if (isBuild) {
      nextConfig.compiler = {
        removeConsole: true, 
      };
    }

    return nextConfig;
  }
