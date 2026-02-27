import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Slide1Hero } from "./slides/Slide1Hero";
import { Slide2Wardrobe } from "./slides/Slide2Wardrobe";
import { Slide3Social } from "./slides/Slide3Social";

const TRANSITION_DURATION = 20;

export const BerryStylishVideo: React.FC = () => {
    return (
        <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={150}>
                <Slide1Hero />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                presentation={slide({ direction: "from-right" })}
                timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
            />

            <TransitionSeries.Sequence durationInFrames={210}>
                <Slide2Wardrobe />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                presentation={slide({ direction: "from-left" })}
                timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
            />

            <TransitionSeries.Sequence durationInFrames={180}>
                <Slide3Social />
            </TransitionSeries.Sequence>
        </TransitionSeries>
    );
};
