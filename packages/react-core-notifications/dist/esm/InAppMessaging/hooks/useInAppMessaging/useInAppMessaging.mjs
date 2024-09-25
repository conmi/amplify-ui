import { useContext } from 'react';
import InAppMessagingContext from '../../context/InAppMessagingContext/InAppMessagingContext.mjs';
import 'aws-amplify/in-app-messaging';

/**
 * Utility hook used to access the InAppMessagingContext values
 *
 * @returns {InAppMessagingContextType} InAppMessaging context values
 */
function useInAppMessaging() {
    const inAppMessagingContext = useContext(InAppMessagingContext);
    if (!inAppMessagingContext) {
        throw new Error('InAppMessagingContext is empty, did you forget the InAppMessagingProvider?');
    }
    return inAppMessagingContext;
}

export { useInAppMessaging as default };