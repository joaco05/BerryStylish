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

interface AvatarConfig {
    hair: string;
    eyes: string;
    top: string;
    bottom: string;
}

interface PostData {
    user: string;
    initials: string;
    time: string;
    text: string;
    likes: number;
    comments: number;
    avatar: AvatarConfig;
    bgColor: string;
}

const POSTS: PostData[] = [
    {
        user: "SakuraMimi",
        initials: "SM",
        time: "2h ago",
        text: "Just won the Fairy Garden challenge! Look at my new wings collection ✨",
        likes: 342,
        comments: 48,
        avatar: {
            hair: "Hair op 1.svg",
            eyes: "Eyes op 1.svg",
            top: "Hoodie red 1.svg",
            bottom: "Skirt teal 1.svg",
        },
        bgColor: BERRY_LIGHT,
    },
    {
        user: "CloudyBear",
        initials: "CB",
        time: "4h ago",
        text: "Trading my rare Moonlight set for the new Strawberry collection. DM me!",
        likes: 189,
        comments: 67,
        avatar: {
            hair: "Hair op 2.svg",
            eyes: "Eyes op 3.svg",
            top: "Shirt purple 1.svg",
            bottom: "Pants grey 1.svg",
        },
        bgColor: SKY,
    },
    {
        user: "PixelRose",
        initials: "PR",
        time: "6h ago",
        text: "My avatar for today's theme: Cottagecore Dreamer 🌸",
        likes: 521,
        comments: 93,
        avatar: {
            hair: "Hair op 1.svg",
            eyes: "Eyes op 5.svg",
            top: "Shirt purple 1.svg",
            bottom: "Skirt teal 1.svg",
        },
        bgColor: LAVENDER,
    },
];

const MiniAvatar: React.FC<{ config: AvatarConfig; size: number }> = ({
    config,
    size,
}) => {
    const layerStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
    };

    return (
        <div style={{ position: "relative", width: size, height: size }}>
            <Img src={staticFile("sprites/Body base.svg")} style={layerStyle} />
            <Img src={staticFile("sprites/Shoes op1.svg")} style={layerStyle} />
            <Img src={staticFile(`sprites/${config.bottom}`)} style={layerStyle} />
            <Img src={staticFile(`sprites/${config.top}`)} style={layerStyle} />
            <Img src={staticFile(`sprites/${config.hair}`)} style={layerStyle} />
            <Img src={staticFile(`sprites/${config.eyes}`)} style={layerStyle} />
        </div>
    );
};

