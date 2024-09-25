import { AuthAction, Category, StorageAction, InAppMessagingAction, GeoAction } from '@aws-amplify/core/internals/utils';

const ACCOUNT_SETTINGS_INPUT_BASE = {
    apis: [AuthAction.DeleteUser, AuthAction.UpdatePassword],
    category: Category.Auth,
};
const AUTHENTICATOR_INPUT_BASE = {
    apis: [
        AuthAction.SignUp,
        AuthAction.ConfirmSignUp,
        AuthAction.ResendSignUpCode,
        AuthAction.SignIn,
        AuthAction.ConfirmSignIn,
        AuthAction.FetchUserAttributes,
        AuthAction.SignOut,
        AuthAction.ResetPassword,
        AuthAction.ConfirmResetPassword,
        AuthAction.SignInWithRedirect,
    ],
    category: Category.Auth,
};
const FILE_UPLOADER_BASE_INPUT = {
    apis: [StorageAction.UploadData],
    category: Category.Storage,
};
const IN_APP_MESSAGING_INPUT_BASE = {
    apis: [InAppMessagingAction.NotifyMessageInteraction],
    category: Category.InAppMessaging,
};
const LOCATION_SEARCH_INPUT_BASE = {
    category: Category.Geo,
    apis: [
        GeoAction.SearchByText,
        GeoAction.SearchForSuggestions,
        GeoAction.SearchByPlaceId,
    ],
};
const MAP_VIEW_INPUT_BASE = {
    category: Category.Geo,
    apis: [],
};
const STORAGE_MANAGER_INPUT_BASE = {
    apis: [StorageAction.UploadData],
    category: Category.Storage,
};

export { ACCOUNT_SETTINGS_INPUT_BASE, AUTHENTICATOR_INPUT_BASE, FILE_UPLOADER_BASE_INPUT, IN_APP_MESSAGING_INPUT_BASE, LOCATION_SEARCH_INPUT_BASE, MAP_VIEW_INPUT_BASE, STORAGE_MANAGER_INPUT_BASE };