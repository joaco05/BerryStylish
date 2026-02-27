"use client"

import { Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-card">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-berry-light/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-sky/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Heart className="h-3.5 w-3.5" fill="currentColor" />
          Free to Play
        </div>

        <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Ready to get <span className="text-primary">Berry Stylish</span>?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Be among the first to create, collect, and connect.
          Sign up now and get an exclusive Starter NFT Pack at launch.
        </p>

        {/* Email signup */}
        <form
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-12 rounded-full border-2 border-border bg-background px-5 text-sm focus:border-primary"
            aria-label="Email address"
          />
          <Button
            type="submit"
            className="h-12 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-berry-dark"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Join Waitlist
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          No spam, ever. Unsubscribe anytime.
        </p>

        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {["SM", "CB", "PR", "LK", "DF"].map((initials) => (
              <div
                key={initials}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary/10 text-[10px] font-bold text-primary"
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            Join the waitlist
          </p>
        </div>
      </div>
    </section>
  )
}
