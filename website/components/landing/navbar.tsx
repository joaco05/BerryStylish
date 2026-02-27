"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BerryLogo } from "./berry-logo"
import { WalletButton } from "@/components/wallet-button"
import Link from "next/link"

const navLinks = [
  { label: "Game", href: "/#features" },
  { label: "NFTs", href: "/#nfts" },
  { label: "Social", href: "/social" },
  { label: "Launchpad", href: "/launchpad" },
  { label: "Editor", href: "/editor" },
  { label: "Store", href: "/store" },
  { label: "Faucet", href: "/faucet" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <BerryLogo className="h-8 w-8" />
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Berry<span className="text-primary">Stylish</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <WalletButton />
          <Link href="/editor">
            <Button className="rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-berry-dark">
              Play Now
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-base font-semibold text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <WalletButton />
            <Link href="/editor">
              <Button className="w-full rounded-full bg-primary font-bold text-primary-foreground">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
