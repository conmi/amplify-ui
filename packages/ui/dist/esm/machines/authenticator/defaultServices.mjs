import { Amplify } from 'aws-amplify';
import { getCurrentUser, signIn, signUp, confirmSignIn, confirmSignUp, confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import 'aws-amplify/utils';
import '@aws-amplify/core/internals/utils';
import '../../utils/setUserAgent/constants.mjs';
import '../../types/authenticator/user.mjs';
import '../../types/authenticator/attributes.mjs';
import { hasSpecialChars } from '../../helpers/authenticator/utils.mjs';
import '../../helpers/accountSettings/utils.mjs';

// Cognito does not allow a password length less then 8 characters
const DEFAULT_COGNITO_PASSWORD_MIN_LENGTH = 8;
const isInvalidUserAtributes = (userAttributes) => Array.isArray(userAttributes);
const parseUserAttributes = (userAttributes) => {
    if (!userAttributes) {
        return undefined;
    }
    // `aws-amplify` versions <= 6.0.5 return an array of `userAttributes` rather than an object
    if (isInvalidUserAtributes(userAttributes)) {
        return Object.entries(userAttributes).map(([_, value]) => Object.keys(value)[0]);
    }
    return Object.keys(userAttributes);
};
const defaultServices = {
    async getAmplifyConfig() {
        const result = Amplify.getConfig();
        const cliConfig = result.Auth?.Cognito;
        const { loginWith, userAttributes } = result.Auth?.Cognito ?? {};
        const parsedLoginMechanisms = loginWith
            ? Object.entries(loginWith)
                .filter(([key, _value]) => key !== 'oauth')
                .filter(([_key, value]) => !!value)
                .map((keyValueArray) => {
                return keyValueArray[0] === 'phone' // the key for phone_number is phone in getConfig but everywhere else we treat is as phone_number
                    ? 'phone_number'
                    : keyValueArray[0];
            })
            : undefined;
        const parsedSignupAttributes = parseUserAttributes(userAttributes);
        const parsedSocialProviders = loginWith?.oauth?.providers
            ? loginWith.oauth.providers?.map((provider) => provider.toString().toLowerCase())
            : undefined;
        return {
            ...cliConfig,
            loginMechanisms: parsedLoginMechanisms,
            signUpAttributes: parsedSignupAttributes,
            socialProviders: parsedSocialProviders,
        };
    },
    getCurrentUser,
    handleSignIn: signIn,
    handleSignUp: signUp,
    handleConfirmSignIn: confirmSignIn,
    handleConfirmSignUp: confirmSignUp,
    handleForgotPasswordSubmit: confirmResetPassword,
    handleForgotPassword: resetPassword,
    // Validation hooks for overriding
    async validateCustomSignUp(formData, touchData) { },
    async validateFormPassword(formData, touchData, passwordSettings) {
        const { password } = formData;
        const { password: touched_password } = touchData;
        /**
         * If the password is not touched,
         * or if the password settings are not set, we don't need to validate it.
         */
        if (!touched_password || !passwordSettings)
            return null;
        const password_complexity = [];
        const policyMinLength = passwordSettings.minLength ?? DEFAULT_COGNITO_PASSWORD_MIN_LENGTH;
        if (password.length < policyMinLength) {
            password_complexity.push(`Password must have at least ${policyMinLength} characters`);
        }
        if (passwordSettings.requireLowercase && !/[a-z]/.test(password))
            password_complexity.push('Password must have lower case letters');
        if (passwordSettings.requireUppercase && !/[A-Z]/.test(password))
            password_complexity.push('Password must have upper case letters');
        if (passwordSettings.requireNumbers && !/[0-9]/.test(password))
            password_complexity.push('Password must have numbers');
        // https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html
        if (passwordSettings.requireSpecialCharacters && !hasSpecialChars(password))
            password_complexity.push('Password must have special characters');
        /**
         * Only return an error if there is at least one error.
         */
        return password_complexity.length !== 0
            ? { password: password_complexity }
            : null;
    },
    async validateConfirmPassword(formData, touchData) {
        const { password, confirm_password } = formData;
        const { confirm_password: touched_confirm_password, password: touched_password, } = touchData;
        if (!password && !confirm_password) {
            // these inputs are clean, don't complain yet
            return null;
        }
        else if ((password || confirm_password) &&
            password !== confirm_password &&
            ((touched_confirm_password && touched_password) ||
                (password?.length >= 6 && confirm_password?.length >= 6))) {
            // Only return an error if both fields have text entered,
            // the passwords do not match, and the fields have been
            // touched or the password and confirm password is longer then or equal to 6.
            return {
                confirm_password: 'Your passwords must match',
            };
        }
    },
    async validatePreferredUsername(formData, touchData) { },
};

export { defaultServices };