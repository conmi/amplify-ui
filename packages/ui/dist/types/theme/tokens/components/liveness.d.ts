import { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
type ModalTokenKey = 'backgroundColor';
type LivenessModalTokens<OutputType> = DesignTokenProperties<ModalTokenKey, OutputType>;
export type LivenessTokens<OutputType extends OutputVariantKey> = {
    cameraModule?: LivenessModalTokens<OutputType>;
};
export declare const liveness: Required<LivenessTokens<'default'>>;
export {};
