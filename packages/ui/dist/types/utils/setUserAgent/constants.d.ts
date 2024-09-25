import { AuthUserAgentInput, GeoUserAgentInput, InAppMessagingUserAgentInput, StorageUserAgentInput } from '@aws-amplify/core/internals/utils';
export declare const ACCOUNT_SETTINGS_INPUT_BASE: Omit<AuthUserAgentInput, 'additionalDetails'>;
export declare const AUTHENTICATOR_INPUT_BASE: Omit<AuthUserAgentInput, 'additionalDetails'>;
export declare const FILE_UPLOADER_BASE_INPUT: Omit<StorageUserAgentInput, 'additionalDetails'>;
export declare const IN_APP_MESSAGING_INPUT_BASE: Omit<InAppMessagingUserAgentInput, 'additionalDetails'>;
export declare const LOCATION_SEARCH_INPUT_BASE: Omit<GeoUserAgentInput, 'additionalDetails'>;
export declare const MAP_VIEW_INPUT_BASE: Omit<GeoUserAgentInput, 'additionalDetails'>;
export declare const STORAGE_MANAGER_INPUT_BASE: Omit<StorageUserAgentInput, 'additionalDetails'>;