const SocialPost: React.FC<{
    post: PostData;
    enterProgress: number;
    index: number;
    frame: number;
}> = ({ post, enterProgress, index, frame }) => {
    const slideX = interpolate(
        enterProgress,
        [0, 1],
        [index % 2 === 0 ? -200 : 200, 0]
    );

    // Animate likes counter
    const likesCount = Math.round(
        interpolate(enterProgress, [0.3, 1], [0, post.likes], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

    return (
        <div
            style={{
                opacity: enterProgress,
                transform: `translateX(${slideX}px)`,
                background: "rgba(255,255,255,0.95)",
                borderRadius: 24,
                padding: 20,
                border: `2px solid ${post.bgColor}50`,
                boxShadow: `0 8px 30px ${post.bgColor}20`,
                width: 310,
                fontFamily: "'Nunito', sans-serif",
            }}
        >
            {/* Post header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${BERRY}, ${BERRY_DARK})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: 800,
                    }}
                >
                    {post.initials}
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: FG }}>
                        {post.user}
                    </div>
                    <div style={{ fontSize: 11, color: "#9a8a90" }}>{post.time}</div>
                </div>
            </div>

            {/* Avatar preview using sprites */}
            <div
                style={{
                    marginTop: 14,
                    height: 140,
                    borderRadius: 16,
                    background: `${post.bgColor}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                <MiniAvatar config={post.avatar} size={130} />
            </div>

            {/* Text */}
            <p
                style={{
                    marginTop: 12,
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: FG,
                    fontWeight: 600,
                }}
            >
                {post.text}
            </p>

            {/* Actions */}
            <div
                style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: `1px solid ${BERRY_LIGHT}`,
                    display: "flex",
                    gap: 20,
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 13,
                        fontWeight: 700,
                        color: BERRY,
                        minWidth: 60,
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={BERRY}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {likesCount}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#9a8a90",
                    }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9a8a90"
                        strokeWidth="2"
                    >
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {post.comments}
                </div>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9a8a90"
                    strokeWidth="2"
                    style={{ marginLeft: "auto" }}
                >
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                    <polyline points="16,6 12,2 8,6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
            </div>
        </div>
    );
};

export const Slide3Social: React.FC = () => {
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

    // Berry counter
    const berryCountStart = 40;
    const berryTarget = 1250;
    const berryProgress = interpolate(
        frame,
        [berryCountStart, berryCountStart + 60],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const berryCount = Math.round(berryProgress * berryTarget);

    // Berry counter entrance
    const counterEnter = spring({
        frame,
        fps,
        delay: 35,
        config: { damping: 200 },
    });

    // Floating hearts animation
    const hearts = [...Array(8)].map((_, i) => {
        const startFrame = 20 + i * 15;
        const localFrame = Math.max(0, frame - startFrame);
        const lifespan = 60;
        const progress = Math.min(localFrame / lifespan, 1);
        return {
            x: 900 + Math.sin(i * 1.8) * 80 + Math.sin(localFrame * 0.1 + i) * 15,
            y: interpolate(progress, [0, 1], [700, 200]),
            opacity: interpolate(progress, [0, 0.1, 0.7, 1], [0, 0.8, 0.8, 0]),
            scale: 0.5 + Math.sin(i * 0.7) * 0.3,
            color: [
                BERRY,
                BERRY_LIGHT,
                SKY,
                LAVENDER,
                BERRY_DARK,
                BERRY,
                LAVENDER,
                SKY,
            ][i],
        };
    });

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
                    top: -80,
                    right: -60,
                    width: 450,
                    height: 450,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${BERRY_LIGHT}30 0%, transparent 70%)`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: -100,
                    left: -80,
                    width: 550,
                    height: 550,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${LAVENDER}25 0%, transparent 70%)`,
                }}
            />

            {/* Header */}
            <div
                style={{
                    position: "absolute",
                    top: 45,
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
                        fontSize: 44,
                        fontWeight: 800,
                        color: FG,
                        fontFamily: "'Quicksand', sans-serif",
                        margin: 0,
                    }}
                >
                    Share your creations with the world
                </h2>
                <p
                    style={{
                        fontSize: 30,
                        fontWeight: 700,
                        color: BERRY,
                        marginTop: 8,
                    }}
                >
                    and earn Berrys!!! 🍓✨
                </p>
            </div>

            {/* Social feed */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    paddingTop: 110,
                    gap: 24,
                }}
            >
                {POSTS.map((post, i) => (
                    <SocialPost
                        key={post.user}
                        post={post}
                        index={i}
                        frame={frame}
                        enterProgress={spring({
                            frame,
                            fps,
                            delay: 12 + i * 10,
                            config: { damping: 200 },
                        })}
                    />
                ))}

                {/* Berry earnings panel */}
                <div
                    style={{
                        opacity: counterEnter,
                        transform: `scale(${counterEnter}) translateY(${(1 - counterEnter) * 40}px)`,
                        background: `linear-gradient(135deg, ${BERRY}, ${BERRY_DARK})`,
                        borderRadius: 24,
                        padding: "24px 30px",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: `0 12px 40px ${BERRY}40`,
                        width: 200,
                    }}
                >
                    <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
                        YOUR EARNINGS
                    </div>
                    <div
                        style={{
                            fontSize: 42,
                            fontWeight: 900,
                            fontFamily: "'Quicksand', sans-serif",
                            width: "100%",
                            textAlign: "center",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        🍓{" "}
                        <span
                            style={{
                                display: "inline-block",
                                minWidth: 110,
                                textAlign: "right",
                            }}
                        >
                            {berryCount.toLocaleString()}
                        </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.8 }}>
                        BERRY Tokens
                    </div>

                    {/* Mini stats */}
                    <div
                        style={{
                            marginTop: 12,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12,
                                fontWeight: 600,
                                opacity: 0.85,
                            }}
                        >
                            <span>Content Royalties</span>
                            <span>+420</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12,
                                fontWeight: 600,
                                opacity: 0.85,
                            }}
                        >
                            <span>Likes Earned</span>
                            <span>+380</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12,
                                fontWeight: 600,
                                opacity: 0.85,
                            }}
                        >
                            <span>Challenge Wins</span>
                            <span>+450</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating hearts */}
            {hearts.map((heart, i) => (
                <svg
                    key={i}
                    style={{
                        position: "absolute",
                        left: heart.x,
                        top: heart.y,
                        opacity: heart.opacity,
                        transform: `scale(${heart.scale})`,
                    }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={heart.color}
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            ))}

            {/* Sparkle particles */}
            {[...Array(5)].map((_, i) => {
                const x = 120 + i * 380 + Math.sin(frame * 0.05 + i * 2) * 25;
                const y = 150 + (i % 3) * 300 + Math.cos(frame * 0.07 + i) * 20;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y,
                            width: 10 + i * 2,
                            height: 10 + i * 2,
                            borderRadius: "50%",
                            background: [BERRY_LIGHT, SKY, LAVENDER, CREAM, BERRY][i],
                            opacity: 0.2 + Math.sin(frame * 0.08 + i * 1.3) * 0.15,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
