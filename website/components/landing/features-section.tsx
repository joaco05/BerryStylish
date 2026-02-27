import { Palette, Users, ShoppingBag, Sparkles, Heart, Shirt } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Infinite Customization",
    description:
      "Mix and match thousands of hairstyles, outfits, accessories, and backgrounds to create your unique look.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ShoppingBag,
    title: "NFT Wardrobe",
    description:
      "Own your fashion. Every outfit is a unique NFT you can collect, trade, or show off to the community.",
    color: "bg-sky/20 text-accent-foreground",
  },
  {
    icon: Users,
    title: "Social Hub",
    description:
      "Follow friends, share outfits, join fashion challenges, and chat in real-time with stylish players worldwide.",
    color: "bg-lavender/20 text-muted-foreground",
  },
  {
    icon: Sparkles,
    title: "Daily Challenges",
    description:
      "Compete in themed styling challenges every day. Win exclusive items and climb the fashion leaderboard.",
    color: "bg-cream text-secondary-foreground",
  },
  {
    icon: Heart,
    title: "Like & Vote",
    description:
      "Browse the community gallery, heart your favorite looks, and vote in weekly Best Dressed competitions.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shirt,
    title: "Designer Studio",
    description:
      "Create your own clothing items and accessories. Sell them as NFTs in the marketplace and earn royalties.",
    color: "bg-sky/20 text-accent-foreground",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Everything you need to slay
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            From dress-up to social networking, BerryStylish is your all-in-one
            fashion playground.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
