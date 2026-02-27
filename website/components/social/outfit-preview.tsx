"use client"

import type { ClothingCategory } from "@/lib/catalog"

interface OutfitPreviewProps {
    equippedItems: Partial<Record<ClothingCategory, string>>
    size?: "sm" | "md" | "lg"
    className?: string
}

const SIZE_MAP = {
    sm: "w-32 h-44",
    md: "w-52 h-72",
    lg: "w-72 h-[450px]",
}

export function OutfitPreview({
    equippedItems,
    size = "md",
    className = "",
}: OutfitPreviewProps) {
    return (
        <div className={`relative ${SIZE_MAP[size]} ${className}`}>
            {/* Body base */}
            <img
                src="/sprites/body-base.svg"
                alt="Character body"
                className="absolute inset-0 h-full w-full object-contain"
                style={{ zIndex: 0 }}
                draggable={false}
            />

            {/* Shoes */}
            {equippedItems.shoes && (
                <img
                    src={equippedItems.shoes}
                    alt="Shoes"
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{ zIndex: 1 }}
                    draggable={false}
                />
            )}

            {/* Bottom */}
            {equippedItems.bottom && (
                <img
                    src={equippedItems.bottom}
                    alt="Bottom"
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{ zIndex: 2 }}
                    draggable={false}
                />
            )}

            {/* Top */}
            {equippedItems.top && (
                <img
                    src={equippedItems.top}
                    alt="Top"
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{ zIndex: 3 }}
                    draggable={false}
                />
            )}

            {/* Eyes */}
            {equippedItems.eyes && (
                <img
                    src={equippedItems.eyes}
                    alt="Eyes"
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{ zIndex: 4 }}
                    draggable={false}
                />
            )}

            {/* Hair */}
            {equippedItems.hair && (
                <img
                    src={equippedItems.hair}
                    alt="Hair"
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{ zIndex: 5 }}
                    draggable={false}
                />
            )}
        </div>
    )
}
