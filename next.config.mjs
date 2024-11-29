import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

export default function nextConfig(phase) {
  const isBuild = phase === PHASE_PRODUCTION_BUILD;

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    webpack: (config) => {
      if (isBuild) {
        config.externals.push("pino-pretty", "lokijs", "encoding");
      }

      config.module.rules.push(
        {
          test: /\.d\.ts$/,
          use: "ignore-loader",
        },
        {
          test: /\.d\.ts\.map$/,
          use: "ignore-loader",
        },
        {
          test: /\.js\.map$/,
          use: "ignore-loader",
        },
      );

      return config;
    },
  };

  return nextConfig;
}
