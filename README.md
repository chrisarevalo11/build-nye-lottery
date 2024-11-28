# Lootery frontend

This is the frontend for LottoPGF's Lootery protocol. It allows to run a basic lottery.

## Installation

```bash
$ pnpm install
```

## Configuration

1. Copy [.env.example](./.env.example) to `.env.local` (or set them in your deployment) and update the values.
2. Update [config.ts](./src/config.ts) with your values.
3. (Optional) Update [globals.css](./src/globals.css) with your theme.

## Development

This app is a regular nextjs app and will run on port `3000` by default.

```bash
$ pnpm dev
```

## Deployment

Currently this app only works on Vercel.

Make sure that `.env.local` and `config.ts` are configured correctly.
