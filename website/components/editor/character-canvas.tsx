"use client"

import { useState, useEffect, useCallback } from "react"
import type { ClothingCategory } from "@/lib/catalog"

interface CharacterCanvasProps {
    equippedItems: Partial<Record<ClothingCategory, string>> // category -> image path
    className?: string
}

export function CharacterCanvas({ equippedItems, className = "" }: CharacterCanvasProps) {
    const [isBlinking, setIsBlinking] = useState(false)

    // Blink animation: every 3-4 seconds, blink for 150ms
    useEffect(() => {
        const scheduleNextBlink = () => {
            const delay = 2500 + Math.random() * 2000 // 2.5-4.5s
            return setTimeout(() => {
                setIsBlinking(true)
                setTimeout(() => {
                    setIsBlinking(false)
                }, 150) // Eyes closed for 150ms
            }, delay)
        }

        let timeout = scheduleNextBlink()

        const interval = setInterval(() => {
            clearTimeout(timeout)
            timeout = scheduleNextBlink()
        }, 5000)

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [])

    // Recursive blink scheduler
    useEffect(() => {
        if (!isBlinking) return
        // isBlinking is handled by the setTimeout above
    }, [isBlinking])

    const eyesSrc = equippedItems.eyes
        ? (isBlinking ? "/sprites/closed-eyes.svg" : equippedItems.eyes)
        : null

    return (
        <div className={`relative aspect-[3/4] w-full max-w-[400px] mx-auto ${className}`}>
            {/* Background glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-berry-light/30 via-transparent to-sky/20 blur-xl" />

            {/* Character container */}
            <div className="relative h-full w-full">
                {/* Layer 0: Body base (always visible) */}
                <img
                    src="/sprites/body-base.svg"
                    alt="Character body"
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{ zIndex: 0 }}
                    draggable={false}
                />

                {/* Layer 1: Shoes */}
                {equippedItems.shoes && (
                    <img
                        src={equippedItems.shoes}
                        alt="Shoes"
                        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
                        style={{ zIndex: 1 }}
                        draggable={false}
                    />
                )}

                {/* Layer 2: Bottom (pants/skirt) */}
                {equippedItems.bottom && (
                    <img
                        src={equippedItems.bottom}
                        alt="Bottom"
                        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
                        style={{ zIndex: 2 }}
                        draggable={false}
                    />
                )}

                {/* Layer 3: Top (shirt/hoodie) */}
                {equippedItems.top && (
                    <img
                        src={equippedItems.top}
                        alt="Top"
                        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
                        style={{ zIndex: 3 }}
                        draggable={false}
                    />
                )}

                {/* Layer 4: Eyes (default or equipped, with blink) */}
                {eyesSrc && (
                    <img
                        src={eyesSrc}
                        alt="Eyes"
                        className="absolute inset-0 h-full w-full object-contain"
                        style={{ zIndex: 4 }}
                        draggable={false}
                    />
                )}

                {/* Layer 5: Hair */}
                {equippedItems.hair && (
                    <img
                        src={equippedItems.hair}
                        alt="Hair"
                        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
                        style={{ zIndex: 5 }}
                        draggable={false}
                    />
                )}
            </div>
        </div>
    )
}
