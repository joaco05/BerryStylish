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

export const Slide1Hero: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo entrance
    const logoScale = spring({ frame, fps, config: { damping: 12 } });
    const logoRotate = interpolate(logoScale, [0, 1], [-15, 0]);

    // Title entrance — staggered
    const titleY = interpolate(
        spring({ frame, fps, delay: 8, config: { damping: 200 } }),
        [0, 1],
        [60, 0]
    );
    const titleOpacity = interpolate(frame, [8, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Tagline lines stagger
    const line1 = spring({ frame, fps, delay: 20, config: { damping: 200 } });
    const line2 = spring({ frame, fps, delay: 28, config: { damping: 200 } });
    const line3 = spring({ frame, fps, delay: 36, config: { damping: 200 } });

    // Subtitle
    const subOpacity = interpolate(frame, [50, 70], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const subY = interpolate(
        spring({ frame, fps, delay: 50, config: { damping: 200 } }),
        [0, 1],
        [30, 0]
    );

    // Floating decorations
    const float1 = Math.sin(frame * 0.08) * 12;
    const float2 = Math.cos(frame * 0.06) * 15;
    const float3 = Math.sin(frame * 0.1 + 1) * 10;
    const float4 = Math.cos(frame * 0.07 + 2) * 14;

    // Background blobs pulsing
    const blobScale1 = 1 + Math.sin(frame * 0.04) * 0.08;
    const blobScale2 = 1 + Math.cos(frame * 0.035) * 0.06;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${BG} 0%, #fff5f8 40%, #f0e8f5 70%, ${BG} 100%)`,
                fontFamily: "'Nunito', sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Background blobs */}
            <div
                style={{
                    position: "absolute",
                    top: -100,
                    right: -80,
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${BERRY_LIGHT}55 0%, transparent 70%)`,
                    transform: `scale(${blobScale1})`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: -120,
                    left: -60,
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${SKY}40 0%, transparent 70%)`,
                    transform: `scale(${blobScale2})`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${LAVENDER}30 0%, transparent 70%)`,
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* Floating hearts & stars */}
            <svg
                style={{
                    position: "absolute",
                    top: 80 + float1,
                    left: 120,
                    opacity: 0.3,
                }}
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill={BERRY}
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg
                style={{
                    position: "absolute",
                    top: 160 + float2,
                    right: 180,
                    opacity: 0.25,
                }}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={SKY}
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
                style={{
                    position: "absolute",
                    bottom: 140 + float3,
                    left: 200,
                    opacity: 0.2,
                }}
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill={LAVENDER}
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
                style={{
                    position: "absolute",
                    bottom: 200 + float4,
                    right: 140,
                    opacity: 0.22,
                }}
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill={BERRY_LIGHT}
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            {/* Sparkle particles */}
            {[...Array(6)].map((_, i) => {
                const x = 150 + i * 300 + Math.sin(frame * 0.05 + i) * 40;
                const y = 100 + (i % 3) * 250 + Math.cos(frame * 0.07 + i * 2) * 30;
                const sparkOpacity = 0.15 + Math.sin(frame * 0.1 + i * 1.5) * 0.15;
                const sparkSize = 16 + Math.sin(frame * 0.08 + i) * 6;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y,
                            width: sparkSize,
                            height: sparkSize,
                            borderRadius: "50%",
                            background: [BERRY_LIGHT, SKY, LAVENDER, CREAM, BERRY, SKY][i],
                            opacity: sparkOpacity,
                            filter: "blur(1px)",
                        }}
                    />
                );
            })}

            {/* Main content */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    zIndex: 10,
                    position: "relative",
                }}
            >
                {/* Berry logo */}
                <div
                    style={{
                        transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
                        marginBottom: 20,
                    }}
                >
                    <Img
                        src={staticFile("berry-logo.svg")}
                        style={{ width: 120, height: 120 }}
                    />
                </div>

                {/* BerryStylish title */}
                <div
                    style={{
                        opacity: titleOpacity,
                        transform: `translateY(${titleY}px)`,
                    }}
                >
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 900,
                            fontFamily: "'Quicksand', sans-serif",
                            color: FG,
                            letterSpacing: -2,
                            margin: 0,
                            textAlign: "center",
                        }}
                    >
                        <span style={{ color: BERRY }}>Berry</span>
                        <span>Stylish</span>
                    </h1>
                </div>

                {/* Taglines */}
                <div
                    style={{
                        display: "flex",
                        gap: 24,
                        marginTop: 30,
                        fontSize: 48,
                        fontWeight: 800,
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    <span
                        style={{
                            opacity: line1,
                            transform: `translateY(${(1 - line1) * 30}px)`,
                            color: FG,
                        }}
                    >
                        Dress Up.
                    </span>
                    <span
                        style={{
                            opacity: line2,
                            transform: `translateY(${(1 - line2) * 30}px)`,
                            color: BERRY,
                        }}
                    >
                        Stand Out.
                    </span>
                    <span
                        style={{
                            opacity: line3,
                            transform: `translateY(${(1 - line3) * 30}px)`,
                            color: SKY,
                        }}
                    >
                        Connect.
                    </span>
                </div>

                {/* Subtitle */}
                <p
                    style={{
                        opacity: subOpacity,
                        transform: `translateY(${subY}px)`,
                        fontSize: 22,
                        fontWeight: 600,
                        color: "#7a5a6a",
                        maxWidth: 700,
                        textAlign: "center",
                        lineHeight: 1.5,
                        marginTop: 28,
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    Create your dream avatar, collect exclusive NFT outfits, and join a
                    vibrant community of fashion lovers in the cutest social dress-up
                    game.
                </p>
            </div>
        </AbsoluteFill>
    );
};
