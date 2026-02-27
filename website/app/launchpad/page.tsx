"use client"

import { useState, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Navbar } from "@/components/landing/navbar"
import {
    CATEGORY_LABELS,
    type ClothingCategory,
} from "@/lib/catalog"
import {
    Rocket,
    Upload,
    Wallet,
    Loader2,
    Check,
    Sparkles,
    Percent,
    Hash,
    Type,
    FileText,
    Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LaunchpadPage() {
    const { connected, publicKey } = useWallet()
    const { setVisible } = useWalletModal()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState<ClothingCategory>("top")
    const [royalty, setRoyalty] = useState(5)
    const [maxSupply, setMaxSupply] = useState(500)
    const [priceBerry, setPriceBerry] = useState(100)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onload = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = useCallback(async () => {
        if (!connected || !publicKey) {
            setVisible(true)
            return
        }

        if (!name.trim() || !description.trim() || !imageFile) {
            setError("Please fill in all fields and upload an image.")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            // In production this would upload to Arweave/IPFS,
            // create metadata, and add to the on-chain collection.
            // For devnet demo, simulate a submission delay.
            await new Promise((r) => setTimeout(r, 2000))

            setSubmitted(true)
        } catch (err: any) {
            console.error("Launch error:", err)
            setError(err.message || "Failed to launch. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }, [connected, publicKey, name, description, imageFile, setVisible])

    const categories: ClothingCategory[] = ["eyes", "hair", "top", "bottom", "shoes"]

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm border border-border">
                            <Rocket className="h-4 w-4" />
                            NFT Launchpad
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Launch Your <span className="text-primary">Style</span>
                        </h1>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Design a wearable, set your royalties, and earn BRRY every time someone buys it in the store.
                        </p>
                    </div>

                    {submitted ? (
                        /* Success state */
                        <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-12 text-center">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                                <Check className="h-8 w-8 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-foreground mb-2">
                                Submitted for Review!
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Your NFT &ldquo;{name}&rdquo; has been submitted. Once approved, it will appear in the Berry Store
                                and you&apos;ll earn {royalty}% royalty on every sale.
                            </p>
                            <Button
                                onClick={() => {
                                    setSubmitted(false)
                                    setName("")
                                    setDescription("")
                                    setImageFile(null)
                                    setImagePreview(null)
                                }}
                                className="rounded-full bg-primary text-primary-foreground px-8 font-bold hover:bg-berry-dark"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Launch Another
                            </Button>
                        </div>
                    ) : (
                        /* Form */
                        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
                            {/* Error */}
                            {error && (
                                <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center">
                                    {error}
                                    <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
                                </div>
                            )}

                            <div className="grid gap-8 md:grid-cols-[1fr,280px]">
                                {/* Left: Form fields */}
                                <div className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Type className="h-4 w-4 text-primary" />
                                            Item Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Cosmic Knight Hoodie"
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            maxLength={32}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Description
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe your wearable..."
                                            rows={3}
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            maxLength={200}
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Palette className="h-4 w-4 text-primary" />
                                            Category
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setCategory(cat)}
                                                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${category === cat
                                                            ? "bg-primary text-primary-foreground shadow-md"
                                                            : "bg-background border border-border text-muted-foreground hover:border-primary/30"
                                                        }`}
                                                >
                                                    {CATEGORY_LABELS[cat]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Settings row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="mb-2 flex items-center gap-1 text-xs font-bold text-foreground">
                                                <Percent className="h-3 w-3 text-primary" />
                                                Royalty %
                                            </label>
                                            <input
                                                type="number"
                                                value={royalty}
                                                onChange={(e) => setRoyalty(Math.min(25, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                                min={0}
                                                max={25}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 flex items-center gap-1 text-xs font-bold text-foreground">
                                                <Hash className="h-3 w-3 text-primary" />
                                                Max Supply
                                            </label>
                                            <input
                                                type="number"
                                                value={maxSupply}
                                                onChange={(e) => setMaxSupply(Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)))}
                                                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                                min={1}
                                                max={10000}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 flex items-center gap-1 text-xs font-bold text-foreground">
                                                <Sparkles className="h-3 w-3 text-primary" />
                                                Price (BRRY)
                                            </label>
                                            <input
                                                type="number"
                                                value={priceBerry}
                                                onChange={(e) => setPriceBerry(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                                min={1}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Image upload */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                                        <Upload className="h-4 w-4 text-primary" />
                                        Wearable Art
                                    </label>
                                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background hover:border-primary/40 hover:bg-berry-light/5 transition-all overflow-hidden">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-contain p-4"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    Drop your SVG/PNG
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                    Transparent background recommended
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/svg+xml,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Summary + Submit */}
                            <div className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-8">
                                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                                    <span className="rounded-full bg-berry-light/20 px-3 py-1 font-bold text-primary">
                                        {CATEGORY_LABELS[category]}
                                    </span>
                                    <span>·</span>
                                    <span>{royalty}% royalty</span>
                                    <span>·</span>
                                    <span>{maxSupply.toLocaleString()} max supply</span>
                                    <span>·</span>
                                    <span>{priceBerry} BRRY per item</span>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="rounded-full bg-primary text-primary-foreground px-10 py-3 text-sm font-bold hover:bg-berry-dark shadow-lg shadow-primary/25"
                                    size="lg"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Launching...
                                        </>
                                    ) : !connected ? (
                                        <>
                                            <Wallet className="h-4 w-4 mr-2" />
                                            Connect Wallet
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="h-4 w-4 mr-2" />
                                            Launch NFT
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
