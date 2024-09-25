import { signOut as _signOut } from 'aws-amplify/auth';
import { useAuthenticator as _useAuthenticator, } from '@aws-amplify/ui-react-core';
// wrap and re-export `useAuthenticator` to replace state machine `signOut` with
// `aws-amplify/auth` version due to iOS specifc requirements for federated sign
// out handling with JS. On iOS sign out, JS prmnpts the end user with a native
// Alert requesting confirmation of sign out, if the end user cancels they will
// have already been signed out of the state machine, but will still be
// authenticated on the JS singleton
// input utility function to prevent breaking changes in consumers.
// State machine sign out handling does not pass input to underlying `signOut`
// call; replicate that behavior here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signOut = (data) => {
    _signOut();
};
export function useAuthenticator(selector) {
    return { ..._useAuthenticator(selector), signOut };
}
