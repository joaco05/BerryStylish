"use client"

import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const posts = [
  {
    user: "MochiiKat",
    avatar: "MK",
    time: "35m ago",
    text: "Finally pulled the Celestial Ribbon Cape from the gacha drop!! Only 200 were minted. Who else got one?",
    bg: "bg-berry-light",
    emoji: "🎀",
  },
  {
    user: "NoriNoriPan",
    avatar: "NP",
    time: "3h ago",
    text: "Offering my Holographic Beret + 0.4 ETH for the Strawberry Blossom Dress. Serious offers only, DM open.",
    bg: "bg-sky/30",
    emoji: "🍓",
  },
  {
    user: "ZephyrMint",
    avatar: "ZM",
    time: "7h ago",
    text: "This week's Pastel Royale theme is SO cute. Here's my entry - going for a dreamy cloud aesthetic. Wish me luck!",
    bg: "bg-lavender/30",
    emoji: "☁️",
  },
]

export function CommunitySection() {
  return (
    <section id="community" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Community
          </p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Your Fashion Feed
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Share your looks, discover trends, and connect with players who
            share your style.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.user}
              className="rounded-3xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
            >
              {/* Post header */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {post.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-card-foreground">
                    {post.user}
                  </p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>

              {/* Post avatar preview */}
              <div
                className={`${post.bg} mt-4 flex h-44 items-center justify-center rounded-2xl`}
              >
                <span
                  className="text-6xl select-none"
                  role="img"
                  aria-label={`${post.user}'s avatar`}
                >
                  {post.emoji}
                </span>
              </div>

              {/* Post text */}
              <p className="mt-4 text-sm leading-relaxed text-card-foreground">
                {post.text}
              </p>

              {/* Post actions */}
              <div className="mt-4 flex items-center gap-6 border-t border-border pt-4">
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                  aria-label={`Like post by ${post.user}`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Like</span>
                </button>
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-sky"
                  aria-label={`Comment on post by ${post.user}`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Comment</span>
                </button>
                <button
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Share post by ${post.user}`}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
