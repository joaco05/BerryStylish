"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { Navbar } from "@/components/landing/navbar"
import { CollectionCard } from "@/components/social/collection-card"
import type { ClothingCategory } from "@/lib/catalog"
import {
    Loader2,
    FolderOpen,
    Plus,
    X,
    ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CollectionContent {
    content: {
        id: string
        created_at: number
    } | null
    socialCounts: {
        likeCount: number
        commentCount: number
    }
    authorProfile: {
        id: string
        username: string
    }
}

function getContentProperty(content: any, key: string): string {
    if (!content) return ""
    if (content[key]) return String(content[key])
    if (content.properties) {
        const prop = content.properties.find?.((p: any) => p.key === key)
        return prop?.value ? String(prop.value) : ""
    }
    return ""
}

export default function CollectionsPage() {
    const router = useRouter()
    const { publicKey, connected } = useWallet()
    const [collections, setCollections] = useState<CollectionContent[]>([])
    const [loading, setLoading] = useState(true)
    const [profileId, setProfileId] = useState<string | null>(null)
    const [showCreate, setShowCreate] = useState(false)
    const [createName, setCreateName] = useState("")
    const [createDesc, setCreateDesc] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        if (connected && publicKey) {
            fetch("/api/tapestry/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walletAddress: publicKey.toBase58(),
                    username: publicKey.toBase58().slice(0, 8),
                }),
            })
                .then((r) => r.json())
                .then((data) => setProfileId(data.profile?.id || data.id || null))
                .catch(() => setProfileId(null))
        } else {
            setProfileId(null)
        }
    }, [connected, publicKey])

    const fetchCollections = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/tapestry/collections?pageSize=24")
            const data = await res.json()
            if (data.contents) {
                setCollections(data.contents)
            }
        } catch (err) {
            console.error("Failed to fetch collections:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCollections()
    }, [fetchCollections])

    const handleCreate = async () => {
        if (!profileId || !createName.trim()) return
        setIsCreating(true)
        try {
            const res = await fetch("/api/tapestry/collections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profileId,
                    name: createName,
                    description: createDesc,
                    outfitIds: [],
                }),
            })
            if (res.ok) {
                setShowCreate(false)
                setCreateName("")
                setCreateDesc("")
                fetchCollections()
            }
        } catch (err) {
            console.error("Failed to create collection:", err)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Back link */}
                    <Link
                        href="/social"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Feed
                    </Link>

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm border border-border">
                            <FolderOpen className="h-4 w-4" />
                            Collections
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Outfit{" "}
                            <span className="text-primary">Galleries</span>
                        </h1>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Browse and create curated collections of outfits. Share your
                            favorite looks with the community!
                        </p>
                    </div>

                    {/* Create button */}
                    {connected && profileId && (
                        <div className="mb-8 text-center">
                            <Button
                                onClick={() => setShowCreate(true)}
                                className="rounded-full bg-primary text-primary-foreground font-bold gap-2 hover:bg-berry-dark"
                            >
                                <Plus className="h-4 w-4" />
                                Create Collection
                            </Button>
                        </div>
                    )}

                    {/* Create dialog */}
                    {showCreate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowCreate(false)}
                            />
                            <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl border border-border bg-card shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-extrabold text-foreground">
                                        New Collection
                                    </h2>
                                    <button
                                        onClick={() => setShowCreate(false)}
                                        className="rounded-full p-1.5 hover:bg-muted"
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={createName}
                                            onChange={(e) => setCreateName(e.target.value)}
                                            placeholder="My Awesome Collection"
                                            maxLength={50}
                                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            value={createDesc}
                                            onChange={(e) => setCreateDesc(e.target.value)}
                                            placeholder="Describe your collection..."
                                            maxLength={200}
                                            rows={2}
                                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => setShowCreate(false)}
                                            variant="outline"
                                            className="flex-1 rounded-xl font-bold"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleCreate}
                                            disabled={isCreating || !createName.trim()}
                                            className="flex-1 rounded-xl bg-primary text-primary-foreground font-bold"
                                        >
                                            {isCreating ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                "Create"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Collections grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p className="text-sm text-muted-foreground font-semibold">
                                Loading collections...
                            </p>
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <FolderOpen className="h-16 w-16 text-muted-foreground/20 mb-4" />
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                No collections yet!
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Be the first to create a collection. Group your favorite outfits
                                together and share them with the community!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {collections.map((item) => (
                                <CollectionCard
                                    key={item.content?.id || Math.random()}
                                    contentId={item.content?.id || ""}
                                    name={
                                        getContentProperty(item.content, "title") ||
                                        "Untitled Collection"
                                    }
                                    description={getContentProperty(
                                        item.content,
                                        "description"
                                    )}
                                    outfitCount={
                                        parseInt(
                                            getContentProperty(item.content, "outfitCount") || "0"
                                        ) || 0
                                    }
                                    authorUsername={item.authorProfile?.username || "Unknown"}
                                    authorId={item.authorProfile?.id || ""}
                                    onClick={(id) => router.push(`/social/collections/${id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
