import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-center">
      Brought to you by{" "}
      <Link
        href="https://lottopgf.org"
        target="_blank"
        className="underline decoration-dotted hover:no-underline"
      >
        LottoPGF
      </Link>{" "}
      &lt;3
    </footer>
  );
}
