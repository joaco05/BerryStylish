"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

interface UserContextType {
    profileId: string | null
    username: string
    setProfileId: (id: string | null) => void
    setUsername: (name: string) => void
    refreshProfile: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const { publicKey, connected } = useWallet()
    const [profileId, setProfileId] = useState<string | null>(null)
    const [username, setUsername] = useState<string>("")

    // Load from localStorage on mount
    useEffect(() => {
        const savedId = localStorage.getItem("berry_profile_id")
        const savedName = localStorage.getItem("berry_username")
        if (savedId) setProfileId(savedId)
        if (savedName) setUsername(savedName)
    }, [])

    // Sync to localStorage
    useEffect(() => {
        if (profileId) localStorage.setItem("berry_profile_id", profileId)
        else localStorage.removeItem("berry_profile_id")
    }, [profileId])

    useEffect(() => {
        if (username) localStorage.setItem("berry_username", username)
        else localStorage.removeItem("berry_username")
    }, [username])

    const refreshProfile = async () => {
        if (connected && publicKey) {
            try {
                const res = await fetch("/api/tapestry/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        walletAddress: publicKey.toBase58(),
                        username: publicKey.toBase58().slice(0, 8),
                    }),
                })
                const data = await res.json()

                // Use the profile data but handle both possible return structures
                const profile = data.profile || (data.id ? data : null)
                if (profile) {
                    setProfileId(profile.id)
                    setUsername(profile.username || "")
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err)
            }
        } else if (connected === false) {
            // Only clear if explicitly disconnected
            setProfileId(null)
            setUsername("")
        }
    }

    useEffect(() => {
        if (connected) {
            refreshProfile()
        }
    }, [connected, publicKey])

    return (
        <UserContext.Provider value={{ profileId, username, setProfileId, setUsername, refreshProfile }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
