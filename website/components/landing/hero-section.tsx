"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute top-28 left-[10%]">
          <Heart className="h-6 w-6 text-primary/30" fill="currentColor" />
        </div>
        <div className="animate-float-delayed absolute top-40 right-[15%]">
          <Star className="h-5 w-5 text-sky/40" fill="currentColor" />
        </div>
        <div className="animate-float-slow absolute bottom-32 left-[20%]">
          <Sparkles className="h-7 w-7 text-lavender/40" />
        </div>
        <div className="animate-float absolute bottom-40 right-[12%]">
          <Heart className="h-4 w-4 text-primary/20" fill="currentColor" />
        </div>
        <div className="animate-float-delayed absolute top-60 left-[5%]">
          <Star className="h-4 w-4 text-cream" fill="currentColor" />
        </div>
        <div className="animate-float-slow absolute top-36 right-[8%]">
          <Heart className="h-8 w-8 text-berry-light/50" fill="currentColor" />
        </div>

        {/* Soft background shapes */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-berry-light/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-sky/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-lavender/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm border border-border">
          <Sparkles className="h-4 w-4" />
          <span>Season 1 Now Live</span>
        </div>

        <h1 className="text-balance text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-8xl">
          Dress Up.{" "}
          <span className="text-primary">Stand Out.</span>
          <br />
          <span className="text-sky">Connect.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Create your dream avatar, collect exclusive NFT outfits, and join a
          vibrant community of fashion lovers in the cutest social dress-up game.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="animate-pulse-glow rounded-full bg-primary px-10 py-6 text-base font-bold text-primary-foreground hover:bg-berry-dark"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start Playing Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-primary/30 px-10 py-6 text-base font-bold text-foreground hover:bg-berry-light/20 hover:border-primary/50"
          >
            Explore NFTs
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: "🎨", label: "Endless Customization" },
            { icon: "🖼️", label: "NFT Collectibles" },
            { icon: "💬", label: "Social Networking" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 rounded-full bg-card border border-border px-5 py-3 shadow-sm">
              <span className="text-lg select-none" aria-hidden="true">{item.icon}</span>
              <p className="text-sm font-bold text-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Avatar preview cards */}
        <div className="mt-16 flex items-center justify-center gap-4">
          {[
            { bg: "bg-berry-light", size: "h-20 w-20 sm:h-24 sm:w-24", src: "/sprites/hoodie-pastel-1.svg", label: "Berry Breeze Hoodie" },
            { bg: "bg-sky/30", size: "h-24 w-24 sm:h-32 sm:w-32", src: "/sprites/hair-1-recol-1.svg", label: "Cotton Candy Curls" },
            { bg: "bg-lavender/30", size: "h-28 w-28 sm:h-36 sm:w-36", src: "/sprites/body-base.svg", label: "Berry Character" },
            { bg: "bg-sky/30", size: "h-24 w-24 sm:h-32 sm:w-32", src: "/sprites/skirt-blue-2.svg", label: "Azure Skirt" },
            { bg: "bg-berry-light", size: "h-20 w-20 sm:h-24 sm:w-24", src: "/sprites/shoes-pink-1.svg", label: "Bubblegum Boots" },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} ${card.size} flex items-center justify-center rounded-3xl border-2 border-card shadow-lg overflow-hidden p-2`}
              role="img"
              aria-label={card.label}
            >
              <img
                src={card.src}
                alt={card.label}
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
