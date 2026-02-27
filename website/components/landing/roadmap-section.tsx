import { Check, Clock, Lock } from "lucide-react"

const milestones = [
  {
    quarter: "Q1 2026",
    title: "Season 1 Launch",
    items: [
      "Avatar creation engine",
      "Starter wardrobe (500+ items)",
      "Social feed & profiles",
      "Daily fashion challenges",
    ],
    status: "done" as const,
  },
  {
    quarter: "Q2 2026",
    title: "NFT Marketplace",
    items: [
      "Mint & trade outfit NFTs",
      "Designer Studio beta",
      "Rarity tiers & leaderboards",
      "Community voting system",
    ],
    status: "current" as const,
  },
  {
    quarter: "Q3 2026",
    title: "Social Expansion",
    items: [
      "Real-time chat & DMs",
      "Fashion guilds & crews",
      "Collaborative outfit design",
      "Brand partnerships",
    ],
    status: "upcoming" as const,
  },
  {
    quarter: "Q4 2026",
    title: "Metaverse Ready",
    items: [
      "3D avatar upgrades",
      "Virtual fashion shows",
      "Cross-platform play",
      "Global style tournaments",
    ],
    status: "upcoming" as const,
  },
]

function StatusIcon({ status }: { status: "done" | "current" | "upcoming" }) {
  if (status === "done")
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-4 w-4" />
      </div>
    )
  if (status === "current")
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky text-accent-foreground animate-pulse">
        <Clock className="h-4 w-4" />
      </div>
    )
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Lock className="h-4 w-4" />
    </div>
  )
}

export function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Roadmap
          </p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {"What's coming next"}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Follow our journey as we build the ultimate fashion gaming
            experience.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <div
              key={m.quarter}
              className={`rounded-3xl border p-6 transition-all hover:shadow-lg ${
                m.status === "current"
                  ? "border-primary/40 bg-card shadow-md"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon status={m.status} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {m.quarter}
                  </p>
                  <h3 className="text-base font-bold text-card-foreground">
                    {m.title}
                  </h3>
                </div>
              </div>

              <ul className="mt-5 flex flex-col gap-2.5">
                {m.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
