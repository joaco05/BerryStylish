import { BerryLogo } from "./berry-logo"

const footerLinks = [
  {
    title: "Game",
    links: [
      { label: "Play Now", href: "#" },
      { label: "Features", href: "#features" },
      { label: "NFT Marketplace", href: "#nfts" },
      { label: "Challenges", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Social Feed", href: "#community" },
      { label: "Discord", href: "#" },
      { label: "Twitter / X", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Bug Report", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "NFT Terms", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <BerryLogo className="h-8 w-8" />
              <span className="text-lg font-extrabold text-foreground">
                Berry<span className="text-primary">Stylish</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The cutest NFT dress-up game and social network. Create, collect,
              and connect.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-bold text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 BerryStylish. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              aria-label="Discord"
            >
              Discord
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              aria-label="Twitter"
            >
              Twitter / X
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
