import { Star } from "lucide-react"

const items = [
  "Dress Up",
  "Collect NFTs",
  "Make Friends",
  "Style Wars",
  "Trade Outfits",
  "Win Rewards",
  "Fashion Challenges",
  "Be Unique",
]

export function MarqueeBanner() {
  return (
    <div className="relative overflow-hidden bg-primary py-4" aria-hidden="true">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            <Star className="h-3.5 w-3.5 text-primary-foreground/60" fill="currentColor" />
            <span className="text-sm font-bold uppercase tracking-wider text-primary-foreground">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
