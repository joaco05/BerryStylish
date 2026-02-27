"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Navbar } from "@/components/landing/navbar"
import { Droplets, Wallet, Coins, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FaucetPage() {
    const { connected, publicKey } = useWallet()
    const { setVisible } = useWalletModal()
    const [isLoading, setIsLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleAirdrop = async () => {
        if (!connected || !publicKey) {
            setVisible(true)
            return
        }

        setIsLoading(true)
        setErrorMsg(null)
        setSuccessMsg(null)

        try {
            const res = await fetch("/api/faucet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walletAddress: publicKey.toBase58(),
                    type: "brry",
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Airdrop failed. Please try again.")
            }

            setSuccessMsg(`Successfully minted ${data.amount} ${data.currency} to your wallet!`)
        } catch (err: any) {
            setErrorMsg(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12 flex flex-col items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm border border-border">
                            <Droplets className="h-4 w-4" />
                            Berry Faucet
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Claim Your <span className="text-primary">Berries</span>
                        </h1>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Need resources to play BerryStylish on Devnet? Grab free BRRY tokens to buy fresh outfits in the Store!
                        </p>
                    </div>

                    {/* Faucet Card */}
                    <div className="mx-auto max-w-md">
                        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl shadow-primary/5 transition-all hover:border-primary/30">
                            <div className="aspect-video bg-gradient-to-br from-berry-light/10 via-background to-lavender/10 p-8 flex flex-col items-center justify-center border-b border-border/50">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4 shadow-[0_0_30px_rgba(236,72,153,0.15)] border border-primary/20">
                                    <Coins className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-foreground mb-1">1,000 BRRY</h2>
                                <p className="text-sm text-primary font-bold tracking-widest uppercase">Devnet Tokens</p>
                            </div>

                            <div className="p-6 sm:p-8 space-y-6">
                                <p className="text-sm text-center text-muted-foreground font-medium">
                                    Connect your Solana wallet to instantly receive 1,000 BRRY tokens directly to your Devnet account.
                                </p>

                                {errorMsg && (
                                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center flex items-center justify-center gap-2">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span className="font-semibold">{errorMsg}</span>
                                    </div>
                                )}

                                {successMsg ? (
                                    <div className="flex items-center justify-center gap-2 text-green-500 font-bold bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-sm text-center">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                        <span>{successMsg}</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={connected ? handleAirdrop : () => setVisible(true)}
                                        disabled={isLoading}
                                        className="w-full h-14 rounded-2xl text-base font-bold transition-all shadow-md bg-primary text-primary-foreground hover:bg-berry-dark hover:shadow-lg hover:shadow-primary/20"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Minting to your wallet...
                                            </>
                                        ) : !connected ? (
                                            <>
                                                <Wallet className="h-5 w-5 mr-2" />
                                                Connect Wallet to Claim
                                            </>
                                        ) : (
                                            <>
                                                <Droplets className="h-5 w-5 mr-2" />
                                                Airdrop 1,000 BRRY
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
