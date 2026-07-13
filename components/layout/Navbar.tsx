"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold text-xl text-white">Fluenta</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-[hsl(var(--foreground-muted))] hover:text-white">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-[hsl(var(--accent))] hover:bg-[#5558E3] text-white">
              Get started free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
