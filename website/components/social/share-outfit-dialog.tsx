"use client"

import { useState } from "react"
import { Share2, X, Loader2, Sparkles } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import type { ClothingCategory } from "@/lib/catalog"
import { OutfitPreview } from "./outfit-preview"
import { Button } from "@/components/ui/button"

interface ShareOutfitDialogProps {
    open: boolean
    onClose: () => void
    equippedItems: Partial<Record<ClothingCategory, string>>
    onShared?: () => void
}

export function ShareOutfitDialog({
    open,
    onClose,
    equippedItems,
    onShared,
}: ShareOutfitDialogProps) {
    const { connected, publicKey } = useWallet()
    const { setVisible } = useWalletModal()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isSharing, setIsSharing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    if (!open) return null

    const handleShare = async () => {
        if (!connected || !publicKey) {
            setVisible(true)
            return
        }

        setIsSharing(true)
        setError(null)

        try {
            // Step 1: Ensure profile exists
            const profileRes = await fetch("/api/tapestry/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walletAddress: publicKey.toBase58(),
                    username: publicKey.toBase58().slice(0, 8),
                }),
            })
            const profileData = await profileRes.json()
            if (!profileRes.ok) throw new Error(profileData.error)

            const profileId = profileData.profile?.id || profileData.id

            // Step 2: Create outfit content
            const outfitRes = await fetch("/api/tapestry/outfits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profileId,
                    title: title || "My Outfit",
                    description,
                    equippedItems,
                    walletAddress: publicKey.toBase58(),
                }),
            })
            const outfitData = await outfitRes.json()
            if (!outfitRes.ok) throw new Error(outfitData.error)

            setSuccess(true)
            onShared?.()
            setTimeout(() => {
                onClose()
                setSuccess(false)
                setTitle("")
                setDescription("")
            }, 1500)
        } catch (err: any) {
            setError(err.message || "Failed to share outfit")
        } finally {
            setIsSharing(false)
        }
    }

    const equippedCount = Object.keys(equippedItems).length

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-extrabold text-foreground">
                            Share Outfit
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 hover:bg-muted transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Preview */}
                    <div className="flex justify-center rounded-2xl bg-gradient-to-br from-berry-light/10 via-background to-lavender/10 p-6 border border-border">
                        <OutfitPreview equippedItems={equippedItems} size="lg" />
                    </div>

                    {equippedCount === 0 && (
                        <div className="text-center text-sm text-amber-500 font-semibold">
                            ⚠️ No items equipped — equip some items first!
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your outfit a name..."
                            maxLength={50}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell others about your look..."
                            maxLength={200}
                            rows={2}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-xs text-destructive font-semibold text-center">
                            {error}
                        </p>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="flex items-center justify-center gap-2 text-sm text-green-500 font-bold">
                            <Sparkles className="h-4 w-4" />
                            Outfit shared successfully!
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 rounded-xl font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleShare}
                            disabled={isSharing || equippedCount === 0 || success}
                            className="flex-1 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-berry-dark"
                        >
                            {isSharing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sharing...
                                </>
                            ) : !connected ? (
                                "Connect Wallet"
                            ) : (
                                <>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
