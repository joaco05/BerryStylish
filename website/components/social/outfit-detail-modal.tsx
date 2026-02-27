"use client"

import { useState, useEffect, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OutfitPreview } from "./outfit-preview"
import { Heart, MessageCircle, Send, User, Loader2, X, FolderPlus, Check, ChevronDown, Plus } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Comment {
    comment: {
        id: string
        text: string
        created_at: number
    }
    author: {
        id: string
        username: string
        image?: string | null
    }
}

interface OutfitDetailModalProps {
    isOpen: boolean
    onClose: () => void
    outfit: any | null
    profileId: string | null
    onLike?: (contentId: string) => void
    onUnlike?: (contentId: string) => void
    onCommentAdded?: (contentId: string) => void
}

function parseEquippedItems(content: any) {
    try {
        if (content?.equippedItems) {
            return typeof content.equippedItems === "string"
                ? JSON.parse(content.equippedItems)
                : content.equippedItems
        }
        return {}
    } catch { return {} }
}

function getContentProperty(content: any, key: string): string {
    if (!content) return ""
    if (content[key]) return String(content[key])
    if (content.properties) {
        const prop = content.properties.find?.((p: any) => p.key === key)
        return prop?.value ? String(prop.value) : ""
    }
    return ""
}

function getRelativeTime(rawTime: any): string {
    if (!rawTime) return ""
    try {
        const numericTime = Number(rawTime)
        if (!isNaN(numericTime)) {
            const ms = numericTime < 10000000000 ? numericTime * 1000 : numericTime
            const dateObj = new Date(ms)
            if (isNaN(dateObj.getTime())) return ""
            const diff = Date.now() - dateObj.getTime()
            if (diff < 0) return "just now"
            const minutes = Math.floor(diff / 60000)
            const hours = Math.floor(minutes / 60)
            const days = Math.floor(hours / 24)
            if (days > 0) return `${days}d ago`
            if (hours > 0) return `${hours}h ago`
            if (minutes > 0) return `${minutes}m ago`
            return "just now"
        }
        const strDate = new Date(rawTime)
        if (!isNaN(strDate.getTime())) {
            const diff = Date.now() - strDate.getTime()
            const hours = Math.floor(diff / 3600000)
            const days = Math.floor(hours / 24)
            if (days > 0) return `${days}d ago`
            if (hours > 0) return `${hours}h ago`
            return "recently"
        }
    } catch { return "" }
    return ""
}

