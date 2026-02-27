"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Copy, Check, User, Edit2, Loader2 } from "lucide-react"
import { useState, useCallback } from "react"
import { useUser } from "./user-provider"
import { toast } from "sonner"

export function WalletButton() {
    const { publicKey, disconnect, connected } = useWallet()
    const { setVisible } = useWalletModal()
    const { profileId, username, setProfileId, setUsername, refreshProfile } = useUser()
    const [copied, setCopied] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [isEditingUsername, setIsEditingUsername] = useState(false)
    const [editUsernameVal, setEditUsernameVal] = useState("")
    const [isSavingUsername, setIsSavingUsername] = useState(false)

    const truncatedAddress = publicKey
        ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
        : ""

    const displayIdentifier = username || truncatedAddress

    const copyAddress = useCallback(async () => {
        if (publicKey) {
            await navigator.clipboard.writeText(publicKey.toBase58())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [publicKey])

    if (!connected) {
        return (
            <Button
                variant="ghost"
                className="text-sm font-semibold text-foreground gap-2"
                onClick={() => setVisible(true)}
            >
                <Wallet className="h-4 w-4" />
                Connect Wallet
            </Button>
        )
    }

    return (
        <div className="relative">
            <Button
                variant="outline"
                className="text-sm font-semibold gap-2 border-primary/30 text-foreground hover:bg-berry-light/20"
                onClick={() => setShowMenu(!showMenu)}
            >
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                {displayIdentifier}
            </Button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => {
                            setShowMenu(false)
                            setIsEditingUsername(false)
                        }}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-border bg-card p-2 shadow-lg flex flex-col gap-1">

                        {/* Profile Section */}
                        <div className="px-3 py-2 mb-1 border-b border-border">
                            {isEditingUsername ? (
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-muted-foreground font-semibold">Change Username</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editUsernameVal}
                                            onChange={(e) => setEditUsernameVal(e.target.value)}
                                            placeholder="Enter username"
                                            className="flex-1 bg-background border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            disabled={isSavingUsername}
                                        />
                                        <Button
                                            size="sm"
                                            onClick={async () => {
                                                if (!editUsernameVal.trim() || !profileId || !publicKey) return
                                                setIsSavingUsername(true)
                                                try {
                                                    const res = await fetch("/api/tapestry/profile", {
                                                        method: "PUT",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            profileId,
                                                            username: editUsernameVal,
                                                            walletAddress: publicKey.toBase58(),
                                                        })
                                                    })
                                                    const data = await res.json()
                                                    if (data.error) throw new Error(data.error)

                                                    // Set state directly from response — don't rely on refreshProfile
                                                    // which may return cached/stale data
                                                    const newId = data.id || data.profile?.id || profileId
                                                    const newUsername = data.username || data.profile?.username || editUsernameVal
                                                    console.log(`[WalletButton] Username update success: id=${newId}, username=${newUsername}`)
                                                    setProfileId(newId)
                                                    setUsername(newUsername)
                                                    setIsEditingUsername(false)
                                                    toast.success("Username updated!")
                                                } catch (err: any) {
                                                    toast.error("Failed to update username", { description: err.message })
                                                } finally {
                                                    setIsSavingUsername(false)
                                                }
                                            }}
                                            disabled={isSavingUsername || !editUsernameVal.trim()}
                                        >
                                            {isSavingUsername ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground font-semibold">Profile</span>
                                        <span className="text-sm font-bold text-foreground">
                                            {username || "No username"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditUsernameVal(username)
                                            setIsEditingUsername(true)
                                        }}
                                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                                        title="Edit username"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                copyAddress()
                                setShowMenu(false)
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-berry-light/20 transition-colors"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                            {copied ? "Copied!" : "Copy Address"}
                        </button>
                        <button
                            onClick={() => {
                                disconnect()
                                setShowMenu(false)
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Disconnect
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
