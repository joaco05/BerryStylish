import { NextRequest, NextResponse } from "next/server"
import { followProfile, unfollowProfile } from "@/lib/tapestry"

export async function POST(req: NextRequest) {
    try {
        const { startId, endId } = await req.json()

        if (!startId || !endId) {
            return NextResponse.json(
                { error: "startId and endId are required" },
                { status: 400 }
            )
        }

        const result = await followProfile(startId, endId)
        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Follow error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to follow" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { startId, endId } = await req.json()

        if (!startId || !endId) {
            return NextResponse.json(
                { error: "startId and endId are required" },
                { status: 400 }
            )
        }

        const result = await unfollowProfile(startId, endId)
        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Unfollow error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to unfollow" },
            { status: 500 }
        )
    }
}