export function OutfitDetailModal({
    isOpen, onClose, outfit, profileId, onLike, onUnlike, onCommentAdded,
}: OutfitDetailModalProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const contentId = outfit?.content?.id
    const [likeCount, setLikeCount] = useState(outfit?.socialCounts?.likeCount || 0)
    const [liked, setLiked] = useState(outfit?.requestingProfileSocialInfo?.hasLiked || false)
    const [isLiking, setIsLiking] = useState(false)
    const [commentCount, setCommentCount] = useState(outfit?.socialCounts?.commentCount || 0)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Collection states
    const [userCollections, setUserCollections] = useState<any[]>([])
    const [isLoadingCollections, setIsLoadingCollections] = useState(false)
    const [showCollectionList, setShowCollectionList] = useState(false)
    const [isAddingToCollection, setIsAddingToCollection] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && outfit) {
            setLikeCount(outfit.socialCounts?.likeCount || 0)
            setLiked(outfit.requestingProfileSocialInfo?.hasLiked || false)
            setCommentCount(outfit.socialCounts?.commentCount || 0)
            fetchComments()
            if (profileId) fetchUserCollections()
        } else {
            setComments([])
            setCommentText("")
            setShowCollectionList(false)
        }
    }, [isOpen, outfit?.content?.id, profileId])

    const fetchUserCollections = async () => {
        if (!profileId) return
        setIsLoadingCollections(true)
        try {
            const res = await fetch(`/api/tapestry/collections?profileId=${profileId}&pageSize=50`)
            const data = await res.json()
            if (data.contents) setUserCollections(data.contents)
        } catch (err) {
            console.error("Failed to fetch user collections", err)
        } finally {
            setIsLoadingCollections(false)
        }
    }

    const handleAddToCollection = async (collectionId: string) => {
        if (!contentId || isAddingToCollection) return
        setIsAddingToCollection(collectionId)
        try {
            const res = await fetch(`/api/tapestry/collections/${collectionId}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ outfitId: contentId }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            toast.success("Added to collection!")
            setShowCollectionList(false)
        } catch (err: any) {
            toast.error("Failed to add to collection", { description: err.message })
        } finally {
            setIsAddingToCollection(null)
        }
    }

    const fetchComments = async () => {
        if (!contentId) return
        setLoadingComments(true)
        try {
            const res = await fetch(`/api/tapestry/outfits/${contentId}/comment?page=1&pageSize=50`)
            const data = await res.json()
            if (data.comments) setComments(data.comments.reverse())
        } catch (err) {
            console.error("Failed to fetch comments", err)
        } finally {
            setLoadingComments(false)
        }
    }

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [comments])

    const handleLike = async () => {
        if (!profileId || isLiking || !contentId) return
        setIsLiking(true)
        const wasLiked = liked
        setLiked(!wasLiked)
        setLikeCount((c: number) => wasLiked ? Math.max(0, c - 1) : c + 1)
        try {
            const res = await fetch(`/api/tapestry/outfits/${contentId}/like`, {
                method: wasLiked ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            wasLiked ? onUnlike?.(contentId) : onLike?.(contentId)
        } catch (err: any) {
            setLiked(wasLiked)
            setLikeCount((c: number) => wasLiked ? c + 1 : Math.max(0, c - 1))
            toast.error("Failed to update like", { description: err.message })
        } finally {
            setIsLiking(false)
        }
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profileId || !commentText.trim() || isSubmitting || !contentId) return
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/tapestry/outfits/${contentId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId, text: commentText }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setCommentText("")
            setCommentCount((c: number) => c + 1)
            onCommentAdded?.(contentId)
            toast.success("Comment posted!")
            await fetchComments()
        } catch (err: any) {
            toast.error("Failed to post comment", { description: err.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!outfit) return null

    const equippedItems = parseEquippedItems(outfit.content)
    const title = getContentProperty(outfit.content, "title") || "Untitled Outfit"
    const description = getContentProperty(outfit.content, "description")
    const authorUsername = outfit.authorProfile?.username || "Unknown"

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/*
              Key layout fixes vs previous version:
              - [&>button]:hidden hides shadcn's default X so we can place our own
              - md:h-[680px] + max-h-[92vh] keeps it fully on screen
              - Left panel: flex-col with flex-1 preview area + shrink-0 footer
              - Right panel: flex-1 min-h-0 + overflow-hidden so scrollable list works
            */}
            <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 overflow-hidden bg-card border-border rounded-2xl shadow-2xl flex flex-col md:flex-row md:h-[680px] max-h-[92vh] [&>button]:hidden">

                {/* ── LEFT: Outfit preview ── */}
                <div className="flex flex-col w-full md:w-[300px] shrink-0 border-b md:border-b-0 md:border-r border-border bg-gradient-to-b from-muted/30 to-background overflow-hidden">
                    {/* Title area */}
                    <div className="px-5 pt-5 pb-2 shrink-0">
                        <DialogTitle className="text-lg font-extrabold text-foreground truncate leading-snug">
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {description}
                            </DialogDescription>
                        )}
                    </div>

                    {/* Preview: flex-1 so it fills remaining space, character centers inside */}
                    <div className="flex-1 min-h-0 mx-4 my-2 rounded-2xl bg-white/50 border border-black/5 flex items-center justify-center overflow-hidden">
                        <OutfitPreview equippedItems={equippedItems} size="lg" />
                    </div>

                    {/* Creator + social — always pinned at bottom */}
                    <div className="px-4 py-3 shrink-0 flex items-center justify-between border-t border-border/50">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                {outfit.authorProfile?.image
                                    ? <img src={outfit.authorProfile.image} alt="author" className="h-full w-full object-cover" />
                                    : <User className="h-4 w-4 text-primary" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Creator</span>
                                <span className="text-sm font-bold text-foreground truncate max-w-[100px]">{authorUsername}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 relative">
                            <button
                                onClick={() => setShowCollectionList(!showCollectionList)}
                                disabled={!profileId}
                                className={`flex items-center justify-center h-8 w-8 rounded-full transition-all
                                    ${showCollectionList ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:text-primary"}
                                    ${!profileId ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                title="Add to Collection"
                            >
                                <FolderPlus className="h-4 w-4" />
                            </button>

                            {showCollectionList && (
                                <div className="absolute bottom-full right-0 mb-2 w-56 max-h-48 overflow-y-auto rounded-xl border border-border bg-card shadow-xl z-50 p-2 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-2 py-1 border-b border-border/50 mb-1 flex items-center justify-between">
                                        <span>My Collections</span>
                                        <X className="h-2 w-2 cursor-pointer" onClick={() => setShowCollectionList(false)} />
                                    </div>
                                    {isLoadingCollections ? (
                                        <div className="flex justify-center p-4">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        </div>
                                    ) : userCollections.length === 0 ? (
                                        <div className="p-3 text-center">
                                            <p className="text-[10px] text-muted-foreground mb-2">No collections yet</p>
                                            <Link href="/social/collections">
                                                <Button size="sm" className="w-full text-[10px] h-6 rounded-lg">Create New</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {userCollections.map((col) => (
                                                <button
                                                    key={col.content?.id}
                                                    onClick={() => handleAddToCollection(col.content?.id)}
                                                    disabled={!!isAddingToCollection}
                                                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between group"
                                                >
                                                    <span className="truncate flex-1">
                                                        {getContentProperty(col.content, "title") || "Untitled"}
                                                    </span>
                                                    {isAddingToCollection === col.content?.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleLike}
                                disabled={!profileId || isLiking}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-bold transition-all
                                    ${liked ? "bg-rose-500/10 text-rose-500" : "bg-muted/60 text-muted-foreground hover:text-rose-500"}
                                    ${!profileId ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                                {likeCount}
                            </button>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted/60 text-muted-foreground text-sm font-bold">
                                <MessageCircle className="h-4 w-4" />
                                {commentCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Comments ── */}
                <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-background">
                    {/* Header + our own close button */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                        <span className="font-bold text-foreground">Comments ({commentCount})</span>
                        <button
                            onClick={onClose}
                            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Scrollable comments */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
                        {loadingComments ? (
                            <div className="flex justify-center items-center h-24">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-24 gap-1 text-muted-foreground/60">
                                <MessageCircle className="h-8 w-8" />
                                <p className="text-sm font-medium">No comments yet.</p>
                                <p className="text-xs">Be the first to share what you think!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.comment?.id || Math.random()} className="flex gap-3">
                                    <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                        {comment.author?.image
                                            ? <img src={comment.author.image} alt="author" className="h-full w-full object-cover" />
                                            : <User className="h-4 w-4 text-primary" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <span className="text-sm font-bold text-foreground">{comment.author?.username || "Unknown"}</span>
                                            <span className="text-[10px] text-muted-foreground shrink-0">
                                                {getRelativeTime(comment.comment?.created_at || (comment.comment as any)?.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground/90 mt-0.5 break-words">{comment.comment?.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Comment input — always visible */}
                    <div className="px-4 py-3 border-t border-border shrink-0">
                        <form onSubmit={handleSubmitComment} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder={profileId ? "Add a comment..." : "Connect wallet to comment"}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                disabled={!profileId || isSubmitting}
                                className="w-full bg-muted/50 border border-border rounded-full px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition-shadow"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!commentText.trim() || !profileId || isSubmitting}
                                className="absolute right-1 h-8 w-8 rounded-full"
                            >
                                {isSubmitting
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Send className="h-3.5 w-3.5" />}
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}