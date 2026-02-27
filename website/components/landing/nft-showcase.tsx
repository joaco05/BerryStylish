"use client"

import { Heart, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const nftItems = [
  {
    name: "Lavender Mist Hoodie",
    category: "Top",
    price: "150 BRRY",
    tag: "Fresh drop",
    bg: "bg-berry-light",
    image: "/sprites/hoodie-pastel-3.svg",
  },
  {
    name: "Aurora Borealis Hair",
    category: "Hair",
    price: "120 BRRY",
    tag: "Trending",
    bg: "bg-sky/30",
    image: "/sprites/hair-2-recol-3.svg",
  },
  {
    name: "Wisteria Skirt",
    category: "Bottom",
    price: "120 BRRY",
    tag: "Popular",
    bg: "bg-lavender/30",
    image: "/sprites/skirt-lilac-2.svg",
  },
  {
    name: "Sunflower Stompers",
    category: "Shoes",
    price: "100 BRRY",
    tag: "Hot",
    bg: "bg-cream",
    image: "/sprites/shoes-yellow-1.svg",
  },
]

function getCategoryColor(category: string) {
  switch (category) {
    case "Top":
      return "bg-primary/15 text-primary border-primary/30"
    case "Hair":
      return "bg-sky/20 text-accent-foreground border-sky/40"
    case "Bottom":
      return "bg-lavender/20 text-muted-foreground border-lavender/40"
    case "Shoes":
      return "bg-cream text-foreground border-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function NFTShowcase() {
  return (
    <section id="nfts" className="relative py-24 sm:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            NFT Collection
          </p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Trending in the Wardrobe
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Own unique digital fashion items. Trade, collect, and show off your
            rarest finds.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {nftItems.map((item) => (
            <div
              key={item.name}
              className="group relative overflow-hidden rounded-3xl border border-border bg-background transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {/* NFT visual */}
              <div
                className={`${item.bg} flex h-56 items-center justify-center p-6`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain transition-transform group-hover:scale-110"
                  draggable={false}
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`rounded-full text-xs font-bold ${getCategoryColor(item.category)}`}
                  >
                    {item.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3.5 w-3.5 text-primary" fill="currentColor" />
                    <span>{item.tag}</span>
                  </div>
                </div>

                <h3 className="mt-3 text-sm font-bold text-card-foreground">
                  {item.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-foreground">
                    {item.price}
                  </span>
                  <Link href="/store">
                    <Button
                      size="sm"
                      className="h-8 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-berry-dark"
                    >
                      Collect
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Marketplace CTA */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href="/launchpad">
            <Button
              variant="outline"
              className="rounded-full border-2 border-primary/30 px-8 font-bold text-foreground hover:bg-berry-light/20"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Launchpad
            </Button>
          </Link>
          <Link href="/store">
            <Button
              variant="outline"
              className="rounded-full border-2 border-sky/30 px-8 font-bold text-foreground hover:bg-sky/10"
            >
              <Star className="mr-2 h-4 w-4" />
              Berry Store
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
