import { MessageComponentStyles } from '../hooks/useMessageProps';
import { MessageLayoutButtonModifier } from './types';
/**
 * Utility for determining the class modifier for an In-App Messaging button
 * based on its background color
 *
 * @param buttonStyles button styles which should contain the background color
 * @param defaultModifier modifier that should be returned in cases where
 * background color is undefined
 *
 * @returns the modifier - either 'light' or 'dark'
 */
export declare const getButtonModifier: (buttonStyles: MessageComponentStyles['primaryButton' | 'secondaryButton'], defaultModifier?: MessageLayoutButtonModifier) => MessageLayoutButtonModifier;
