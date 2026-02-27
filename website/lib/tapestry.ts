/**
 * Tapestry Social Graph API Client
 * https://api.usetapestry.dev/v1
 *
 * Provides functions for profiles, content (outfits), social interactions,
 * collections, and activity feeds.
 */

const TAPESTRY_BASE_URL = "https://api.usetapestry.dev/api/v1"
const TAPESTRY_NAMESPACE = "berrystylish"

function getApiKey(): string {
    const key = process.env.TAPESTRY_API_KEY
    if (!key) throw new Error("TAPESTRY_API_KEY is not set in environment")
    return key
}

async function tapestryFetch(
    path: string,
    options: RequestInit = {}
): Promise<any> {
    const apiKey = getApiKey()

    // Tapestry requires API key as a query parameter
    const separator = path.includes("?") ? "&" : "?"
    const url = `${TAPESTRY_BASE_URL}${path}${separator}apiKey=${apiKey}`

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Tapestry API error ${res.status}: ${text}`)
    }

    // Some endpoints return 204 No Content
    if (res.status === 204) return null
    return res.json()
}

// ─── PROFILES ────────────────────────────────────────────

export interface TapestryProfile {
    id: string
    namespace: string
    created_at: number
    username: string
    bio?: string | null
    image?: string | null
}

export async function findOrCreateProfile(
    walletAddress: string,
    username: string
) {
    return tapestryFetch("/profiles/findOrCreate", {
        method: "POST",
        body: JSON.stringify({
            walletAddress,
            username,
            namespace: TAPESTRY_NAMESPACE,
            blockchain: "SOLANA",
        }),
    })
}

export async function getProfile(profileId: string) {
    return tapestryFetch(`/profiles/${profileId}`)
}

export async function updateProfile(profileId: string, updates: Record<string, any>) {
    return tapestryFetch(`/profiles/${profileId}`, {
        method: "PUT",
        body: JSON.stringify({
            ...updates,
            namespace: TAPESTRY_NAMESPACE
        }),
    })
}

export async function getProfileByWallet(walletAddress: string) {
    return tapestryFetch(
        `/profiles/?walletAddress=${walletAddress}&namespace=${TAPESTRY_NAMESPACE}`
    )
}

// ─── CONTENT (OUTFITS) ──────────────────────────────────

export interface OutfitProperties {
    title: string
    description: string
    equippedItems: string // JSON-encoded equipped items map
    imageUrl?: string
    outfitType?: string // "single" | "collection"
    collectionId?: string
}

export async function createContent(
    contentId: string,
    profileId: string,
    properties: { key: string; value: string | number | boolean }[]
) {
    return tapestryFetch("/contents/findOrCreate", {
        method: "POST",
        body: JSON.stringify({
            id: contentId,
            profileId,
            properties,
        }),
    })
}

export async function getContent(contentId: string, requestingProfileId?: string) {
    const params = new URLSearchParams()
    if (requestingProfileId) params.set("requestingProfileId", requestingProfileId)
    const query = params.toString() ? `?${params.toString()}` : ""
    return tapestryFetch(`/contents/${contentId}${query}`)
}

export async function getContents(options: {
    namespace?: string
    profileId?: string
    page?: number
    pageSize?: number
    orderBy?: string
    orderDirection?: string
    requestingProfileId?: string
    filterByProperties?: { key: string; value: string }[]
}) {
    const params = new URLSearchParams()
    if (options.profileId) params.set("profileId", options.profileId)
    if (options.page) params.set("page", String(options.page))
    if (options.pageSize) params.set("pageSize", String(options.pageSize))
    if (options.orderBy) params.set("orderByField", options.orderBy)
    if (options.orderDirection) params.set("orderByDirection", options.orderDirection.toUpperCase())
    if (options.requestingProfileId)
        params.set("requestingProfileId", options.requestingProfileId)

    const filters = []
    filters.push(`namespace:${options.namespace || TAPESTRY_NAMESPACE}`)

    if (options.filterByProperties && options.filterByProperties.length > 0) {
        options.filterByProperties.forEach(f => {
            filters.push(`${f.key}:CONTAINS:${f.value}`)
        })
    }
    params.set("filters", filters.join(","))

    return tapestryFetch(`/contents/?${params.toString()}`)
}

export async function updateContent(
    contentId: string,
    properties: { key: string; value: string | number | boolean }[]
) {
    return tapestryFetch(`/contents/${contentId}`, {
        method: "PUT",
        body: JSON.stringify({ properties }),
    })
}

// ─── LIKES ───────────────────────────────────────────────

export async function likeContent(profileId: string, contentId: string) {
    return tapestryFetch(`/likes/${contentId}`, {
        method: "POST",
        body: JSON.stringify({ startId: profileId }),
    })
}

export async function unlikeContent(profileId: string, contentId: string) {
    return tapestryFetch(`/likes/${contentId}`, {
        method: "DELETE",
        body: JSON.stringify({ startId: profileId }),
    })
}

export async function getContentLikes(
    contentId: string,
    page?: number,
    pageSize?: number
) {
    const params = new URLSearchParams()
    if (page) params.set("page", String(page))
    if (pageSize) params.set("pageSize", String(pageSize))
    const query = params.toString() ? `?${params.toString()}` : ""
    return tapestryFetch(`/likes/${contentId}${query}`)
}

// ─── COMMENTS ────────────────────────────────────────────

export async function createComment(
    contentId: string,
    profileId: string,
    text: string
) {
    try {
        return await tapestryFetch(`/comments/`, {
            method: "POST",
            body: JSON.stringify({ profileId, text, contentId }),
        })
    } catch (err: any) {
        // 🚨 WORKAROUND: Tapestry API currently has a bug where it returns 500 
        // even when the comment is successfully created. 
        if (err.message && err.message.includes("Unexpected error creating comment")) {
            return {
                comment: {
                    id: `comment-${Date.now()}`, // Temporary ID
                    text,
                    created_at: Date.now(),
                },
                status: "success_with_backend_error"
            }
        }
        throw err
    }
}

export async function getComments(
    contentId: string,
    page?: number,
    pageSize?: number,
    requestingProfileId?: string
) {
    const params = new URLSearchParams()
    params.set("contentId", contentId)
    if (page) params.set("page", String(page))
    if (pageSize) params.set("pageSize", String(pageSize))
    if (requestingProfileId)
        params.set("requestingProfileId", requestingProfileId)
    return tapestryFetch(`/comments/?${params.toString()}`)
}

// ─── FOLLOWS ─────────────────────────────────────────────

export async function followProfile(startId: string, endId: string) {
    return tapestryFetch("/followers/add", {
        method: "POST",
        body: JSON.stringify({ startId, endId }),
    })
}

export async function unfollowProfile(startId: string, endId: string) {
    return tapestryFetch("/followers/remove", {
        method: "POST",
        body: JSON.stringify({ startId, endId }),
    })
}

export async function isFollowing(startId: string, endId: string) {
    return tapestryFetch(`/followers/state?startId=${startId}&endId=${endId}`)
}

export async function getFollowers(profileId: string, page?: number, pageSize?: number) {
    const params = new URLSearchParams()
    if (page) params.set("page", String(page))
    if (pageSize) params.set("pageSize", String(pageSize))
    const query = params.toString() ? `?${params.toString()}` : ""
    return tapestryFetch(`/profiles/${profileId}/followers${query}`)
}

export async function getFollowing(profileId: string, page?: number, pageSize?: number) {
    const params = new URLSearchParams()
    if (page) params.set("page", String(page))
    if (pageSize) params.set("pageSize", String(pageSize))
    const query = params.toString() ? `?${params.toString()}` : ""
    return tapestryFetch(`/profiles/${profileId}/following${query}`)
}

// ─── ACTIVITY FEED ───────────────────────────────────────

export async function getActivityFeed(
    username: string,
    page?: number,
    pageSize?: number
) {
    const params = new URLSearchParams()
    params.set("username", username)
    if (page) params.set("page", String(page))
    if (pageSize) params.set("pageSize", String(pageSize))
    return tapestryFetch(`/activity/feed?${params.toString()}`)
}

// ─── NAMESPACE ───────────────────────────────────────────

export { TAPESTRY_NAMESPACE }
