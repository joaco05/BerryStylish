import { NextRequest, NextResponse } from "next/server"
import { findOrCreateProfile, getProfileByWallet, getProfile, updateProfile } from "@/lib/tapestry"

export async function POST(req: NextRequest) {
    try {
        const { walletAddress, username } = await req.json()

        if (!walletAddress) {
            return NextResponse.json(
                { error: "walletAddress is required" },
                { status: 400 }
            )
        }

        // Search for existing profile by wallet
        const res = await getProfileByWallet(walletAddress)

        if (res && res.profiles && res.profiles.length > 0) {
            // getProfileByWallet returns profiles as { profile: {...}, wallet: {...}, namespace: {...} }
            // Sort by created_at descending to get the most recent profile (latest username)
            const sorted = res.profiles.sort((a: any, b: any) =>
                (b.profile?.created_at || 0) - (a.profile?.created_at || 0)
            )
            const mostRecent = sorted[0]
            const profileData = mostRecent.profile || mostRecent
            console.log(`[API Profile POST] Found existing profile: id=${profileData.id}, username=${profileData.username}`)
            return NextResponse.json(profileData)
        }

        // Doesn't exist, create it
        const result = await findOrCreateProfile(
            walletAddress,
            username || walletAddress.slice(0, 8)
        )

        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Tapestry profile error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to create profile" },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const walletAddress = searchParams.get("walletAddress")
        const profileId = searchParams.get("profileId")

        if (profileId) {
            const result = await getProfile(profileId)
            return NextResponse.json(result)
        }

        if (walletAddress) {
            const result = await getProfileByWallet(walletAddress)
            return NextResponse.json(result)
        }

        return NextResponse.json(
            { error: "walletAddress or profileId is required" },
            { status: 400 }
        )
    } catch (err: any) {
        console.error("Tapestry profile fetch error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to fetch profile" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { profileId, username, walletAddress } = await req.json()

        if (!username || !walletAddress) {
            return NextResponse.json(
                { error: "username and walletAddress are required" },
                { status: 400 }
            )
        }

        // IMPORTANT: We do NOT use updateProfile() here because:
        // 1. Tapestry's PUT changes the profile ID when username changes
        // 2. This breaks the wallet→profile linkage
        // Instead, we call findOrCreate with the new username.
        // This creates a new profile with the new username AND properly
        // links it to the wallet (because we include blockchain: SOLANA).
        // The old profile becomes orphaned, which is harmless.
        console.log(`[API Profile PUT] Changing username to "${username}" for wallet ${walletAddress}`)

        const result = await findOrCreateProfile(walletAddress, username)
        console.log("[API Profile PUT] findOrCreate result:", JSON.stringify(result))

        // Return the new profile
        const profile = result.profile || result
        return NextResponse.json({
            id: profile.id || username,
            username: profile.username || username,
            ...profile,
        })
    } catch (err: any) {
        console.error("[API Profile PUT] Error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to update profile" },
            { status: 500 }
        )
    }
}
