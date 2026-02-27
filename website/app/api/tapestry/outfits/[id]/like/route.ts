import { NextRequest, NextResponse } from "next/server"
import { likeContent, unlikeContent } from "@/lib/tapestry"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { profileId } = await req.json()

        if (!profileId) {
            return NextResponse.json(
                { error: "profileId is required" },
                { status: 400 }
            )
        }

        const result = await likeContent(profileId, id)
        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Like error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to like" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { profileId } = await req.json()

        if (!profileId) {
            return NextResponse.json(
                { error: "profileId is required" },
                { status: 400 }
            )
        }

        const result = await unlikeContent(profileId, id)
        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Unlike error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to unlike" },
            { status: 500 }
        )
    }
}
