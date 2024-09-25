import { InAppMessageImage } from '@aws-amplify/ui-react-core-notifications';
import { UseMessageImage } from './types';
/**
 * Handles prefetching for message images
 *
 * @param image contains image source
 * @returns message image dimensions and fetching related booleans
 */
export default function useMessageImage(image: InAppMessageImage | undefined): UseMessageImage;