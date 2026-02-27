import { NextRequest, NextResponse } from "next/server"
import { createComment, getComments } from "@/lib/tapestry"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { profileId, text } = await req.json()

        if (!profileId || !text) {
            return NextResponse.json(
                { error: "profileId and text are required" },
                { status: 400 }
            )
        }

        const result = await createComment(id, profileId, text)
        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Comment error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to add comment" },
            { status: 500 }
        )
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const pageSize = parseInt(searchParams.get("pageSize") || "20")
        const requestingProfileId =
            searchParams.get("requestingProfileId") || undefined

        const result = await getComments(id, page, pageSize, requestingProfileId)
        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Get comments error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to fetch comments" },
            { status: 500 }
        )
    }
}
