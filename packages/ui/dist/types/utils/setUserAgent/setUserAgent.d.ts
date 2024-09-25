export type PackageName = 'angular' | 'react' | 'react-auth' | 'react-geo' | 'react-liveness' | 'react-native' | 'react-native-auth' | 'react-notifications' | 'react-storage' | 'vue';
export type ComponentName = 'Authenticator' | 'ChangePassword' | 'DeleteUser' | 'FaceLivenessDetector' | 'FileUploader' | 'InAppMessaging' | 'LocationSearch' | 'MapView' | 'StorageManager' | 'StorageImage';
export type Version = `${string}.${string}.${string}`;
export interface SetUserAgentOptions {
    componentName: ComponentName;
    packageName: PackageName;
    version: Version;
}
/**
 * @example
 * ```ts
 * // set user agent options
 * const clear = setUserAgent(input);
 *
 * // clear user agent options
 * clear();
 * ```
 */
export declare const setUserAgent: ({ componentName, packageName, version, }: SetUserAgentOptions) => (() => void);
