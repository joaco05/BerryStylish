import React from "react";
import {
    AbsoluteFill,
    Img,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";

const BERRY = "#d87a9c";
const BERRY_LIGHT = "#f0c4d4";
const BERRY_DARK = "#a84a6a";
const CREAM = "#f5eee0";
const SKY = "#9cc8e8";
const LAVENDER = "#c8b0d8";
const FG = "#3b2a30";
const BG = "#f8f0f2";

interface OutfitCombo {
    hair: string;
    eyes: string;
    top: string;
    bottom: string;
    label: string;
    topName: string;
    topPrice: string;
    topRarity: string;
    bottomName: string;
    bottomPrice: string;
    bottomRarity: string;
}

const OUTFITS: OutfitCombo[] = [
    {
        hair: "Hair op 1.svg",
        eyes: "Eyes op 1.svg",
        top: "Hoodie red 1.svg",
        bottom: "Pants grey 1.svg",
        label: "Cozy Streetwear",
        topName: "Red Hoodie",
        topPrice: "120",
        topRarity: "Common",
        bottomName: "Grey Pants",
        bottomPrice: "85",
        bottomRarity: "Common",
    },
    {
        hair: "Hair op 2.svg",
        eyes: "Eyes op 3.svg",
        top: "Shirt purple 1.svg",
        bottom: "Skirt teal 1.svg",
        label: "Cute & Casual",
        topName: "Purple Shirt",
        topPrice: "95",
        topRarity: "Rare",
        bottomName: "Teal Skirt",
        bottomPrice: "150",
        bottomRarity: "Epic",
    },
    {
        hair: "Hair op 1.svg",
        eyes: "Eyes op 5.svg",
        top: "Hoodie red 1.svg",
        bottom: "Skirt teal 1.svg",
        label: "Mix & Match",
        topName: "Red Hoodie",
        topPrice: "120",
        topRarity: "Common",
        bottomName: "Teal Skirt",
        bottomPrice: "150",
        bottomRarity: "Epic",
    },
    {
        hair: "Hair op 2.svg",
        eyes: "Eyes op 2.svg",
        top: "Shirt purple 1.svg",
        bottom: "Pants grey 1.svg",
        label: "Smart Casual",
        topName: "Purple Shirt",
        topPrice: "95",
        topRarity: "Rare",
        bottomName: "Grey Pants",
        bottomPrice: "85",
        bottomRarity: "Common",
    },
];

const OUTFIT_DURATION = 45; // frames per outfit
const BLINK_FRAMES = 4;

const CharacterAvatar: React.FC<{
    outfit: OutfitCombo;
    frame: number;
    transitionProgress: number;
}> = ({ outfit, frame, transitionProgress }) => {
    // Blink every ~60 frames for BLINK_FRAMES duration
    const blinkCycle = frame % 60;
    const isBlinking = blinkCycle >= 56 && blinkCycle < 56 + BLINK_FRAMES;

    const avatarStyle: React.CSSProperties = {
        position: "relative",
        width: 340,
        height: 480,
        opacity: transitionProgress,
        transform: `scale(${0.9 + transitionProgress * 0.1})`,
    };

    const layerStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
    };

    return (
        <div style={avatarStyle}>
            {/* Body base — always visible */}
            <Img src={staticFile("sprites/Body base.svg")} style={layerStyle} />
            {/* Shoes — always visible */}
            <Img src={staticFile("sprites/Shoes op1.svg")} style={layerStyle} />
            {/* Bottom (pants/skirt) */}
            <Img src={staticFile(`sprites/${outfit.bottom}`)} style={layerStyle} />
            {/* Top (hoodie/shirt) */}
            <Img src={staticFile(`sprites/${outfit.top}`)} style={layerStyle} />
            {/* Eyes — swap to closed for blink */}
            <Img
                src={staticFile(
                    `sprites/${isBlinking ? "Closed eyes.svg" : outfit.eyes}`
                )}
                style={layerStyle}
            />
            {/* Hair — rendered after eyes so it stays on top */}
            <Img src={staticFile(`sprites/${outfit.hair}`)} style={layerStyle} />
        </div>
    );
};

const NFTItemCard: React.FC<{
    name: string;
    price: string;
    rarity: string;
    color: string;
    enterProgress: number;
    side: "left" | "right";
}> = ({ name, price, rarity, color, enterProgress, side }) => {
    const xOffset = side === "left" ? -120 : 120;
    const translateX = interpolate(enterProgress, [0, 1], [xOffset, 0]);

    return (
        <div
            style={{
                opacity: enterProgress,
                transform: `translateX(${translateX}px)`,
                background: "rgba(255,255,255,0.92)",
                borderRadius: 20,
                padding: "14px 18px",
                border: `2px solid ${color}40`,
                boxShadow: `0 8px 30px ${color}20`,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                width: 180,
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: color,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                }}
            >
                {rarity}
            </div>
            <div
                style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: FG,
                    fontFamily: "'Nunito', sans-serif",
                }}
            >
                {name}
            </div>
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: BERRY_DARK,
                    fontFamily: "'Quicksand', sans-serif",
                }}
            >
                🍓 {price} BERRY
            </div>
        </div>
    );
};

