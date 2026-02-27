import { NextRequest, NextResponse } from "next/server"
import { getContents } from "@/lib/tapestry"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const pageSize = parseInt(searchParams.get("pageSize") || "12")
        const requestingProfileId =
            searchParams.get("requestingProfileId") || undefined

        const result = await getContents({
            page,
            pageSize,
            orderBy: "created_at",
            orderDirection: "desc",
            requestingProfileId,
        })

        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Feed error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to fetch feed" },
            { status: 500 }
        )
    }
}
