"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useConnection } from "@solana/wallet-adapter-react"
import { Navbar } from "@/components/landing/navbar"
import {
    CATALOG,
    CATEGORY_LABELS,
    type ClothingCategory,
    type CatalogItem,
} from "@/lib/catalog"
import { getBerryBalance, buildBerryTransferTx } from "@/lib/transfer-berry"
import { mintCompressedNFT } from "@/lib/mint-cnft"
import {
    Loader2,
    Wallet,
    Check,
    ShoppingBag,
    Coins,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StorePage() {
    const { connected, publicKey, sendTransaction } = useWallet()
    const { setVisible } = useWalletModal()
    const { connection } = useConnection()
    const [activeCategory, setActiveCategory] = useState<ClothingCategory | "all">("all")
    const [buyingId, setBuyingId] = useState<string | null>(null)
    const [boughtIds, setBoughtIds] = useState<Set<string>>(new Set())
    const [mintCounts, setMintCounts] = useState<Record<string, number>>({})
    const [berryBalance, setBerryBalance] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)

    // Fetch Berry balance
    useEffect(() => {
        if (connected && publicKey) {
            getBerryBalance(connection, publicKey)
                .then(setBerryBalance)
                .catch(() => setBerryBalance(0))
        } else {
            setBerryBalance(0)
        }
    }, [connected, publicKey, connection])

    // Fetch on-chain mint counts from DAS API
    useEffect(() => {
        fetch("/api/supply")
            .then((r) => r.json())
            .then(setMintCounts)
            .catch(() => { })
    }, [])

    const categories: (ClothingCategory | "all")[] = [
        "all",
        "eyes",
        "hair",
        "top",
        "bottom",
        "shoes",
    ]

    const filteredItems =
        activeCategory === "all"
            ? CATALOG
            : CATALOG.filter((item) => item.category === activeCategory)

    const getRemainingSupply = (item: CatalogItem) => {
        // DAS returns counts keyed by item name (on-chain metadata)
        return item.maxSupply - (mintCounts[item.name] || 0)
    }

    const handleBuy = useCallback(
        async (item: CatalogItem) => {
            if (!connected || !publicKey) {
                setVisible(true)
                return
            }

            if (berryBalance < item.priceBerry) {
                setError(`You need ${item.priceBerry} BRRY but only have ${berryBalance.toFixed(0)}. Get more BRRY tokens first!`)
                return
            }

            setBuyingId(item.id)
            setError(null)

            try {
                // Step 1: Transfer BRRY tokens to treasury
                const tx = await buildBerryTransferTx(connection, publicKey, item.priceBerry)
                const sig = await sendTransaction(tx, connection)
                await connection.confirmTransaction(sig, "confirmed")

                // Step 2: Mint the cNFT to buyer via server API
                const result = await mintCompressedNFT(publicKey.toBase58(), item)

                setBoughtIds((prev) => new Set(prev).add(item.id))
                // Update local count immediately (keyed by name to match DAS)
                setMintCounts((prev) => ({
                    ...prev,
                    [item.name]: (prev[item.name] || 0) + 1,
                }))

                // Refresh balance
                const newBalance = await getBerryBalance(connection, publicKey)
                setBerryBalance(newBalance)
            } catch (err: any) {
                console.error("Buy error:", err)
                if (err.message?.includes("insufficient")) {
                    setError("Insufficient BRRY balance for this purchase.")
                } else if (err.message?.includes("User rejected")) {
                    setError("Transaction was rejected.")
                } else {
                    setError(err.message || "Purchase failed. Please try again.")
                }
            } finally {
                setBuyingId(null)
            }
        },
        [connected, publicKey, connection, berryBalance, sendTransaction, setVisible]
    )

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm border border-border">
                            <ShoppingBag className="h-4 w-4" />
                            Berry Store
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Spend Your <span className="text-primary">Berries</span>
                        </h1>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Buy exclusive NFT clothing with BRRY tokens. Each item has limited supply!
                        </p>
                    </div>

                    {/* Berry balance card */}
                    <div className="mb-8 mx-auto max-w-sm">
                        <div className="flex items-center justify-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-berry-light/20 to-lavender/20 p-5 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Coins className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Your Balance
                                </p>
                                <p className="text-2xl font-extrabold text-foreground">
                                    {connected ? (
                                        <>
                                            {berryBalance.toLocaleString()}{" "}
                                            <span className="text-sm text-primary">BRRY</span>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setVisible(true)}
                                            className="text-primary text-base hover:underline"
                                        >
                                            Connect Wallet
                                        </button>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-6 mx-auto max-w-xl rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center flex items-center justify-center gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-2 font-bold hover:underline"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Category filter */}
                    <div className="mb-8 flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                                    }`}
                            >
                                {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>

                    {/* Store grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredItems.map((item) => {
                            const isBuying = buyingId === item.id
                            const isBought = boughtIds.has(item.id)
                            const canAfford = connected && berryBalance >= item.priceBerry
                            const remaining = getRemainingSupply(item)
                            const soldOut = remaining <= 0

                            return (
                                <div
                                    key={item.id}
                                    className={`group relative rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 ${soldOut
                                        ? "border-border/50 opacity-60"
                                        : "border-border hover:border-primary/30"
                                        }`}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square bg-gradient-to-br from-berry-light/10 via-background to-lavender/10 p-6">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                            draggable={false}
                                        />
                                        <div className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-primary border border-border">
                                            {CATEGORY_LABELS[item.category]}
                                        </div>
                                        {/* Supply badge */}
                                        <div className={`absolute top-3 right-3 rounded-full backdrop-blur-sm px-3 py-1 text-xs font-bold border ${soldOut
                                            ? "bg-destructive/10 text-destructive border-destructive/30"
                                            : remaining < 100
                                                ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                                : "bg-background/80 text-muted-foreground border-border"
                                            }`}>
                                            {soldOut ? "Sold Out" : `${remaining} left`}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="text-base font-extrabold text-foreground mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <Coins className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-bold text-foreground">
                                                    {item.priceBerry}{" "}
                                                    <span className="text-xs text-primary">BRRY</span>
                                                </span>
                                            </div>

                                            {isBought ? (
                                                <Button
                                                    size="sm"
                                                    className="rounded-full bg-green-500 text-white text-xs font-bold px-4"
                                                    disabled
                                                >
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Bought!
                                                </Button>
                                            ) : soldOut ? (
                                                <Button
                                                    size="sm"
                                                    className="rounded-full bg-muted text-muted-foreground text-xs font-bold px-4"
                                                    disabled
                                                >
                                                    Sold Out
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleBuy(item)}
                                                    disabled={isBuying || (connected && !canAfford)}
                                                    className={`rounded-full text-xs font-bold px-4 ${connected && !canAfford
                                                        ? "bg-muted text-muted-foreground"
                                                        : "bg-primary text-primary-foreground hover:bg-berry-dark"
                                                        }`}
                                                >
                                                    {isBuying ? (
                                                        <>
                                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                            Buying...
                                                        </>
                                                    ) : !connected ? (
                                                        <>
                                                            <Wallet className="h-3 w-3 mr-1" />
                                                            Connect
                                                        </>
                                                    ) : !canAfford ? (
                                                        "Need BRRY"
                                                    ) : (
                                                        <>
                                                            <ShoppingBag className="h-3 w-3 mr-1" />
                                                            Buy
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </>
    )
}
