import { NextRequest, NextResponse } from "next/server"
import { getContent } from "@/lib/tapestry"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(req.url)
        const requestingProfileId =
            searchParams.get("requestingProfileId") || undefined

        const result = await getContent(id, requestingProfileId)
        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Get outfit error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to fetch outfit" },
            { status: 500 }
        )
    }
}
