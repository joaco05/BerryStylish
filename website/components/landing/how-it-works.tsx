import { UserPlus, Palette, Trophy, Users } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Avatar",
    description:
      "Sign up and design your character. Choose your base, face shape, skin tone, and starter outfit.",
    color: "text-primary bg-primary/10",
  },
  {
    step: "02",
    icon: Palette,
    title: "Style & Customize",
    description:
      "Browse thousands of items. Mix hairstyles, clothes, accessories, and backgrounds for your perfect look.",
    color: "text-accent-foreground bg-sky/20",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Compete & Earn",
    description:
      "Enter daily challenges, win exclusive NFT rewards, and climb the fashion leaderboard to unlock rare items.",
    color: "text-muted-foreground bg-lavender/20",
  },
  {
    step: "04",
    icon: Users,
    title: "Connect & Share",
    description:
      "Follow friends, share your outfits, trade NFTs, and join the most stylish social network around.",
    color: "text-secondary-foreground bg-cream",
  },
]

export function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Four steps to fabulous
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="relative flex flex-col items-center rounded-3xl border border-border bg-background p-8 text-center transition-all hover:shadow-lg hover:border-primary/20"
            >
              {/* Step number badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex h-7 items-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground">
                  Step {s.step}
                </span>
              </div>

              <div
                className={`mt-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${s.color}`}
              >
                <s.icon className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>

              {/* Arrow connector (desktop only, not on last item) */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block z-10">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-primary" aria-hidden="true">
                      <path d="M1 5h7M6 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