export const Slide2Wardrobe: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Header entrance
    const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const headerY = interpolate(
        spring({ frame, fps, config: { damping: 200 } }),
        [0, 1],
        [-40, 0]
    );

    // Current outfit index
    const currentOutfitIndex = Math.min(
        Math.floor(frame / OUTFIT_DURATION),
        OUTFITS.length - 1
    );
    const outfitFrame = frame - currentOutfitIndex * OUTFIT_DURATION;

    // Transition progress for outfit swap
    const transitionProgress = interpolate(outfitFrame, [0, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Outfit label
    const labelOpacity = interpolate(outfitFrame, [5, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const labelScale = spring({
        frame: outfitFrame - 5,
        fps,
        config: { damping: 12 },
    });

    // NFT cards entrance
    const cardEnter = spring({
        frame,
        fps,
        delay: 15,
        config: { damping: 200 },
    });

    // UI frame glow pulse
    const glowIntensity = 0.3 + Math.sin(frame * 0.08) * 0.15;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${BG} 0%, #fff5f8 40%, #f0e8f5 70%, ${BG} 100%)`,
                fontFamily: "'Nunito', sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Background decorations */}
            <div
                style={{
                    position: "absolute",
                    top: -60,
                    left: -40,
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${BERRY_LIGHT}40 0%, transparent 70%)`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: -80,
                    right: -60,
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${SKY}30 0%, transparent 70%)`,
                }}
            />

            {/* Header */}
            <div
                style={{
                    position: "absolute",
                    top: 50,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: headerOpacity,
                    transform: `translateY(${headerY}px)`,
                    zIndex: 20,
                }}
            >
                <h2
                    style={{
                        fontSize: 42,
                        fontWeight: 800,
                        color: FG,
                        fontFamily: "'Quicksand', sans-serif",
                        margin: 0,
                    }}
                >
                    Buy NFTs with the{" "}
                    <span style={{ color: BERRY }}>Berry Token</span>
                </h2>
                <p
                    style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: BERRY_DARK,
                        marginTop: 8,
                    }}
                >
                    and dress up in the wardrobe! 🍓
                </p>
            </div>

            {/* Main content area */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    paddingTop: 100,
                    gap: 40,
                }}
            >
                {/* Left NFT cards */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        marginTop: 30,
                    }}
                >
                    <NFTItemCard
                        name={OUTFITS[currentOutfitIndex].topName}
                        price={OUTFITS[currentOutfitIndex].topPrice}
                        rarity={OUTFITS[currentOutfitIndex].topRarity}
                        color={BERRY}
                        enterProgress={cardEnter}
                        side="left"
                    />
                    <NFTItemCard
                        name={OUTFITS[currentOutfitIndex].bottomName}
                        price={OUTFITS[currentOutfitIndex].bottomPrice}
                        rarity={OUTFITS[currentOutfitIndex].bottomRarity}
                        color={SKY}
                        enterProgress={spring({
                            frame,
                            fps,
                            delay: 22,
                            config: { damping: 200 },
                        })}
                        side="left"
                    />
                </div>

                {/* Character select frame */}
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {/* Game-like frame */}
                    <div
                        style={{
                            position: "relative",
                            padding: 16,
                            borderRadius: 30,
                            border: `3px solid ${BERRY}80`,
                            background: `linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,245,248,0.8) 100%)`,
                            boxShadow: `0 0 ${30 + glowIntensity * 40}px ${BERRY_LIGHT}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")}`,
                        }}
                    >
                        <CharacterAvatar
                            outfit={OUTFITS[currentOutfitIndex]}
                            frame={frame}
                            transitionProgress={transitionProgress}
                        />

                        {/* Outfit indicator dots */}
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                justifyContent: "center",
                                marginTop: 12,
                            }}
                        >
                            {OUTFITS.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        background:
                                            i === currentOutfitIndex ? BERRY : `${BERRY_LIGHT}`,
                                        border: `2px solid ${BERRY}60`,
                                        transition: "none",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Outfit label */}
                    <div
                        style={{
                            marginTop: 16,
                            opacity: labelOpacity,
                            transform: `scale(${Math.max(0, labelScale)})`,
                            padding: "8px 24px",
                            borderRadius: 20,
                            background: `linear-gradient(135deg, ${BERRY}, ${BERRY_DARK})`,
                            color: "white",
                            fontSize: 18,
                            fontWeight: 800,
                            textAlign: "center",
                        }}
                    >
                        {OUTFITS[currentOutfitIndex].label}
                    </div>
                </div>

                {/* Right NFT cards — hair & eyes for current outfit */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        marginTop: 30,
                    }}
                >
                    <NFTItemCard
                        name={OUTFITS[currentOutfitIndex].hair.replace(".svg", "")}
                        price="200"
                        rarity="Rare"
                        color={LAVENDER}
                        enterProgress={spring({
                            frame,
                            fps,
                            delay: 18,
                            config: { damping: 200 },
                        })}
                        side="right"
                    />
                    <NFTItemCard
                        name={OUTFITS[currentOutfitIndex].eyes.replace(".svg", "")}
                        price="75"
                        rarity="Common"
                        color={SKY}
                        enterProgress={spring({
                            frame,
                            fps,
                            delay: 25,
                            config: { damping: 200 },
                        })}
                        side="right"
                    />
                </div>
            </div>

            {/* Floating sparkles */}
            {[...Array(4)].map((_, i) => {
                const x = 100 + i * 450 + Math.sin(frame * 0.04 + i * 2) * 30;
                const y = 200 + (i % 2) * 400 + Math.cos(frame * 0.06 + i) * 25;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y,
                            width: 8 + i * 3,
                            height: 8 + i * 3,
                            borderRadius: "50%",
                            background: [BERRY_LIGHT, SKY, LAVENDER, CREAM][i],
                            opacity: 0.3 + Math.sin(frame * 0.1 + i) * 0.2,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
