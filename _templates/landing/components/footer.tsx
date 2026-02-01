import { Film } from "lucide-react";
import Link from "next/link";
import { Shield } from "lucide-react"; // Declare the Shield variable

export function Footer() {
  return (
    <footer className="w-full bg-zinc-900 border-t border-zinc-700/30">
      {/* Disclaimer */}
      <div className="w-full bg-zinc-950 px-6 py-4 text-center border-b border-zinc-700/30">
        <p className="text-xs text-zinc-500 max-w-4xl mx-auto">
          SceneGuard provides early-stage planning insights and does not replace professional budgeting or scheduling.
        </p>
      </div>
      
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-6 w-6 text-amber-500" />
          <span className="text-lg font-medium text-white">SceneGuard</span>
        </Link>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="LinkedIn"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="X (formerly Twitter)"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Terms Of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
