import { NextRequest, NextResponse } from "next/server"
import { getContent, updateContent } from "@/lib/tapestry"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { outfitId } = await req.json()

        if (!outfitId) {
            return NextResponse.json({ error: "outfitId is required" }, { status: 400 })
        }

        // 1. Get current collection
        const collection = await getContent(id)
        if (!collection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 })
        }

        // 2. Parse outfitIds
        const prop = collection.content?.properties?.find?.((p: any) => p.key === "outfitIds")
        let outfitIds: string[] = []
        try {
            outfitIds = prop?.value ? JSON.parse(String(prop.value)) : []
        } catch (e) {
            outfitIds = []
        }

        // 3. Check if already exists
        if (outfitIds.includes(outfitId)) {
            return NextResponse.json({ message: "Already in collection", count: outfitIds.length })
        }

        // 4. Update
        const newOutfitIds = [...outfitIds, outfitId]
        const properties = [
            { key: "outfitIds", value: JSON.stringify(newOutfitIds) },
            { key: "outfitCount", value: newOutfitIds.length },
        ]

        await updateContent(id, properties)

        return NextResponse.json({ success: true, count: newOutfitIds.length })
    } catch (err: any) {
        console.error("Add to collection error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to add to collection" },
            { status: 500 }
        )
    }
}
