import { NextRequest, NextResponse } from "next/server"
import { createContent, getContents } from "@/lib/tapestry"

export async function POST(req: NextRequest) {
    try {
        const { profileId, name, description, outfitIds } = await req.json()

        if (!profileId || !name) {
            return NextResponse.json(
                { error: "profileId and name are required" },
                { status: 400 }
            )
        }

        const ids = Array.isArray(outfitIds) ? outfitIds : []

        const contentId = `collection-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

        const properties = [
            { key: "title", value: name },
            { key: "description", value: description || "" },
            { key: "outfitType", value: "collection" },
            { key: "outfitIds", value: JSON.stringify(ids) },
            { key: "outfitCount", value: ids.length },
            { key: "createdAt", value: Date.now() },
        ]

        const result = await createContent(contentId, profileId, properties)
        return NextResponse.json({ ...result, contentId })
    } catch (err: any) {
        console.error("Create collection error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to create collection" },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const profileId = searchParams.get("profileId") || undefined
        const page = parseInt(searchParams.get("page") || "1")
        const pageSize = parseInt(searchParams.get("pageSize") || "12")
        const requestingProfileId =
            searchParams.get("requestingProfileId") || undefined

        const result = await getContents({
            profileId,
            page,
            pageSize,
            orderBy: "created_at",
            orderDirection: "desc",
            requestingProfileId,
            filterByProperties: [{ key: "outfitType", value: "collection" }],
        })

        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Get collections error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to fetch collections" },
            { status: 500 }
        )
    }
}
