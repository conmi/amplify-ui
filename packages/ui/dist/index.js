'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils$1 = require('aws-amplify/utils');
var utils = require('@aws-amplify/core/internals/utils');
var auth = require('aws-amplify/auth');
var awsAmplify = require('aws-amplify');
var xstate = require('xstate');
var pickBy = require('lodash/pickBy.js');
var merge = require('lodash/merge.js');
var kebabCase = require('lodash/kebabCase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var pickBy__default = /*#__PURE__*/_interopDefaultLegacy(pickBy);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);
var kebabCase__default = /*#__PURE__*/_interopDefaultLegacy(kebabCase);

/**
 * This file contains helpers that lets you easily access current actor's state
 * and context.
 */
/**
 * Get the state of current actor. This is useful for checking which screen
 * to render: e.g. `getActorState(state).matches('confirmSignUp.edit').
 */
const getActorState = (state) => {
    return state.context.actorRef?.getSnapshot();
};
/**
 * Get the context of current actor. Useful for getting any nested context
 * like remoteError.
 */
const getActorContext$1 = (state) => {
    return getActorState(state)?.context;
};

const ACCOUNT_SETTINGS_INPUT_BASE = {
    apis: [utils.AuthAction.DeleteUser, utils.AuthAction.UpdatePassword],
    category: utils.Category.Auth,
};
const AUTHENTICATOR_INPUT_BASE = {
    apis: [
        utils.AuthAction.SignUp,
        utils.AuthAction.ConfirmSignUp,
        utils.AuthAction.ResendSignUpCode,
        utils.AuthAction.SignIn,
        utils.AuthAction.ConfirmSignIn,
        utils.AuthAction.FetchUserAttributes,
        utils.AuthAction.SignOut,
        utils.AuthAction.ResetPassword,
        utils.AuthAction.ConfirmResetPassword,
        utils.AuthAction.SignInWithRedirect,
    ],
    category: utils.Category.Auth,
};
const FILE_UPLOADER_BASE_INPUT = {
    apis: [utils.StorageAction.UploadData],
    category: utils.Category.Storage,
};
const IN_APP_MESSAGING_INPUT_BASE = {
    apis: [utils.InAppMessagingAction.NotifyMessageInteraction],
    category: utils.Category.InAppMessaging,
};
const LOCATION_SEARCH_INPUT_BASE = {
    category: utils.Category.Geo,
    apis: [
        utils.GeoAction.SearchByText,
        utils.GeoAction.SearchForSuggestions,
        utils.GeoAction.SearchByPlaceId,
    ],
};
const MAP_VIEW_INPUT_BASE = {
    category: utils.Category.Geo,
    apis: [],
};
const STORAGE_MANAGER_INPUT_BASE = {
    apis: [utils.StorageAction.UploadData],
    category: utils.Category.Storage,
};

/**
 * Some libraries may not follow Node ES module spec and could be loaded as CommonJS modules,
 * To ensure the interoperability between ESM and CJS, modules from those libraries have to be loaded via namespace import
 * And sanitized by the function below because unlike ESM namespace, CJS namespace set `module.exports` object on the `default` key
 * https://nodejs.org/api/esm.html#interoperability-with-commonjs
 */
const sanitizeNamespaceImport = (namespaceModule) => {
    const sanitizedNamespaceModule = { default: undefined, ...namespaceModule };
    return sanitizedNamespaceModule.default ?? sanitizedNamespaceModule;
};
/**
 * Checks if `value` is an Object (non-primitive, non-array, non-function)
 * Will return false for Arrays and functions
 *
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is an object, `false` otherwise
 */
function isObject(value) {
    return value != null && !Array.isArray(value) && typeof value === 'object';
}
/**
 * Checks if `value` is a string primitive or object
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is a string, `false` otherwise
 */
function isString(value) {
    return (typeof value === 'string' ||
        (typeof value === 'object' &&
            Object.prototype.toString.call(value) === '[object String]'));
}
/**
 * Checks if `value` is a Map
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is a Map, `false` otherwise
 */
function isMap(value) {
    return (isObject(value) && Object.prototype.toString.call(value) === '[object Map]');
}
/**
 * Checks if `value` is a Set
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is a Set, `false` otherwise
 */
function isSet(value) {
    return (isObject(value) && Object.prototype.toString.call(value) === '[object Set]');
}
/**
 * Checks if `value` is undefined
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is undefined, `false` otherwise
 */
function isUndefined(value) {
    return value === undefined;
}
/**
 * Checks if `value` is nullish
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is nullish, `false` otherwise
 */
function isNil(value) {
    return value == null;
}
/**
 * Checks if `value` is empty
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is empty, `false` otherwise
 */
function isEmpty(value) {
    if (value === null || value === undefined)
        return true;
    if (isObject(value) && (isMap(value) || isSet(value))) {
        return !value.size;
    }
    if (isObject(value) && (isString(value) || Array.isArray(value))) {
        return !value.length;
    }
    for (const key in value) {
        if (has(value, key)) {
            return false;
        }
    }
    return true;
}
/**
 * Checks if `value` is an empty array
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is a empty, `false` otherwise
 */
function isEmptyArray(value) {
    return Array.isArray(value) && isEmpty(value);
}
/**
 * Checks if all members of the `values` param are empty arrays
 *
 * @param {unknown} value The values to check
 * @returns {boolean} Returns `true` if all members of `values` are empty, `false` otherwise
 */
function areEmptyArrays(...values) {
    return values.every(isEmptyArray);
}
/**
 * Checks if `value` is an empty object
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Returns `true` if `value` is empty, `false` otherwise
 */
function isEmptyObject(value) {
    return isObject(value) && isEmpty(value);
}
/**
 * Checks if all members of the `values` param are empty objects
 *
 * @param {unknown} values The values to check
 * @returns {boolean} Returns `true` if all members of the `values` param are empty, `false` otherwise
 */
function areEmptyObjects(...values) {
    return values.every(isEmptyObject);
}
/**
 * Capitalizes `value` and its return type
 *
 * @param {string} value string to capitalize
 * @returns {string} capitalized string
 */
function capitalize(value) {
    return (isString(value) ? value.charAt(0).toUpperCase() + value.slice(1) : '');
}
/**
 * Checks if `key` is a direct property of `value`
 *
 * @param {unknown} value `object` potentially containing property
 * @param {string} key property key
 * @returns whether `key` param is a property of the `obj` param
 */
function has(value, key) {
    return value != null && Object.prototype.hasOwnProperty.call(value, key);
}
/**
 * Checks if `value` is a function
 *
 * @param {unknown} value param to check
 * @returns {boolean} whether `value` is a function
 */
function isFunction(value) {
    return typeof value === 'function';
}
/**
 * This helper function creates modifier class names that are used for our flat BEM styling
 * it takes in a base and modifier and returns the modified class if a modifier was passed in and null otherwise
 * @param base The base class of the output
 * @param modifier The modifier to add onto the base
 * @returns the modified class name or empty string
 */
const classNameModifier = (base, modifier) => {
    return modifier ? `${base}--${modifier}` : '';
};
/**
 * This helper function creates modified class names that are used for our flat BEM styling
 * it takes in a base, modifier, and flag and returns the modified class name if the flag is true and null if the flag is false
 * @param base
 * @param modifier
 * @param flag
 * @returns the modified class name or empty string
 */
const classNameModifierByFlag = (base, modifier, flag) => {
    return flag ? `${base}--${modifier}` : '';
};
/**
 * `isFunction` but types the param with its function signature
 *
 * @param {unknown} value param to check
 * @returns {boolean} whether `value` is a function
 */
function isTypedFunction(value) {
    return isFunction(value);
}
/**
 * Similar to `Array.join`, with an optional callback/template param
 * for formatting returned string values
 *
 * @param {string[]} values string array
 * @param {(value: string) => string} template callback format param
 * @returns formatted string array
 */
function templateJoin(values, template) {
    return values.reduce((acc, curr) => `${acc}${isString(curr) ? template(curr) : ''}`, '');
}
/**
 * A function that does nothing
 *
 * @param {any[]} _ accepts any parameters
 * @returns nothing
 */
function noop(..._) {
    return;
}
/**
 * @param {string} groupName name of group
 * @param events string values related to group
 */
function groupLog(groupName, ...events) {
    const hasEvents = !!events?.length;
    if (hasEvents) {
        // eslint-disable-next-line no-console
        console.groupCollapsed(groupName);
        events?.forEach((event) => {
            // eslint-disable-next-line no-console
            console.log(event);
        });
        // eslint-disable-next-line no-console
        console.groupEnd();
    }
    else {
        // eslint-disable-next-line no-console
        console.log(groupName);
    }
}
/**
 * Splits an object into 2 objects based on a predicate
 *
 * @param {object} obj an object to split into two
 * @param {function} predicate function to determin where an element should go
 * @returns
 */
function splitObject(obj, predicate) {
    const left = {};
    const right = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (predicate(key)) {
            left[key] = value;
        }
        else {
            right[key] = value;
        }
    });
    return [left, right];
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
const setUserAgent = ({ componentName, packageName, version, }) => {
    const packageData = [`ui-${packageName}`, version];
    switch (componentName) {
        case 'Authenticator': {
            utils.setCustomUserAgent({
                ...AUTHENTICATOR_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'ChangePassword':
        case 'DeleteUser': {
            utils.setCustomUserAgent({
                ...ACCOUNT_SETTINGS_INPUT_BASE,
                additionalDetails: [['AccountSettings'], packageData],
            });
            break;
        }
        case 'FileUploader': {
            utils.setCustomUserAgent({
                ...FILE_UPLOADER_BASE_INPUT,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'InAppMessaging': {
            utils.setCustomUserAgent({
                ...IN_APP_MESSAGING_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'LocationSearch': {
            utils.setCustomUserAgent({
                ...LOCATION_SEARCH_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'MapView': {
            utils.setCustomUserAgent({
                ...MAP_VIEW_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'StorageManager': {
            utils.setCustomUserAgent({
                ...STORAGE_MANAGER_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
    }
    return noop;
};

const classNames = (...args) => {
    const classes = [];
    for (const arg of args) {
        // skip falsey values
        if (!arg) {
            continue;
        }
        if (isString(arg)) {
            classes.push(arg);
            continue;
        }
        if (typeof arg === 'number') {
            classes.push(arg.toString());
            continue;
        }
        if (Array.isArray(arg)) {
            classes.push(classNames(...arg));
            continue;
        }
        if (isObject(arg)) {
            // check if the object has a valid .toString() method
            if (arg.toString !== Object.prototype.toString &&
                arg.toString() !== '[object Object]') {
                classes.push(arg.toString());
                continue;
            }
            for (const key in arg) {
                if (has(arg, key) && arg[key]) {
                    classes.push(key);
                }
            }
        }
    }
    return classes.join(' ');
};

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`;
    }
    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let unit = -1;
    const range = 10 ** dp;
    do {
        bytes /= thresh;
        ++unit;
    } while (Math.round(Math.abs(bytes) * range) / range >= thresh &&
        unit < units.length - 1);
    return bytes.toFixed(dp) + ' ' + units[unit];
}

/**
 * Handles Amplify JS Auth hub events, by forwarding hub events as appropriate
 * xstate events.
 */
const defaultAuthHubHandler = ({ payload }, service, options) => {
    const { event } = payload;
    const { send } = service;
    const { onSignIn, onSignOut } = options ?? {};
    switch (event) {
        case 'signedIn': {
            if (isFunction(onSignIn)) {
                onSignIn(payload);
            }
            break;
        }
        case 'signInWithRedirect': {
            send('SIGN_IN_WITH_REDIRECT');
            break;
        }
        case 'signedOut':
        case 'tokenRefresh_failure': {
            if (event === 'signedOut' && isFunction(onSignOut)) {
                onSignOut();
            }
            send('SIGN_OUT');
            break;
        }
    }
};
/**
 * Listens to external auth Hub events and sends corresponding event to
 * the `service.send` of interest
 *
 * @param service - contains state machine `send` function
 * @param handler - auth event handler
 * @returns function that unsubscribes to the hub evenmt
 */
const listenToAuthHub = (service, handler = defaultAuthHubHandler) => {
    const eventHandler = (data) => handler(data, service);
    return utils$1.Hub.listen('auth', eventHandler, 'authenticator-hub-handler');
};

const countryDialCodes = [
    '+1',
    '+7',
    '+20',
    '+27',
    '+30',
    '+31',
    '+32',
    '+33',
    '+34',
    '+36',
    '+39',
    '+40',
    '+41',
    '+43',
    '+44',
    '+45',
    '+46',
    '+47',
    '+48',
    '+49',
    '+51',
    '+52',
    '+53',
    '+54',
    '+55',
    '+56',
    '+57',
    '+58',
    '+60',
    '+61',
    '+62',
    '+63',
    '+64',
    '+65',
    '+66',
    '+81',
    '+82',
    '+84',
    '+86',
    '+90',
    '+91',
    '+92',
    '+93',
    '+94',
    '+95',
    '+98',
    '+212',
    '+213',
    '+216',
    '+218',
    '+220',
    '+221',
    '+222',
    '+223',
    '+224',
    '+225',
    '+226',
    '+227',
    '+228',
    '+229',
    '+230',
    '+231',
    '+232',
    '+233',
    '+234',
    '+235',
    '+236',
    '+237',
    '+238',
    '+239',
    '+240',
    '+241',
    '+242',
    '+243',
    '+244',
    '+245',
    '+246',
    '+248',
    '+249',
    '+250',
    '+251',
    '+252',
    '+253',
    '+254',
    '+255',
    '+256',
    '+257',
    '+258',
    '+260',
    '+261',
    '+262',
    '+263',
    '+264',
    '+265',
    '+266',
    '+267',
    '+268',
    '+269',
    '+290',
    '+291',
    '+297',
    '+298',
    '+299',
    '+345',
    '+350',
    '+351',
    '+352',
    '+353',
    '+354',
    '+355',
    '+356',
    '+357',
    '+358',
    '+359',
    '+370',
    '+371',
    '+372',
    '+373',
    '+374',
    '+375',
    '+376',
    '+377',
    '+378',
    '+379',
    '+380',
    '+381',
    '+382',
    '+385',
    '+386',
    '+387',
    '+389',
    '+420',
    '+421',
    '+423',
    '+500',
    '+501',
    '+502',
    '+503',
    '+504',
    '+505',
    '+506',
    '+507',
    '+508',
    '+509',
    '+537',
    '+590',
    '+591',
    '+593',
    '+594',
    '+595',
    '+596',
    '+597',
    '+598',
    '+599',
    '+670',
    '+672',
    '+673',
    '+674',
    '+675',
    '+676',
    '+677',
    '+678',
    '+679',
    '+680',
    '+681',
    '+682',
    '+683',
    '+685',
    '+686',
    '+687',
    '+688',
    '+689',
    '+690',
    '+691',
    '+692',
    '+850',
    '+852',
    '+853',
    '+855',
    '+856',
    '+872',
    '+880',
    '+886',
    '+960',
    '+961',
    '+962',
    '+963',
    '+964',
    '+965',
    '+966',
    '+967',
    '+968',
    '+970',
    '+971',
    '+972',
    '+973',
    '+974',
    '+975',
    '+976',
    '+977',
    '+992',
    '+993',
    '+994',
    '+995',
    '+996',
    '+998',
];

const deDict$1 = {
    'Account recovery requires verified contact information': 'Zurücksetzen des Accounts benötigt einen verifizierten Account',
    'Add your Profile': 'Ihr Profil hinzufügen',
    'Add your Website': 'Ihre Website hinzufügen',
    'Back to Sign In': 'Zurück zur Anmeldung',
    'Change Password': 'Passwort ändern',
    Changing: 'Ändern von',
    Code: 'Code',
    'Confirm Password': 'Passwort bestätigen',
    'Please confirm your Password': 'Bitte bestätigen Sie Ihr Passwort',
    'Confirm Sign Up': 'Registrierung bestätigen',
    'Confirm SMS Code': 'SMS-Code bestätigen',
    'Confirm TOTP Code': 'TOTP-Code bestätigen',
    Confirm: 'Bestätigen',
    'Confirmation Code': 'Bestätigungs-Code',
    Confirming: 'Wird bestätigt',
    'Create a new account': 'Einen neuen Account erstellen',
    'Create Account': 'Account erstellen',
    'Creating Account': 'Account wird erstellt',
    'Dismiss alert': 'Warnung verwerfen',
    Email: 'E-Mail',
    'Enter your Birthdate': 'Geben Sie Ihr Geburtsdatum ein',
    'Enter your code': 'Geben Sie Ihren Code ein',
    'Enter your Confirmation Code': 'Geben Sie Ihren Bestätigungs-Code ein',
    'Enter your Email': 'Geben Sie Ihre E-Mail ein',
    'Enter your Family Name': 'Geben Sie Ihren Nachnamen ein',
    'Enter your Given Name': 'Geben Sie Ihren Vornamen ein',
    'Enter your Middle Name': 'Geben Sie Ihren zweiten Vornamen ein',
    'Enter your Name': 'Geben Sie Ihren Namen ein',
    'Enter your Nickname': 'Geben Sie Ihren Spitznamen ein',
    'Enter your Password': 'Geben Sie Ihr Passwort ein',
    'Enter your password': 'Geben Sie Ihr Passwort ein',
    'Enter your email': 'Geben Sie Ihre E-Mail ein',
    'Enter your phone number': 'Geben Sie Ihre Telefonnummer ein',
    'Enter your Preferred Username': 'Geben Sie Ihren bevorzugten Benutzernamen ein',
    'Enter your username': 'Geben Sie Ihren Benutzernamen ein',
    'Forgot password?': 'Passwort vergessen?',
    'Forgot your password?': 'Passwort vergessen? ',
    'Hide password': 'Passwort verbergen',
    'It may take a minute to arrive': 'Es kann eine Minute dauern, bis er ankommt',
    Loading: 'Wird geladen',
    'New password': 'Neues Passwort',
    or: 'oder',
    Password: 'Passwort',
    'Phone Number': 'Telefonnummer',
    'Resend Code': 'Code erneut senden',
    'Reset your Password': 'Zurücksetzen des Passworts',
    'Reset your password': 'Zurücksetzen des passworts',
    'Send code': 'Code senden',
    'Send Code': 'Code senden',
    Sending: 'Wird gesendet',
    'Setup TOTP': 'TOTP einrichten',
    'Show password': 'Passwort anzeigen',
    'Sign in to your account': 'Melden Sie sich mit Ihrem Account an',
    'Sign In with Amazon': 'Mit Amazon anmelden',
    'Sign In with Apple': 'Mit Apple anmelden',
    'Sign In with Facebook': 'Mit Facebook anmelden',
    'Sign In with Google': 'Mit Google anmelden',
    'Sign in': 'Anmelden',
    'Sign In': 'Anmelden',
    'Signing in': 'Wird angemeldet',
    Skip: 'Überspringen',
    Submit: 'Abschicken',
    Submitting: 'Wird gesendet',
    Username: 'Benutzername',
    'Verify Contact': 'Kontakt verifizieren',
    Verify: 'Verifizieren',
    'We Emailed You': 'E-Mail wurde versendet',
    'We Sent A Code': 'Wir haben einen Code gesendet',
    'We Texted You': 'Wir haben Ihnen eine SMS gesendet',
    'Your code is on the way. To log in, enter the code we emailed to': 'Ihr Bestätigungscode ist unterwegs. Um sich einzuloggen geben Sie den Code ein, den wir per E-Mail verschickt haben',
    'Your code is on the way. To log in, enter the code we sent you': 'Ihr Code ist unterwegs. Um sich anzumelden, geben Sie den Code ein, den wir Ihnen gesendet haben',
    'Your code is on the way. To log in, enter the code we texted to': 'Ihr Bestätigungscode ist unterwegs. Um sich einzuloggen geben Sie den Code ein, den wir per SMS verschickt haben',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Ein Account mit dieser E-Mail existiert bereits.',
    'Confirm a Code': 'Code bestätigen',
    'Confirm Sign In': 'Anmeldung bestätigen',
    'Create account': 'Hier registrieren',
    'Sign Up with Facebook': 'Mit Facebook registrieren',
    'Sign Up with Google': 'Mit Google registrieren',
    'Forgot Password': 'Passwort vergessen',
    'Have an account? ': 'Schon registriert? ',
    'Incorrect username or password': 'Falscher Benutzername oder falsches Passwort',
    'Invalid password format': 'Ungültiges Passwort-Format',
    'Invalid phone number format': `Ungültiges Telefonummern-Format. Benutze eine Nummer im Format: +12345678900`,
    'It may take a minute to arrive.': 'Es könnte eine Minute dauern, bis der Code eintrifft.',
    'Lost your code? ': 'Code verloren? ',
    'New Password': 'Neues Passwort',
    'No account? ': 'Kein Account? ',
    'Password attempts exceeded': 'Die maximale Anzahl der fehlerhaften Anmeldeversuche wurde erreicht',
    'Reset password': 'Passwort zurücksetzen',
    'Reset Password': 'Passwort Zurücksetzen',
    'Sign Out': 'Abmelden',
    'Sign Up': 'Registrieren',
    'User already exists': 'Dieser Benutzer existiert bereits',
    'User does not exist': 'Dieser Benutzer existiert nicht',
    'Username cannot be empty': 'Benutzername darf nicht leer sein',
};

const enDict$1 = {
    'Account recovery requires verified contact information': 'Account recovery requires verified contact information',
    'Add your Profile': 'Add your Profile',
    'Add your Website': 'Add your Website',
    'Back to Sign In': 'Back to Sign In',
    'Change Password': 'Change Password',
    Changing: 'Changing',
    Code: 'Code',
    'Confirm Password': 'Confirm Password',
    'Confirm Sign Up': 'Confirm Sign Up',
    'Confirm SMS Code': 'Confirm SMS Code',
    'Confirm MFA Code': 'Confirm MFA Code',
    'Confirm TOTP Code': 'Confirm TOTP Code',
    Confirm: 'Confirm',
    'Confirmation Code': 'Confirmation Code',
    Confirming: 'Confirming',
    'Create a new account': 'Create a new account',
    'Create Account': 'Create Account',
    'Creating Account': 'Creating Account',
    'Dismiss alert': 'Dismiss alert',
    Email: 'Email',
    'Enter your Birthdate': 'Enter your Birthdate',
    'Enter your code': 'Enter your code',
    'Enter your Confirmation Code': 'Enter your Confirmation Code',
    'Enter your Email': 'Enter your Email',
    'Enter your Family Name': 'Enter your Family Name',
    'Enter your Given Name': 'Enter your Given Name',
    'Enter your Middle Name': 'Enter your Middle Name',
    'Enter your Name': 'Enter your Name',
    'Enter your Nickname': 'Enter your Nickname',
    'Enter your Password': 'Enter your Password',
    'Enter your phone number': 'Enter your phone number',
    'Enter your Preferred Username': 'Enter your Preferred Username',
    'Enter your username': 'Enter your username',
    'Forgot password?': 'Forgot password?',
    'Forgot your password?': 'Forgot your password?',
    'Hide password': 'Hide password',
    'It may take a minute to arrive': 'It may take a minute to arrive',
    Loading: 'Loading',
    'New password': 'New password',
    or: 'or',
    Password: 'Password',
    'Phone Number': 'Phone Number',
    'Please confirm your Password': 'Please confirm your Password',
    'Resend Code': 'Resend Code',
    'Reset your password': 'Reset your password',
    'Reset your Password': 'Reset your Password',
    'Send code': 'Send code',
    'Send Code': 'Send Code',
    Sending: 'Sending',
    'Setup TOTP': 'Setup TOTP',
    'Show password': 'Show password',
    'Sign in to your account': 'Sign in to your account',
    'Sign In with Amazon': 'Sign In with Amazon',
    'Sign In with Apple': 'Sign In with Apple',
    'Sign In with Facebook': 'Sign In with Facebook',
    'Sign In with Google': 'Sign In with Google',
    'Sign in': 'Sign in',
    'Sign In': 'Sign In',
    'Signing in': 'Signing in',
    Skip: 'Skip',
    Submit: 'Submit',
    Submitting: 'Submitting',
    Username: 'Username',
    'Verify Contact': 'Verify Contact',
    Verify: 'Verify',
    'We Emailed You': 'We Emailed You',
    'We Sent A Code': 'We Sent A Code',
    'We Texted You': 'We Texted You',
    'Your code is on the way. To log in, enter the code we emailed to': 'Your code is on the way. To log in, enter the code we emailed to',
    'Your code is on the way. To log in, enter the code we sent you': 'Your code is on the way. To log in, enter the code we sent you',
    'Your code is on the way. To log in, enter the code we texted to': 'Your code is on the way. To log in, enter the code we texted to',
};

const esDict$1 = {
    'Account recovery requires verified contact information': 'La recuperación de la cuenta requiere información de contacto verificada',
    'Back to Sign In': 'Volver a inicio de sesión',
    'Change Password': 'Cambiar contraseña',
    Changing: 'Cambiando',
    Code: 'Código',
    'Code *': 'Código *',
    'Confirm Password': 'Confirmar contraseña',
    'Confirm Sign Up': 'Confirmar registro',
    'Confirm SMS Code': 'Confirmar el código de SMS',
    'Confirm TOTP Code': 'Confirmar código TOTP',
    Confirm: 'Confirmar',
    'Confirmation Code': 'Código de confirmación',
    Confirming: 'Confirmando',
    'Create a new account': 'Crear una cuenta nueva',
    'Create Account': 'Crear cuenta',
    'Creating Account': 'Creando cuenta',
    'Dismiss alert': 'Descartar alerta',
    Email: 'Email',
    'Enter your code': 'Ingrese el código',
    'Enter your Email': 'Escriba su Email',
    'Enter your email': 'Escriba su email',
    'Enter your Password': 'Escriba su Contraseña',
    'Enter your phone number': 'Ingrese el número de teléfono',
    'Enter your username': 'Ingrese el nombre de usuario',
    'Forgot your password?': '¿Olvidó su contraseña?',
    'Hide password': 'Ocultar contraseña',
    'It may take a minute to arrive': 'Es posible que tarde un minuto en llegar',
    Loading: 'Cargando',
    'New password': 'Nueva contraseña',
    or: 'o',
    Password: 'Contraseña',
    'Phone Number': 'Número de teléfono',
    'Resend Code': 'Reenviar código',
    'Reset your password': 'Restablecer su contraseña',
    'Reset your Password': 'Restablecer su Contraseña',
    'Send code': 'Enviar código',
    'Send Code': 'Enviar código',
    Sending: 'Enviando',
    'Setup TOTP': 'Configurar TOTP',
    'Show password': 'Mostrar contraseña',
    'Sign in to your account': 'Iniciar sesión en tu cuenta',
    'Sign In with Amazon': 'Iniciar Sesión con Amazon',
    'Sign In with Apple': 'Iniciar Sesión con Apple',
    'Sign In with Facebook': 'Iniciar Sesión con Facebook',
    'Sign In with Google': 'Iniciar Sesión con Google',
    'Sign in': 'Iniciar sesión',
    'Sign In': 'Iniciar Sesión',
    'Signing in': 'Iniciando sesión',
    Skip: 'Omitir',
    Submit: 'Enviar',
    Submitting: 'Enviando',
    Username: 'Nombre de usuario',
    'Verify Contact': 'Verificar contacto',
    Verify: 'Verificar',
    'We Emailed You': 'Le hemos enviado un correo electrónico',
    'We Sent A Code': 'Hemos enviado un código',
    'We Texted You': 'Le hemos enviado un mensaje de texto',
    'Your code is on the way. To log in, enter the code we emailed to': 'El código está en camino. Para iniciar sesión, escriba el código que hemos enviado por correo electrónico a',
    'Your code is on the way. To log in, enter the code we sent you': 'El código está en camino. Para iniciar sesión, escriba el código que le hemos enviado',
    'Your code is on the way. To log in, enter the code we texted to': 'El código está en camino. Para iniciar sesión, escriba el código que hemos enviado por mensaje de texto a',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Ya existe una cuenta con el correo ingresado.',
    'Confirm a Code': 'Confirmar un código',
    'Confirm Sign In': 'Confirmar inicio de sesión',
    'Forgot Password': 'Olvidé mi contraseña',
    'Incorrect username or password.': 'Nombre de usuario o contraseña incorrecta',
    'Enter your Family Name': 'Escriba su apellido',
    'Enter your Given Name': 'Escriba su nombre',
    'Given Name': 'Nombre',
    'Family Name': 'Apellido',
    'Reset Password': 'Restablecer contraseña',
    'Please confirm your Password': 'Confirme su contraseña',
    'Invalid password format': 'Formato de contraseña inválido',
    'Invalid phone number format': 'Formato de número de teléfono inválido',
    'Loading...': 'Cargando...',
    'New Password': 'Nueva contraseña',
    'Resend a Code': 'Reenviar un código',
    'Sign Out': 'Cerrar sesión',
    'Sign Up with Amazon': 'Crear cuenta con Amazon',
    'Sign Up with Apple': 'Crear cuenta con Apple',
    'Sign Up with Facebook': 'Crear cuenta con Facebook',
    'Sign Up with Google': 'Crear cuenta con Google',
    'Sign Up': 'Crear cuenta',
    'User already exists': 'El usuario ya existe',
    'User does not exist': 'El usuario no existe',
    'Username/client id combination not found.': 'El usuario no existe',
    'Username cannot be empty': 'El nombre de usuario no puede estar vacío',
    'Your passwords must match': 'Las contraseñas deben coincidir',
    'Password must have at least 8 characters': 'La contraseña debe tener al menos 8 caracteres',
    'Password did not conform with policy: Password must have uppercase characters': 'La contraseña debe tener al menos un carácter en mayúscula',
    'Password did not conform with policy: Password must have numeric characters': 'La contraseña debe tener al menos un carácter numérico',
    'Password did not conform with policy: Password must have symbol characters': 'La contraseña debe tener al menos un símbolo',
    'Password did not conform with policy: Password must have lowercase characters': 'La contraseña debe tener al menos un carácter en minúsculas',
    'Invalid verification code provided, please try again.': 'Código de verificación no válido, inténtelo de nuevo.',
    'Attempt limit exceeded, please try after some time.': 'Número máximo de intentos excedido, por favor inténtelo de nuevo más tarde.',
    'A network error has occurred.': 'Se ha producido un error de red.'
};

const frDict$1 = {
    'Account recovery requires verified contact information': 'La récupération du compte nécessite des informations de contact vérifiées',
    'Back to Sign In': 'Retour à la connexion',
    'Change Password': 'Modifier le mot de passe',
    Changing: 'Modification en cours',
    Code: 'Code',
    'Confirm Password': 'Confirmez le mot de passe',
    'Confirm Sign Up': "Confirmer l'inscription",
    'Confirm SMS Code': 'Confirmer le code SMS',
    'Confirm TOTP Code': 'Confirmer le code TOTP',
    Confirm: 'Confirmer',
    'Confirmation Code': 'Code de confirmation',
    Confirming: 'Confirmation',
    'Create a new account': 'Créer un nouveau compte',
    'Create Account': 'Créer un compte',
    'Creating Account': `Création d'un compte`,
    'Dismiss alert': `Supprimer l'alerte`,
    Email: 'Email',
    'Enter your code': 'Saisissez cotre code de confirmation',
    'Enter your Email': 'Saisissez votre adresse e-mail',
    'Enter your email': 'Saisissez votre adresse e-mail',
    'Enter your phone number': 'Saisissez votre numéro de téléphone',
    'Enter your username': "Saisissez votre nom d'utilisateur",
    'Forgot your password?': 'Mot de passe oublié ? ',
    'Hide password': 'Masquer le mot de passe',
    'It may take a minute to arrive': 'Cela peut prendre une minute',
    Loading: 'Chargement en cours',
    'New password': 'Nouveau mot de passe',
    or: 'ou',
    Password: 'Mot de passe',
    'Phone Number': 'Numéro de téléphone',
    'Resend Code': 'Renvoyer le code',
    'Reset your Password': 'Réinitialiser votre mot de passe',
    'Reset your password': 'Réinitialisez votre mot de passe',
    'Send code': 'Envoyer le code',
    'Send Code': "M'envoyer un code",
    Sending: 'Envoi en cours',
    'Setup TOTP': 'Configuration de TOTP',
    'Show password': 'Afficher le mot de passe',
    'Sign in to your account': 'Connexion à votre compte',
    'Sign In with Amazon': 'Se connecter avec Amazon',
    'Sign In with Apple': 'Se connecter avec Apple',
    'Sign In with Facebook': 'Se connecter avec Facebook',
    'Sign In with Google': 'Se connecter avec Google',
    'Sign in': 'Se connecter',
    'Sign In': 'Se connecter',
    'Signing in': 'Connexion en cours',
    Skip: 'Passer',
    Submit: 'Soumettre',
    Submitting: 'Envoi en cours',
    Username: "Nom d'utilisateur",
    'Verify Contact': 'Vérifier le contact',
    Verify: 'Vérifier',
    'We Sent A Code': 'Nous avons envoyé un code',
    'We Texted You': 'Nous vous avons envoyé un SMS',
    'Your code is on the way. To log in, enter the code we sent you': `Votre code est en cours d'envoi. Pour vous connecter, saisissez le code que nous vous avons envoyé`,
    // Additional translations provided by customers
    'Add your Profile': 'Ajoutez votre profil',
    'Add your Website': 'Ajoutez votre site web',
    'An account with the given email already exists.': 'Un utilisateur avec cette adresse email existe déjà.',
    'Birthdate': 'Date de naissance',
    Change: 'Modifier',
    'Confirm a Code': 'Confirmer un code',
    'Confirm Sign In': 'Confirmer la connexion',
    'Create account': 'Créer un compte',
    'Enter your Birthdate': 'Saisissez votre date de naissance',
    'Enter your Confirmation Code': 'Saisissez votre code de confirmation',
    'Enter your Family Name': 'Saisissez votre nom de famille',
    'Enter your Given Name': 'Saisissez votre prénom',
    'Enter your Middle Name': 'Saisissez votre deuxième prénom',
    'Enter your Name': 'Saisissez votre nom',
    'Enter your Nickname': 'Saisissez votre surnom',
    'Enter your Password': 'Saisissez votre mot de passe',
    'Enter your Phone Number': 'Saisissez votre numéro de téléphone',
    'Enter your Preferred Username': "Saisissez votre nom d'utilisateur",
    'Enter your password': 'Saisissez votre mot de passe',
    'Given Name': 'Prénom',
    'Family Name': 'Nom de famille',
    'Forgot Password': 'Mot de passe oublié',
    'Forgot Password?': 'Mot de passe oublié ?',
    'Incorrect username or password.': 'Identifiant ou mot de passe incorrect.',
    'Have an account? ': 'Déjà un compte ? ',
    Hello: 'Bonjour',
    'Incorrect username or password': 'Identifiant ou mot de passe incorrect',
    'Invalid password format': 'Format de mot de passe invalide',
    'Invalid phone number format': `Format de numéro de téléphone invalide. Veuillez utiliser un format +12345678900`,
    'Loading...': 'Chargement...',
    'Lost your code? ': 'Vous avez perdu votre code ? ',
    'Network error': 'Erreur réseau',
    'New Password': 'Nouveau mot de passe',
    'Name': 'Nom',
    'No account? ': 'Pas de compte ? ',
    'Please confirm your Password': 'Confirmez votre mot de passe',
    'Preferred Username': "Nom d'utilisateur préféré",
    'Profile': 'Profil',
    'Resend a Code': 'Renvoyer un code',
    'Reset password': 'Réinitialiser le mot de passe',
    'Reset Password': 'Réinitialiser le mot de passe',
    Send: 'Envoyer',
    'Sign In with AWS': 'Se connecter avec AWS',
    'Sign Out': 'Déconnexion',
    'Sign Up': "S'inscrire",
    SMS: 'SMS',
    'User already exists': "L'utilisateur existe déjà",
    'User does not exist': "L'utilisateur n'existe pas",
    'Username cannot be empty': "Le nom d'utilisateur doit être renseigné",
    'Username/client id combination not found.': "L'utilisateur n'existe pas",
    'We Emailed You': 'Nous vous avons envoyé un code',
    'Your code is on the way. To log in, enter the code we emailed to': 'Votre code est en route. Pour vous connecter entrez le code reçu sur cette adresse email',
    'Your code is on the way. To log in, enter the code we texted to': 'Votre code est en route. Pour vous connecter entrez le code reçu sur ce numéro de téléphone',
    'Your passwords must match': 'Vos mots de passe doivent être identiques',
    'It may take a minute to arrive.': 'Cela peut prendre quelques minutes.',
    'Website': 'Site web',
    'Password must have at least 8 characters': 'Le mot de passe doit comporter au moins 8 caractères',
    'Password did not conform with policy: Password must have uppercase characters': 'Le mot de passe doit comporter des caractères majuscules',
    'Password did not conform with policy: Password must have numeric characters': 'Le mot de passe doit comporter des caractères numériques',
    'Password did not conform with policy: Password must have symbol characters': 'Le mot de passe doit comporter des symboles',
    'Password did not conform with policy: Password must have lowercase characters': 'Le mot de passe doit comporter des caractères minuscules',
    'Invalid verification code provided, please try again.': 'Code de vérification invalide, veuillez réessayer.',
    'Attempt limit exceeded, please try after some time.': 'Nombre maximum de tentatives dépassé, veuillez réessayer plus tard.',
    'A network error has occurred.': "Une erreur de réseau s'est produite."
};

const itDict$1 = {
    'Account recovery requires verified contact information': "Il ripristino dell'account richiede informazioni di contatto verificate",
    'Back to Sign In': 'Torna alla schermata di accesso',
    'Change Password': 'Cambia la password',
    Changing: 'Modifica in corso',
    Code: 'Codice',
    'Confirm Password': 'Conferma la password',
    'Confirm Sign Up': 'Conferma registrazione',
    'Confirm SMS Code': 'Conferma codice SMS',
    'Confirm TOTP Code': 'Conferma codice TOTP',
    Confirm: 'Conferma',
    'Confirmation Code': 'Codice di verifica',
    Confirming: 'Conferma in corso',
    'Create a new account': 'Crea un nuovo account',
    'Create Account': 'Crea Account',
    'Creating Account': 'Creazione account in corso',
    'Dismiss alert': `Ignora l'avviso`,
    Email: 'Email',
    'Enter your code': 'Inserisci il tuo codice',
    'Enter your Email': 'Inserisci la tua e-mail',
    'Enter your phone number': 'Inserisci il tuo numero di telefono"',
    'Enter your username': 'Inserisci il tuo nome utente',
    'Forgot your password?': 'Password dimenticata?',
    'Hide password': 'Nascondi password',
    'It may take a minute to arrive': "L'arrivo potrebbe richiedere qualche minuto",
    Loading: 'Caricamento in corso',
    'New password': 'Nuova password',
    or: 'oppure',
    Password: 'Password',
    'Phone Number': 'Numero di telefono',
    'Resend Code': 'Invia nuovamente il codice',
    'Reset your Password': 'Reimposta la tua Password',
    'Reset your password': 'Reimposta la tua password',
    'Send code': 'Invia codice',
    'Send Code': 'Invia codice',
    Sending: 'Invio in corso',
    'Setup TOTP': 'Configura TOTP',
    'Show password': 'Mostra password',
    'Sign in to your account': 'Accedi al tuo account',
    'Sign In with Amazon': 'Accedi con Amazon',
    'Sign In with Apple': 'Accedi con Apple',
    'Sign In with Facebook': 'Accedi con Facebook',
    'Sign In with Google': 'Accedi con Google',
    'Sign in': 'Accedi',
    'Sign In': 'Accedi',
    'Signing in': 'Accesso in corso',
    Skip: 'Salta',
    Submit: 'Invia',
    Submitting: 'Invio in corso',
    Username: 'Nome utente',
    'Verify Contact': 'Verifica contatto',
    Verify: 'Verifica',
    'We Emailed You': "Ti abbiamo inviato un'e-mail",
    'We Sent A Code': 'Ti abbiamo inviato un codice',
    'We Texted You': 'Ti abbiamo inviato un SMS',
    'Your code is on the way. To log in, enter the code we emailed to': "Il codice è in arrivo. Per effettuare l'accesso, immetti il codice che ti abbiamo inviato via e-mail",
    'Your code is on the way. To log in, enter the code we sent you': 'Il codice è in arrivo. Per accedere, immetti il codice che ti abbiamo inviato',
    'Your code is on the way. To log in, enter the code we texted to': 'Il codice è in arrivo. Per accedere, immetti il codice che abbiamo inviato tramite SMS',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Questa email è già utilizzata da un altro account.',
    'Confirm a Code': 'Conferma un codice',
    'Confirm Sign In': "Conferma l'accesso",
    'Create account': 'Crea account',
    'Enter your password': 'Inserisci la tua password',
    'Forgot Password?': 'Password dimenticata?',
    'Have an account? ': 'Già registrato?',
    'Incorrect username or password': 'Nome utente o password errati',
    'Invalid password format': 'Formato della password non valido',
    'Invalid phone number format': 'Formato del numero di telefono non valido',
    'Lost your code?': 'Codice smarrito?',
    'New Password': 'Nuova password',
    'No account? ': 'Non hai un account?',
    'Password attempts exceeded': 'Il numero massimo di tentativi di accesso falliti è stato raggiunto',
    'Reset password': 'Reimposta password',
    'Sign Out': 'Esci',
    'Sign Up': 'Registrati',
    'User already exists': 'Utente già esistente',
    'User does not exist': 'Utente inesistente',
    'Username cannot be empty': 'Il nome utente non può essere vuoto',
};

const jaDict$1 = {
    'Account recovery requires verified contact information': 'アカウントの復旧には確認済みの連絡先が必要です',
    'Back to Sign In': 'サインインに戻る',
    'Change Password': 'パスワードを変える ',
    Changing: '変更中',
    Code: 'コード',
    'Confirm Password': 'パスワードの確認',
    'Confirm Sign Up': '登録する',
    'Confirm SMS Code': 'SMS コードを確認',
    'Confirm TOTP Code': 'TOTP コードを確認',
    Confirm: '確定',
    'Confirmation Code': '確認コード',
    Confirming: '確認中',
    'Create a new account': '新しいアカウントを作る',
    'Create Account': 'アカウントを作る',
    'Creating Account': 'アカウントの作成中',
    'Dismiss alert': 'アラートを閉じる',
    Email: 'メールアドレス',
    'Enter your code': 'コードを入力',
    'Enter your Email': 'メールアドレスを入力',
    'Enter your phone number': '電話番号を入力',
    'Enter your username': 'ユーザー名を入力 ',
    'Enter your Username': 'ユーザー名を入力 ',
    'Forgot your password?': 'パスワードを忘れましたか？ ',
    'Hide password': 'パスワードを非表示',
    'It may take a minute to arrive': '到着するまでに 1 分かかることがあります',
    Loading: 'ロード中',
    'New password': '新しいパスワード',
    or: '又は',
    Password: 'パスワード ',
    'Phone Number': '電話番号',
    'Resend Code': 'コードを再送信',
    'Reset your Password': 'パスワードをリセット',
    'Reset your password': 'パスワードをリセットする',
    'Send code': 'コードを送信',
    'Send Code': 'コードを送信',
    Sending: '送信中',
    'Setup TOTP': 'TOTP をセットアップ',
    'Show password': 'パスワードを表示',
    'Sign in to your account': 'アカウントにサインイン ',
    'Sign In with Amazon': 'Amazonでサインイン',
    'Sign In with Apple': 'Apple でサインイン',
    'Sign In with Facebook': 'Facebookでサインイン',
    'Sign In with Google': 'Googleでサインイン',
    'Sign In': 'サインイン ',
    'Sign in': 'サインイン',
    'Signing in': 'サインイン中',
    Skip: 'スキップ',
    Submit: '送信',
    Submitting: '送信中',
    Username: 'ユーザー名 ',
    'Verify Contact': '連絡先を確認',
    Verify: '確認',
    'We Sent A Code': 'コードが送信されました',
    'We Texted You': 'テキストが送信されました',
    'Your code is on the way. To log in, enter the code we sent you': 'コードが途中です。ログインするには、送信したコードを入力してください',
    // Additional translations provided by customers
    'An account with the given email already exists.': '入力されたメールアドレスのアカウントが既に存在します',
    'Confirm a Code': 'コードを確認',
    'Confirm Sign In': 'サインインする',
    'Create account': 'アカウントを作る ',
    'Enter your password': 'パスワードを入力 ',
    'Enter your Password': 'パスワードを入力',
    'Please confirm your Password': 'パスワードを入力',
    'Forgot Password': 'パスワードを忘れた ',
    'Have an account? ': 'アカウントを持っていますか？',
    'Incorrect username or password': 'ユーザー名かパスワードが異なります ',
    'Invalid password format': 'パスワードの形式が無効です ',
    'Invalid phone number format': '不正な電話番号の形式です。\n+12345678900 の形式で入力してください',
    'It may take a minute to arrive.': 'コードを受信するまで数分かかる場合があります。',
    'Lost your code? ': 'コードを失くしましたか？',
    'New Password': '新しいパスワード',
    'No account? ': 'アカウントが無いとき ',
    'Password attempts exceeded': 'サインインの試行回数が上限に達しました',
    'Reset password': 'パスワードをリセット ',
    'Reset Password': 'パスワードをリセット',
    'Sign Out': 'サインアウト ',
    'Sign Up': '登録 ',
    'User already exists': '既にユーザーが存在しています ',
    'User does not exist': 'ユーザーが存在しません ',
    'Username cannot be empty': 'ユーザー名は入力必須です',
    'We Emailed You': 'コードを送信しました',
    'Your code is on the way. To log in, enter the code we emailed to': 'ログインするには、メールに記載されたコードを入力してください。送信先:',
    'Your code is on the way. To log in, enter the code we texted to': 'ログインするには、テキストメッセージに記載されたコードを入力してください。送信先:',
};

const krDict$1 = {
    'Account recovery requires verified contact information': '계정 복구를 위해 연락처 확인이 필요합니다',
    'Back to Sign In': '로그인으로 돌아가기',
    'Change Password': '비밀번호 변경하기',
    Changing: '변경중',
    Code: '코드',
    'Confirm Password': '비밀번호 재확인',
    'Confirm Sign Up': '회원가입 확인',
    'Confirm SMS Code': '휴대폰 본인 확인',
    'Confirm TOTP Code': 'TOTP 인증번호 확인',
    Confirm: '확인',
    'Confirmation Code': '인증번호',
    Confirming: '확인중',
    'Create a new account': '회원가입',
    'Create Account': '회원가입',
    'Creating Account': '회원가입중',
    'Dismiss alert': '알림 무시',
    Email: '이메일',
    'Enter your Birthdate': '생년월일 입력',
    'Enter your code': '인증번호를 입력해주세요',
    'Enter your Confirmation Code': '확인 코드 입력',
    'Enter your Email': '이메일 입력',
    'Enter your Family Name': '성 입력',
    'Enter your Given Name': '사용장 이름 입력',
    'Enter your Name': '이름 입력',
    'Enter your Nickname': '닉네임 입력',
    'Enter your Password': '비밀번호 입력',
    'Enter your phone number': '전화번호 입력',
    'Enter your Preferred Username': '선호하는 아이디 입력',
    'Enter your username': '아이디를 입력해주세요',
    'Forgot password?': '비밀번호를 잊으셨나요?',
    'Hide password': '비밀번호 숨기기',
    'It may take a minute to arrive': '도착하는 데 1분 정도 걸릴 수 있습니다',
    Loading: '로딩중',
    'New password': '새 비밀번호',
    or: '또는',
    Password: '비밀번호',
    'Phone Number': '전화번호',
    'Please confirm your Password': '비밀번호를 확인해 주세요.',
    'Resend Code': '인증번호 재전송',
    'Reset your password': '비밀번호 재설정',
    'Reset your Password': '비밀번호 재설정',
    'Send code': '인증코드 보내기',
    'Send Code': '코드 전송',
    Sending: '전송중',
    'Setup TOTP': 'TOTP 설정하기',
    'Show password': '비밀번호 보이기',
    'Sign in to your account': '로그인',
    'Sign In with Amazon': 'Amazon 로그인',
    'Sign In with Apple': 'Apple 로그인',
    'Sign In with Facebook': 'Facebook 로그인',
    'Sign In with Google': 'Google 로그인',
    'Sign in': '로그인',
    'Sign In': '로그인',
    'Signing in': '로그인중',
    Skip: '다음에 하기',
    Submit: '확인',
    Submitting: '확인중',
    Username: '아이디',
    'Verify Contact': '연락처 확인',
    Verify: '인증',
    'We Emailed You': '이메일을 보냄',
    'We Sent A Code': '코드를 보냄',
    'We Texted You': '문자 메시지를 보냄',
    'Your code is on the way. To log in, enter the code we emailed to': '코드가 전송 중입니다. 로그인하려면 이메일로 전송한 코드를 입력하세요',
    'Your code is on the way. To log in, enter the code we sent you': '코드가 전송 중입니다. 로그인하려면 전송한 코드를 입력하세요',
    'Your code is on the way. To log in, enter the code we texted to': '코드가 전송 중입니다. 로그인하려면 문자 메시지로 전송한 코드를 입력하세요',
    // Additional translations provided by customers
    Birthdate: '생년월일',
    'Family Name': '성',
    'Forgot your password?': '비밀번호를 잊으셨나요?',
    'Given Name': '이름',
    Name: '성함',
    Nickname: '닉네임',
    'Preferred Username': '닉네임',
    Profile: '프로필',
    'Reset Password': '비밀번호 재설정',
    Website: '웹사이트',
};

const nbDict$1 = {
    'Account recovery requires verified contact information': 'Gjenoppretting av konto krever verifisert kontaktinformajson',
    'Add your Profile': 'Legg til profilen din',
    'Add your Website': 'Legg til nettsiden din',
    'Back to Sign In': 'Tilbake til innlogging',
    'Change Password': 'Bytt passord',
    Changing: 'Endre',
    Code: 'Kode',
    'Confirm Password': 'Bekreft passordet',
    'Confirm Sign Up': 'Bekreft registrering',
    'Confirm SMS Code': 'Bekreft SMS-kode',
    'Confirm TOTP Code': 'Bekreft TOTP-kode',
    Confirm: 'Bekreft',
    'Confirmation Code': 'Bekreftelseskode',
    Confirming: 'Bekrefter',
    'Create a new account': 'Opprett en ny konto',
    'Create Account': 'Opprett konto',
    'Creating Account': 'Oppretter konto',
    'Dismiss alert': 'Avvis varsel',
    Email: 'E-post',
    'Enter your Birthdate': 'Skriv inn fødselsdatoen din',
    'Enter your code': 'Skriv inn koden din',
    'Enter your Confirmation Code': 'Skriv inn bekreftelseskoden din',
    'Enter your Email': 'Skriv inn e-postadressen din',
    'Enter your Family Name': 'Skriv inn etternavnet ditt',
    'Enter your Given Name': 'Skriv inn fornavnet ditt',
    'Enter your Middle Name': 'Skriv inn mellomnavnet ditt',
    'Enter your Name': 'Skriv inn navnet ditt',
    'Enter your Nickname': 'Skriv inn kallenavnet ditt',
    'Enter your Password': 'Skriv inn passordet ditt',
    'Enter your phone number': 'Skriv inn telefonnummeret ditt',
    'Enter your Preferred Username': 'Skriv inn det foretrukne brukernavnet ditt',
    'Enter your username': 'Skriv inn brukernavnet ditt',
    'Forgot password?': 'Glemt passord?',
    'Forgot your password?': 'Glemt passordet ditt?',
    'Hide password': 'Skjul passordet',
    'It may take a minute to arrive': 'Det kan ta et minutt for å komme frem',
    Loading: 'Laster inn',
    'New password': 'Nytt passord',
    or: 'eller',
    Password: 'Passord',
    'Phone Number': 'Telefonnummer',
    'Please confirm your Password': 'Vennligst bekreft passordet ditt',
    'Resend Code': 'Send koden på nytt',
    'Reset your password': 'Nullstill passordet ditt',
    'Reset your Password': 'Nullstill passordet ditt',
    'Send code': 'Send kode',
    'Send Code': 'Send kode',
    Sending: 'Sender',
    'Setup TOTP': 'Konfigurer TOTP',
    'Show password': 'Vis passordet',
    'Sign in to your account': 'Logg inn på kontoen din',
    'Sign In with Amazon': 'Logg inn med Amazon',
    'Sign In with Apple': 'Logg inn med Apple',
    'Sign In with Facebook': 'Logg inn med Facebook',
    'Sign In with Google': 'Logg inn med Google',
    'Sign in': 'Logg inn',
    'Sign In': 'Logg inn',
    'Signing in': 'Logger inn',
    Skip: 'Hopp over',
    Submit: 'Send inn',
    Submitting: 'Sender inn',
    Username: 'Brukernavn',
    'Verify Contact': 'Bekreft kontakt',
    Verify: 'Bekreft',
    'We Emailed You': 'Vi sendte deg en e-post',
    'We Sent A Code': 'Vi sendte en kode',
    'We Texted You': 'Vi sendte deg en tekstmelding',
    'Your code is on the way. To log in, enter the code we emailed to': 'Koden din er på vei. For å logge inn, skriv inn koden vi sendte e-post til',
    'Your code is on the way. To log in, enter the code we sent you': 'Koden din er på vei. For å logge inn, skriv inn koden vi sendte deg',
    'Your code is on the way. To log in, enter the code we texted to': 'Koden din er på vei. For å logge inn, skriv inn koden vi sendte tekstmelding til',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Det finnes allerede en konto med denne e-postadressen',
    'Confirm a Code': 'Bekreft koden',
    'Confirm Sign In': 'Bekreft innlogging',
    'Create account': 'Opprett konto',
    'Enter your password': 'Skriv inn passordet ditt',
    'Forgot Password': 'Glemt passordet',
    'Have an account? ': 'Har en konto allerede? ',
    'Incorrect username or password': 'Feil brukernavn eller passord',
    'Invalid password format': 'Ugyldig passordformat',
    'Invalid phone number format': 'Ugyldig telefonnummerformat',
    'Lost your code? ': 'Mistet koden? ',
    'New Password': 'Nytt passord',
    'No account? ': 'Ingen konto? ',
    'Password attempts exceeded': 'For mange mislykkede passordforsøk',
    'Reset password': 'Nullstill passord',
    'Sign Out': 'Logg ut',
    'Sign Up': 'Registrering',
    'User already exists': 'Brukeren finnes allerede',
    'User does not exist': 'Brukeren finnes ikke',
    'Username cannot be empty': 'Brukernavnet kan ikke være tomt',
};

const nlDict$1 = {
    'Account recovery requires verified contact information': 'Accountherstel vereist geverifieerde contactgegevens',
    'Back to Sign In': 'Terug naar inloggen',
    'Change Password': 'Wachtwoord wijzigen',
    Changing: 'Wordt aangepast',
    Code: 'Code',
    'Confirm Password': 'Bevestig Wachtwoord',
    'Confirm Sign Up': 'Bevestig inschrijving',
    'Confirm SMS Code': 'Bevestig SMS Code',
    'Confirm TOTP Code': 'Bevestig TOTP Code',
    Confirm: 'Bevestig',
    'Confirmation Code': 'Bevestigingscode',
    Confirming: 'Bevestigen',
    'Create a new account': 'Nieuw account aanmaken',
    'Create Account': 'Account aanmaken',
    'Creating Account': 'Account wordt aangemaakt',
    'Dismiss alert': 'Waarschuwing sluiten',
    Email: 'E-mail',
    'Enter your code': 'Vul je code in',
    'Enter your Email': 'Vul je e-mail in',
    'Enter your Password': 'Vul je wachtwoord in',
    'Enter your phone number': 'Vul je telefoonnummer in',
    'Enter your username': 'Vul je gebruikersnaam in',
    'Enter your Username': 'Vul je gebruikersnaam in',
    'Forgot your password?': 'Wachtwoord vergeten? ',
    'Hide password': 'Verberg wachtwoord',
    'It may take a minute to arrive': 'Het kan even duren voordat deze aankomt',
    Loading: 'Laden',
    'New password': 'Nieuw wachtwoord',
    'New Password': 'Nieuw Wachtwoord',
    or: 'of',
    Password: 'Wachtwoord',
    'Phone Number': 'Telefoonnummer',
    'Please confirm your Password': 'Bevestig je wachtwoord',
    'Resend Code': 'Verstuur code nogmaals',
    'Reset Password': 'Wachtwoord resetten',
    'Reset your password': 'Reset je wachtwoord',
    'Reset your Password': 'Wachtwoord resetten',
    'Send code': 'Verstuur code',
    'Send Code': 'Verstuur Code',
    Sending: 'Versturen',
    'Setup TOTP': 'TOTP Instellingen',
    'Show password': 'Toon wachtwoord',
    'Sign in to your account': 'Inloggen op je account',
    'Sign In with Amazon': 'Inloggen met Amazon',
    'Sign In with Apple': 'Inloggen met Apple',
    'Sign In with Facebook': 'Inloggen met Facebook',
    'Sign In with Google': 'Inloggen met Google',
    'Sign in': 'Inloggen',
    'Sign In': 'Inloggen',
    'Signing in': 'Inloggen',
    Skip: 'Overslaan',
    Submit: 'Versturen',
    Submitting: 'Wordt verstuurd',
    Username: 'Gebruikersnaam',
    'Verify Contact': 'Verifieer Contact',
    Verify: 'Verifieer',
    'We Emailed You': 'We hebben u een e-mail gestuurd',
    'We Sent A Code': 'We hebben een code gestuurd',
    'We Texted You': 'We hebben u een sms gestuurd',
    'Your code is on the way. To log in, enter the code we emailed to': 'Uw code is onderweg. Om in te loggen, voer de code in die we gemaild hebben naar',
    'Your code is on the way. To log in, enter the code we sent you': 'Uw code is onderweg. Om in te loggen, voer de code in die we u hebben gestuurd',
    'Your code is on the way. To log in, enter the code we texted to': 'Uw code is onderweg. Om in te loggen, voer de code in die we hebben gestuurd naar',
    'Your passwords must match': 'Je wachtwoorden moeten overeenkomen',
};

const plDict$1 = {
    'Account recovery requires verified contact information': 'Odzyskanie konta wymaga zweryfikowanych danych kontaktowych',
    'Back to Sign In': 'Powrót do logowania',
    'Change Password': 'Zmień hasło',
    Changing: 'Zmienianie',
    Code: 'Kod',
    'Confirm Password': 'Potwierdź Hasło',
    'Confirm Sign Up': 'Potwierdź rejestrację',
    'Confirm SMS Code': 'Potwierdź kod SMS',
    'Confirm TOTP Code': 'Potwierdź hasło jednorazowe',
    Confirm: 'Potwierdź',
    'Confirmation Code': 'Kod potwierdzenia',
    Confirming: 'Potwierdzanie',
    'Create a new account': 'Utwórz nowe konto',
    'Create Account': 'Utwórz konto',
    'Creating Account': 'Tworzenie konta',
    'Dismiss alert': 'Odrzuć alert',
    Email: 'E-mail',
    'Enter your code': 'Wprowadź swój kod',
    'Enter your Email': 'Wpisz swój adres e-mail',
    'Enter your phone number': 'Wpisz swój numer telefonu',
    'Enter your username': 'Wprowadź swoją nazwę użytkownika',
    'Forgot your password?': 'Zapomniałeś hasła? ',
    'Hide password': 'Ukryj hasło',
    'It may take a minute to arrive': 'Może to chwilę potrwać',
    Loading: 'Ładowanie',
    'New password': 'Nowe hasło',
    or: 'albo',
    Password: 'Hasło',
    'Phone Number': 'Numer telefonu',
    'Resend Code': 'Wyślij kod ponownie',
    'Reset your password': 'Zresetuj swoje hasło',
    'Reset your Password': 'Zresetuj swoje hasło',
    'Send code': 'Wyślij kod',
    'Send Code': 'Zresetuj hasło',
    Sending: 'Wysyłanie',
    'Setup TOTP': 'Konfiguruj TOTP',
    'Show password': 'Pokaż hasło',
    'Sign in to your account': 'Zaloguj się na swoje konto',
    'Sign In with Amazon': 'Zaloguj z Amazon',
    'Sign In with Apple': 'Zaloguj z Apple',
    'Sign In with Facebook': 'Zaloguj z Facebook',
    'Sign In with Google': 'Zaloguj z Google',
    'Sign In': 'Logowanie',
    'Sign in': 'Zaloguj',
    'Signing in': 'Logowanie',
    Skip: 'Pomiń',
    Submit: 'Wyślij',
    Submitting: 'Wysyłanie',
    Username: 'Nazwa użytkownika',
    'Verify Contact': 'Weryfikacja danych kontaktowych',
    Verify: 'Zweryfikuj',
    // Additional translations provided by customers
    Birthdate: 'Data urodzenia',
    'Family Name': 'Nazwisko',
    'Given Name': 'Pierwsze imię',
    'Middle Name': 'Drugie imię',
    Name: 'Imię i nazwisko',
    Nickname: 'Pseudonim',
    'Preferred Username': 'Preferowana nazwa użytkownika',
    Profile: 'Profil',
    Website: 'Strona internetowa',
    'We Emailed You': 'Wysłaliśmy Ci wiadomość e-mail',
    'We Sent A Code': 'Wysłaliśmy kod',
    'We Texted You': 'Wysłaliśmy Ci wiadomość SMS',
    'Your code is on the way. To log in, enter the code we emailed to': 'Twój kod został wysłany. Aby się zalogować, wprowadź kod wysłany na adres e-mail',
    'Your code is on the way. To log in, enter the code we sent you': 'Twój kod został wysłany. Aby się zalogować, wprowadź wysłany do Ciebie kod',
    'Your code is on the way. To log in, enter the code we texted to': 'Twój kod został wysłany. Aby się zalogować, wprowadź kod wysłany do Ciebie w wiadomości SMS pod numer',
};

const ptDict$1 = {
    'Account recovery requires verified contact information': 'A recuperação da conta requer informações de contato verificadas',
    'Add your Profile': 'Adicione seu Perfil',
    'Add your Website': 'Adicione seu Website',
    'Back to Sign In': 'Voltar para Entrar',
    'Change Password': 'Mudar senha',
    Changing: 'Mudando',
    Code: 'Código',
    'Confirm Password': 'Confirme a Senha',
    'Confirm Sign Up': 'Confirmar inscrição',
    'Confirm SMS Code': 'Confirme o código SMS',
    'Confirm MFA Code': 'Confirme o código MFA',
    'Confirm TOTP Code': 'Confirme o código TOTP',
    Confirm: 'confirme',
    'Confirmation Code': 'Código de confirmação',
    Confirming: 'Confirmando',
    'Create a new account': 'Criar uma nova conta',
    'Create Account': 'Criar Conta',
    'Creating Account': 'Criando conta',
    'Dismiss alert': 'Descartar alerta',
    Email: 'O email',
    'Enter your Birthdate': 'Digite sua Data de Nascimento',
    'Enter your code': 'Insira seu código',
    'Enter your Confirmation Code': 'Digite seu código de confirmação',
    'Enter your Email': 'Digite seu e-mail',
    'Enter your Family Name': 'Digite seu Sobrenome',
    'Enter your Given Name': 'Digite seu Primeiro Nome',
    'Enter your Middle Name': 'Digite seu Nome do Meio',
    'Enter your Name': 'Digite seu Nome',
    'Enter your Nickname': 'Digite seu Apelido',
    'Enter your Password': 'Digite sua senha',
    'Enter your phone number': 'Digite seu número de telefone',
    'Enter your Preferred Username': 'Digite seu nome de usuário preferido',
    'Enter your username': 'Digite seu nome de usuário',
    'Forgot password?': 'Esqueceu a senha?',
    'Forgot your password?': 'Esqueceu sua senha?',
    'Hide password': 'Esconder a senha',
    'It may take a minute to arrive': 'Pode levar um minuto para chegar',
    Loading: 'Carregando',
    'New password': 'Nova Senha',
    or: 'ou',
    Password: 'Senha',
    'Phone Number': 'Número de telefone',
    'Please confirm your Password': 'Por favor confirme sua Senha',
    'Resend Code': 'Reenviar código',
    'Reset your password': 'Redefina sua senha',
    'Reset your Password': 'Redefina sua senha',
    'Send code': 'Enviar código',
    'Send Code': 'Enviar código',
    Sending: 'Enviando',
    'Setup TOTP': 'Configurar TOTP',
    'Show password': 'Mostrar senha',
    'Sign in to your account': 'Faça login em sua conta',
    'Sign In with Amazon': 'Entrar com a Amazon',
    'Sign In with Apple': 'Entrar com a Apple',
    'Sign In with Facebook': 'Entrar com o Facebook',
    'Sign In with Google': 'Faça login no Google',
    'Sign in': 'Entrar',
    'Sign In': 'Entrar',
    'Signing in': 'Entrando',
    Skip: 'Pular',
    Submit: 'Enviar',
    Submitting: 'Enviando',
    Username: 'Nome do usuário',
    'Verify Contact': 'Verificar contato',
    Verify: 'Verificar',
    'We Emailed You': 'Enviamos um e-mail para você',
    'We Sent A Code': 'Enviamos um código',
    'We Texted You': 'Enviamos um SMS para você',
    'Your code is on the way. To log in, enter the code we emailed to': 'Seu código está a caminho. Para fazer login, insira o código para o qual enviamos um e-mail',
    'Your code is on the way. To log in, enter the code we sent you': 'Seu código está a caminho. Para fazer login, insira o código que enviamos para você',
    'Your code is on the way. To log in, enter the code we texted to': 'Seu código está a caminho. Para fazer login, insira o código para o qual enviamos uma mensagem de texto',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Já existe uma conta com o email utilizado.',
    'Confirm a Code': 'Confirmar um Código',
    'Confirm Sign In': 'Confirmar Início de Sessão',
    'Forgot Password': 'Esqueci Minha Senha',
    'Incorrect username or password.': 'Nome de usuário ou senha incorreta',
    'Invalid password format': 'Formato de senha inválido',
    'Invalid phone number format': 'Formato de número de telefone inválido',
    'Loading...': 'Carregando...',
    'New Password': 'Nova Senha',
    'Resend a Code': 'Reenviar um Código',
    'Sign Out': 'Sair',
    'Sign Up with Amazon': 'Criar Conta com a Amazon',
    'Sign Up with Apple': 'Criar Conta com a Apple',
    'Sign Up with Facebook': 'Criar Conta com o Facebook',
    'Sign Up with Google': 'Criar Conta com o Google',
    'Sign Up': 'Criar Conta',
    'User already exists': 'Usuário já existe',
    'User does not exist': 'Usuário não existe',
    'Username cannot be empty': 'Nome de usuário não pode estar vazio',
    'Your passwords must match': 'Suas senhas devem ser iguais',
};

const zhDict$1 = {
    'Account recovery requires verified contact information': '账户恢复需要验证过的联系方式',
    'Back to Sign In': '回到登录',
    'Change Password': '更改密码',
    Changing: '正在修改',
    Code: '确认码',
    'Confirm Password': '确认密码',
    'Confirm Sign Up': '确认注册',
    'Confirm SMS Code': '确认短信验证码',
    'Confirm TOTP Code': '确认 TOTP 代码',
    Confirm: '确认',
    'Confirmation Code': '确认码',
    Confirming: '正在确认',
    'Create a new account': '创建新账户',
    'Create Account': '创建账户',
    'Creating Account': '正在创建账户',
    'Dismiss alert': '关闭警报',
    Email: '邮箱',
    'Enter your code': '输入验证码',
    'Enter your Email': '输入电子邮件',
    'Enter your phone number': '输入电话号码',
    'Enter your username': '输入用户名',
    'Forgot your password?': '忘记密码了？',
    'Hide password': '隐藏密码',
    'It may take a minute to arrive': '可能需要一分钟才能到达',
    Loading: '正在加载',
    'New password': '新密码',
    or: '或者',
    Password: '密码',
    'Phone Number': '电话',
    'Resend Code': '重发验证码',
    'Reset your password': '重置密码',
    'Reset your Password': '重置密码',
    'Send Code': '发送确认码',
    'Send code': '发送验证码',
    Sending: '正在发送',
    'Setup TOTP': '设置 TOTP',
    'Show password': '显示密码',
    'Sign in to your account': '登录账户',
    'Sign In with Amazon': '通过 Amazon 登录',
    'Sign In with Apple': '通过 Apple 登录',
    'Sign In with Facebook': '通过 Facebook 登录',
    'Sign In with Google': '通过 Google 登录',
    'Sign in': '登录',
    'Sign In': '登录',
    'Signing in': '正在登录',
    Skip: '跳过',
    Submit: '提交',
    Submitting: '正在提交',
    Username: '用户名',
    'Verify Contact': '验证联系方式',
    Verify: '验证',
    'We Emailed You': '我们给您发送了电子邮件',
    'We Sent A Code': '我们发送了代码',
    'We Texted You': '我们给您发送了短信',
    'Your code is on the way. To log in, enter the code we emailed to': '您的代码正在发送中。要登录，请输入我们通过电子邮件发送给以下人员的代码：',
    'Your code is on the way. To log in, enter the code we sent you': '您的代码正在发送中。要登录，请输入我们发送给您的代码',
    'Your code is on the way. To log in, enter the code we texted to': '您的代码正在发送中。要登录，请输入我们通过短信发送给以下人员的代码：',
    // Additional translations provided by customers
    'Confirm a Code': '确认码',
    'Confirm Sign In': '确认登录',
    'Forgot Password': '忘记密码',
    'Incorrect username or password': '用户名或密码错误',
    'Invalid password format': '密码格式错误',
    'Invalid phone number format': '电话格式错误，请使用格式 +12345678900',
    'New Password': '新密码',
    'Resend a Code': '重发确认码',
    'Sign Out': '退出',
    'Sign Up': '注册',
    'User already exists': '用户已经存在',
    'User does not exist': '用户不存在',
};

const svDict$1 = {
    'Account recovery requires verified contact information': 'För att återställa kontot behöver du ett verifierat konto',
    'Back to Sign In': 'Tillbaka till inloggningen',
    'Change Password': 'Byt lösenord',
    Changing: 'Ändra',
    Code: 'Kod',
    'Confirm Password': 'Bekräfta lösenord',
    'Confirm Sign Up': 'Bekräfta registrering',
    'Confirm SMS Code': 'Bekräfta SMS-kod',
    'Confirm TOTP Code': 'Bekräfta TOTP-kod',
    Confirm: 'Bekräfta',
    'Confirmation Code': 'Verifikationskod',
    Confirming: 'Bekräftar',
    'Create a new account': 'Skapa ett nytt konto',
    'Create Account': 'Skapa konto',
    'Creating Account': 'Skapar konto',
    'Dismiss alert': 'Avvisa varning',
    Email: 'E-post',
    'Enter your code': 'Skriv din kod',
    'Enter your Email': 'Fyll i din e-post',
    'Enter your phone number': 'Ange ditt telefonnummer',
    'Enter your username': 'Ange ditt användarnamn',
    'Forgot your password?': 'Glömt ditt lösenord? ',
    'Hide password': 'Dölj lösenord',
    'It may take a minute to arrive': 'Det kan ta en minut att komma fram',
    Loading: 'Laddar',
    'New password': 'Nytt lösenord',
    or: 'eller',
    Password: 'Lösenord',
    'Phone Number': 'Telefonnummer',
    'Resend Code': 'Skicka koden igen',
    'Reset your password': 'Återställ ditt lösenord',
    'Reset your Password': 'Återställ ditt lösenord',
    'Send code': 'Skicka kod',
    'Send Code': 'Skicka kod',
    Sending: 'Skickar',
    'Setup TOTP': 'Konfigurera TOTP',
    'Show password': 'Visa lösenord',
    'Sign in to your account': 'Logga in till ditt konto',
    'Sign In with Amazon': 'Logga in med Amazon',
    'Sign In with Apple': 'Logga in med Apple',
    'Sign In with Facebook': 'Logga in med Facebook',
    'Sign In with Google': 'Logga in med Google',
    'Sign in': 'Logga in',
    'Sign In': 'Logga in',
    'Signing in': 'Loggar in',
    Skip: 'Hoppa över',
    Submit: 'Skicka',
    Submitting: 'Skickar in',
    Username: 'Användarnamn',
    'Verify Contact': 'Verifiera kontakt',
    Verify: 'Verifiera',
    'We Sent A Code': 'Vi skickade en kod',
    'We Texted You': 'Vi sms:ade dig',
    'Your code is on the way. To log in, enter the code we emailed to': 'Din kod är på väg. För att logga in, ange koden vi mejlade till',
    'Your code is on the way. To log in, enter the code we sent you': 'Din kod är på väg. För att logga in, ange koden vi skickade till dig',
    'Your code is on the way. To log in, enter the code we texted to': 'Din kod är på väg. För att logga in, ange koden vi sms:ade till',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Det finns redan ett konto med denna e-postadress',
    'Confirm a Code': 'Bekräfta koden',
    'Confirm Sign In': 'Bekräfta inloggning',
    'Create account': 'Skapa konto',
    'Enter your password': 'Ange ditt lösenord',
    'Forgot Password': 'Glömt lösenordet',
    'Have an account? ': 'Redan registrerad? ',
    'Incorrect username or password': 'Felaktigt användarnamn eller lösenord',
    'Invalid password format': 'Ogiltigt lösenordsformat',
    'Invalid phone number format': `Ogiltigt format för telefonnummer`,
    'Lost your code? ': 'Förlorat koden? ',
    'New Password': 'Nytt lösenord',
    'No account? ': 'Inget konto? ',
    'Password attempts exceeded': 'Maximalt antal felaktiga inloggningsförsök har uppnåtts',
    'Reset password': 'Återställ lösenord',
    'Sign Out': 'Logga ut',
    'Sign Up': 'Registrering',
    'User already exists': 'Användaren finns redan',
    'User does not exist': 'Användaren finns inte',
    'Username cannot be empty': 'Användarnamnet kan inte vara tomt',
    'We Emailed You': 'Vi har skickat e-post till dig',
};

const idDict$1 = {
    'Account recovery requires verified contact information': 'Pemulihan akun memerlukan informasi kontak terverifikasi',
    'Back to Sign In': 'Kembali ke Masuk',
    'Change Password': 'Ubah kata sandi',
    Changing: 'Mengubah',
    Code: 'Kode',
    'Confirm Password': 'Konfirmasi kata sandi',
    'Confirm Sign Up': 'Konfirmasi Pendaftaran',
    'Confirm SMS Code': 'Konfirmasi Kode SMS',
    'Confirm TOTP Code': 'Konfirmasi Kode TOTP',
    Confirm: 'Konfirmasi',
    'Confirmation Code': 'Kode Konfirmasi',
    Confirming: 'Mengkonfirmasi',
    'Create a new account': 'Buat akun baru',
    'Create Account': 'Buat Akun',
    'Creating Account': 'Membuat Akun',
    'Dismiss alert': 'Hentikan pemberitahuan',
    Email: 'Email',
    'Enter your code': 'Masukkan kode anda',
    'Enter your Email': 'Masukkan email anda',
    'Enter your phone number': 'Masukkan nomor telepon anda',
    'Enter your username': 'Masukkan nama akun anda',
    'Forgot your password?': 'Lupa kata sandi? ',
    'Hide password': 'Sembunyikan kata sandi',
    'It may take a minute to arrive': 'Mungkin perlu waktu satu menit untuk tiba',
    Loading: 'Memuat',
    'New password': 'Kata sandi baru',
    or: 'atau',
    Password: 'Kata sandi',
    'Phone Number': 'Nomor telepon',
    'Resend Code': 'Kirim ulang kodenya',
    'Reset your Password': 'Reset Kata Sandi',
    'Reset your password': 'Ubah kata sandi anda',
    'Send code': 'Kirim kode',
    'Send Code': 'Kirim Kode',
    Sending: 'Mengirim',
    'Setup TOTP': 'Siapkan TOTP',
    'Show password': 'Tampilkan kata sandi',
    'Sign in to your account': 'Masuk akun anda',
    'Sign In with Amazon': 'Masuk dengan Amazon',
    'Sign In with Apple': 'Masuk dengan Apple',
    'Sign In with Facebook': 'Masuk dengan Facebook',
    'Sign In with Google': 'Masuk dengan Google',
    'Sign in': 'Masuk',
    'Sign In': 'Masuk',
    'Signing in': 'Memasuki',
    Skip: 'Lewati',
    Submit: 'Ajukan',
    Submitting: 'Mengajukan',
    Username: 'Nama akun',
    'Verify Contact': 'Verifikasi Kontak',
    Verify: 'Verifikasi',
    'We Sent A Code': 'Kami Mengirim Kode',
    'We Texted You': 'Kami mengirim SMS kepada Anda',
    'Your code is on the way. To log in, enter the code we sent you': 'Kode Anda segera hadir. Untuk masuk, masukkan kode yang kami kirimkan kepada Anda',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Akun dengan email tersebut sudah terdaftar.',
    'Attempt limit exceeded, please try after some time.': 'Batas percobaan terlampaui, mohon coba lagi setelah beberapa waktu.',
    'Cannot reset password for the user as there is no registered/verified email or phone_number': 'Tidak dapat mengatur ulang kata sandi karena tidak ada email terdaftar / terverifikasi atau nomor telepon',
    Change: 'Ubah',
    'Confirm a Code': 'Konfirmasi kode',
    'Create account': 'Buat akun',
    'Enter your password': 'Masukkan kata sandi anda',
    'Forgot Password': 'Lupa kata sandi',
    'Have an account? ': 'Sudah punya akun? ',
    Hello: 'Halo',
    'Incorrect username or password.': 'Nama akun atau kata sandi salah.',
    'Invalid phone number format': 'Nomor telepon tidak sesuai dengan format.',
    'Invalid verification code provided, please try again.': 'Kode verifikasi tidak sesuai, mohon coba lagi.',
    'It may take a minute to arrive.': 'Mungkin perlu beberapa waktu untuk tiba.',
    'Lost your code? ': 'Kode anda hilang?',
    Name: 'Nama',
    'Network error': 'Galat jaringan',
    'No account? ': 'Tidak ada akun?',
    'Password did not conform with policy: Password not long enough': 'Kata sandi tidak sesuai dengan aturan: Kata sandi kurang panjang',
    'Resend a Code': 'Renvoyer un code',
    'Reset password': 'Ubah kata sandi anda',
    Send: 'Kirim',
    'Sign In with AWS': 'Masuk dengan AWS',
    'Sign Up with Amazon': 'Daftar dengan Amazon',
    'Sign Up with AWS': 'Daftar dengan AWS',
    'Sign Up with Facebook': 'Daftar dengan Facebook',
    'Sign Up with Google': 'Daftar dengan Google',
    SMS: 'SMS',
    'User already exists': 'Akun sudah terdaftar',
    'User does not exist.': 'Akun tidak terdaftar.',
    'User is disabled.': 'Akun dinonaktifkan.',
    'Username cannot be empty': 'Nama akun tidak boleh kosong',
    'Username/client id combination not found.': 'Nama akun atau id tidak ditemukan.',
    'We Emailed You': 'Kami mengirimkanmu email',
    'Your code is on the way. To log in, enter the code we emailed to': 'Kode anda dalam pengiriman. Untuk masuk, masukkan kode yang kami emailkan ke',
    'Your code is on the way. To log in, enter the code we texted to': 'Kode anda dalam pengiriman. Untuk masuk, masukkan kode yang kami tuliskan ke',
    'Your passwords must match': 'Kata sandi harus sama',
};

const trDict$1 = {
    'Account recovery requires verified contact information': 'Hesap kurtarma, doğrulanmış iletişim bilgilerini gerektirir',
    'Add your Profile': 'Profilinizi ekleyin',
    'Add your Website': 'Web sitenizi ekleyin',
    'Back to Sign In': 'Oturum Açmaya Geri Dön',
    'Change Password': 'Şifreyi Değiştir',
    Changing: 'Değiştiriliyor',
    Code: 'Kod',
    'Confirm Password': 'Şifreyi Doğrula',
    'Confirm Sign Up': 'Kayıt İşlemini Doğrula',
    'Confirm SMS Code': 'SMS Kodunu Doğrula',
    'Confirm MFA Code': 'Çoklu Faktörlü Doğrulama Kodunu Doğrula',
    'Confirm TOTP Code': 'Tek Kullanımlık Şifreyi Doğrula',
    Confirm: 'Doğrula',
    'Confirmation Code': 'Doğrulama Kodu',
    Confirming: 'Doğrulanıyor',
    'Create a new account': 'Yeni bir hesap oluştur',
    'Create Account': 'Hesap Oluştur',
    'Creating Account': 'Hesap Oluşturuluyor',
    'Dismiss alert': 'Uyarıyı reddet',
    Email: 'E-posta',
    'Enter your Birthdate': 'Doğum gününüzü girin',
    'Enter your code': 'Kodu girin',
    'Enter your Confirmation Code': 'Doğrulama Kodunuzu Girin',
    'Enter your Email': 'E-posta adresinizi girin',
    'Enter your email': 'E-posta adresinizi girin',
    'Enter your Family Name': 'Ad Soyadınızı girin',
    'Enter your Given Name': 'Adınızı girin',
    'Enter your Middle Name': 'Soyadınızı girin',
    'Enter your Name': 'Adınızı girin',
    'Enter your Nickname': 'Takma adınızı girin',
    'Enter your Password': 'Şifrenizi girin',
    'Enter your phone number': 'Telefon numaranızı girin',
    'Enter your Preferred Username': 'Tercih ettiğiniz kullanıcı adınızı girin',
    'Enter your username': 'Kullanıcı adınızı girin',
    'Forgot Password?': 'Şifrenizi Mi Unuttunuz?',
    'Forgot password?': 'Şifrenizi mi unuttunuz?',
    'Forgot your password?': 'Şifrenizi mi unuttunuz?',
    'Hide password': 'Şifreyi gizle',
    'It may take a minute to arrive': 'Kodun gelmesi bir dakika sürebilir',
    Loading: 'Yükleniyor',
    'New password': 'Yeni şifre',
    or: 'veya',
    Password: 'Şifre',
    'Phone Number': 'Telefon Numarası',
    'Please confirm your Password': 'Lütfen şifrenizi doğrulayın',
    'Resend Code': 'Kodu Yeniden Gönder',
    'Reset your password': 'Şifrenizi sıfırlayın',
    'Reset your Password': 'Şifrenizi Sıfırlayın',
    'Reset Password': 'Şifreyi Sıfırla',
    'Send code': 'Kod gönder',
    'Send Code': 'Kod Gönder',
    Sending: 'Gönderiliyor',
    'Setup TOTP': 'Tek kullanımlık şifre kurulumu yap',
    'Show password': 'Şifreyi göster',
    'Sign in to your account': 'Hesabınızda oturum açın',
    'Sign In with Amazon': 'Amazon ile Oturum Aç',
    'Sign In with Apple': 'Apple ile Oturum Aç',
    'Sign In with Facebook': 'Facebook ile Oturum Aç',
    'Sign In with Google': 'Google ile Oturum Aç',
    'Sign in': 'Oturum aç',
    'Sign In': 'Oturum Aç',
    'Sign Up with Facebook': 'Facebook ile Kayıt Ol',
    'Sign Up with Google': 'Google ile Kayıt Ol',
    'Signing in': 'Oturum açılıyor',
    Skip: 'Atla',
    Submit: 'Gönder',
    Submitting: 'Gönderiliyor',
    Username: 'Kullanıcı adı',
    'Verify Contact': 'Kişiyi Doğrula',
    Verify: 'Doğrula',
    'We Emailed You': 'Size E-posta Gönderdik',
    'We Sent A Code': 'Bir Kod Gönderdik',
    'We Texted You': 'Size Mesaj Gönderdik',
    'Your code is on the way. To log in, enter the code we emailed to': 'Kodunuz yolda. Oturum açmak için, gönderdiğimiz e-postadaki kodu girin',
    'Your code is on the way. To log in, enter the code we sent you': 'Kodunuz yolda. Oturum açmak için, size gönderdiğimiz kodu girin',
    'Your code is on the way. To log in, enter the code we texted to': 'Kodunuz yolda. Oturum açmak için, gönderdiğimiz mesajdaki kodu girin',
    // Additional translations provided by customers
    'An account with the given email already exists.': 'Bu e-postaya ait zaten bir hesap var.',
    'Confirm Sign In': 'Oturum Açmayı Doğrula',
    'Have an account? ': 'Hesabınız var mı? ',
    'Incorrect username or password': 'Yanlış kullanıcı adı ya da şifre',
    'Invalid password format': 'Geçersiz parola formatı',
    'Invalid phone number format': 'Geçersiz telefon numarası formatı',
    'Lost your code? ': 'Kodu mu kaybettiniz? ',
    'No account? ': 'Hesabınız yok mu? ',
    'Password attempts exceeded': 'Maksimum oturum açma girişimi aşıldı',
    'Sign Out': 'Çıkış yap',
    'Sign Up': 'Kayıt Ol',
    'User already exists': 'Bu kullanıcı zaten var',
    'User does not exist': 'Böyle bir kullanıcı mevcut değil',
    'Username cannot be empty': 'Kullanıcı adı boş olamaz'
};

const ruDict$1 = {
    'Account recovery requires verified contact information': 'Восстановление учетной записи требует проверки контактной информации',
    'Back to Sign In': 'Назад, чтобы войти',
    'Change Password': 'изменять пароль',
    Changing: 'Изменение',
    Code: 'Код',
    'Confirm Password': 'Подтверждение пароля',
    'Confirm Sign Up': 'Подтверждение зарегистрироваться',
    'Confirm SMS Code': 'Подтверждение CMC-Код',
    'Confirm TOTP Code': 'Подтверждение TOTP-Код',
    Confirm: 'Подтверждать',
    'Confirmation Code': 'код подтверждения',
    Confirming: 'подтверждение',
    'Create a new account': 'Создавать новую учетную запись',
    'Create Account': 'Создать учетную запись',
    'Creating Account': 'создание учетная запись',
    'Dismiss alert': 'Закрыть оповещение',
    Email: 'электронная почта',
    'Enter your code': 'ввести ваш Код',
    'Enter your Email': 'ввести ваш электронная почта',
    'Enter your phone number': 'ввести ваш номер телефона',
    'Enter your username': 'ввести ваш имя пользователя',
    'Forgot your password?': 'Забыли ваш пароль?',
    'Hide password': 'Скрывать пароль',
    'It may take a minute to arrive': 'Доставка может занять некоторое время',
    Loading: 'Загрузка',
    'New password': 'Новый пароль',
    or: 'или',
    Password: 'Пароль',
    'Phone Number': 'Номер телефона',
    'Resend Code': 'Отправь еще раз Код',
    'Reset your password': 'сброс ваш пароль',
    'Reset your Password': 'сброс ваш Пароль',
    'Send code': 'Отправлять Код',
    'Send Code': 'Отправлять Код',
    Sending: 'отправка',
    'Setup TOTP': 'Настраивать TOTP',
    'Show password': 'Показывать пароль',
    'Sign in to your account': 'знак в свой аккаунт',
    'Sign In with Amazon': 'знак в с Amazon',
    'Sign In with Apple': 'знак в с Apple',
    'Sign In with Facebook': 'знак в с Facebook',
    'Sign In with Google': 'знак в с Google',
    'Sign in': 'знак в',
    'Sign In': 'знак в',
    'Signing in': 'подписание в',
    Skip: 'Пропускать',
    Submit: 'Представлять на рассмотрение',
    Submitting: 'Представив',
    Username: 'Имя пользователя',
    'Verify Contact': 'Проверить контакт',
    Verify: 'Проверить',
    'We Emailed You': 'Мы отправили вам электронное письмо',
    'We Sent A Code': 'Мы отправили код',
    'We Texted You': 'Мы отправили вам текстовое сообщение',
    'Your code is on the way. To log in, enter the code we emailed to': 'Ваш код отправлен. Чтобы войти в систему, введите код, который мы отправили по электронной почте',
    'Your code is on the way. To log in, enter the code we sent you': 'Ваш код отправлен. Чтобы войти в систему, введите код, который мы послали вам',
    'Your code is on the way. To log in, enter the code we texted to': 'Ваш код отправлен. Чтобы войти в систему, введите код, который мы отправили текстовым сообщением',
};

const heDict$1 = {
    'Account recovery requires verified contact information': 'שחזור לקוח דורש עוד מידע',
    'Back to Sign In': 'חזור להרשמה',
    'Change Password': 'עדכון סיסמא',
    Changing: 'מעדכן',
    Code: 'קוד',
    'Confirm Password': 'אשר סיסמא',
    'Confirm Sign Up': 'אשר הרשמה',
    'Confirm SMS Code': 'אשר sms קוד',
    'Confirm TOTP Code': 'אשר totp קוד',
    Confirm: 'אישור',
    'Confirmation Code': 'אישור קוד',
    Confirming: 'מאשר',
    'Create a new account': 'צור משתמש חדש',
    'Create Account': 'צור משתמש',
    'Creating Account': 'יצירת משתמש',
    'Dismiss alert': 'הסר התראה',
    Email: 'אימייל',
    'Enter your code': 'הכנס את הקוד',
    'Enter your Email': 'הכנס את המייל שלך',
    'Enter your phone number': 'הכנס את מספר הטלפון שלך',
    'Enter your username': 'הכנס את שם המתמש שלך',
    'Forgot your password?': 'שכחת סיסמא ?',
    'Hide password': 'הסתר סיסמא',
    Loading: 'טוען',
    'New password': 'סיסמא חדשה',
    or: 'אוֹ',
    Password: 'סיסמא',
    'Phone Number': 'מספר טלפון',
    'Resend Code': 'שלח קוד שוב',
    'Reset your password': 'אפס סיסמא',
    'Reset your Password': 'אפס סיסמא',
    'Send code': 'שלח קוד',
    'Send Code': 'שלח קוד',
    Sending: 'שולח',
    'Setup TOTP': 'Setup TOTP',
    'Show password': 'הצג סיסמא',
    'Sign in to your account': 'התחבר לחשבון שלך',
    'Sign In with Amazon': 'Sign In with Amazon',
    'Sign In with Apple': 'Sign In with Apple',
    'Sign In with Facebook': 'Sign In with Facebook',
    'Sign In with Google': 'Sign In with Google',
    'Sign in': 'התחבר',
    'Sign In': 'התחבר',
    'Signing in': 'מתחבר',
    Skip: 'דלג',
    Submit: 'שלח',
    Submitting: 'שולח',
    Username: 'שם משתמש',
    'Verify Contact': 'אמת איש קשר',
    Verify: 'אמת',
};

const uaDict$1 = {
    'Account recovery requires verified contact information': 'Відновлення облікового запису потребує контактної інформації',
    'Back to Sign In': 'Назад на сторінку входу',
    'Change Password': 'Змінити пароль',
    Changing: 'Змінюємо',
    Code: 'Код',
    'Confirm Password': 'Підтвердіть пароль',
    'Confirm Sign Up': 'Підтвердіть реєстрацію',
    'Confirm SMS Code': 'Підтвердіть SMS код',
    'Confirm TOTP Code': 'Підтвердіть TOTP код',
    Confirm: 'Підтвердити',
    'Confirmation Code': 'Код підтвердження',
    Confirming: 'Підтверджуємо',
    'Create a new account': 'Зареєструватися',
    'Create Account': 'Зареєструватися',
    'Creating Account': 'Реєструємо',
    'Dismiss alert': 'Відхилити сповіщення',
    Email: 'Email',
    'Enter your code': 'Введіть код',
    'Enter your Email': 'Введіть ваш email',
    'Enter your phone number': 'Введіть ваш номер телефону',
    'Enter your username': 'Введіть ваше імʼя користувача',
    'Forgot password?': 'Забули пароль?',
    'Forgot your password?': 'Забули ваш пароль?',
    'Hide password': 'Сховати пароль',
    'It may take a minute to arrive': 'Доставка може тривати хвилину',
    Loading: 'Загружаємо',
    'New password': 'Новий пароль',
    or: 'або',
    Password: 'Пароль',
    'Phone Number': 'Номер Телефону',
    'Resend Code': 'Відправити код повторно',
    'Reset your password': 'Скинути пароль',
    'Reset your Password': 'Скинути пароль',
    'Send code': 'Відправити код',
    'Send Code': 'Відправити код',
    Sending: 'Відправляємо',
    'Setup TOTP': 'Налаштувати TOTP',
    'Show password': 'Показати пароль',
    'Sign in to your account': 'Увійти у ваш обліковий запис',
    'Sign In with Amazon': 'Увійти з Amazon',
    'Sign In with Apple': 'Увійти з Apple',
    'Sign In with Facebook': 'Увійти з Facebook',
    'Sign In with Google': 'Увійти з Google',
    'Sign in': 'Увійти',
    'Sign In': 'Увійти',
    'Signing in': 'Входимо',
    Skip: 'Пропустити',
    Submit: 'Відправити',
    Submitting: 'Відправляємо',
    Username: 'Імʼя користувача',
    'Verify Contact': 'Підтвердити Контакт',
    Verify: 'Підтвердити',
    'We Emailed You': 'Ми відправили вам Email',
    'We Sent A Code': 'Ми відправили код',
    'We Texted You': 'Ми відправили вам текстове повідомлення',
    'Your code is on the way. To log in, enter the code we emailed to': 'Ваш код вже в дорозі. Щоб увійти, введіть код, що ми відправили вам на Email',
    'Your code is on the way. To log in, enter the code we sent you': 'Ваш код вже в дорозі. Щоб увійти, введіть код, що ми вам відправили',
    'Your code is on the way. To log in, enter the code we texted to': 'Ваш код вже в дорозі. Щоб увійти, введіть код, що ми відправили вам текстовим повідомленням',
    // Additional translations
    'An account with the given email already exists.': 'Обліковий запис з цим Email вже існує.',
    'Confirm a Code': 'Підтвердіть код',
    'Confirm Sign In': 'Підтвердіть вхід',
    'Forgot Password': 'Забули пароль',
    'Incorrect username or password.': 'Невірне імʼя користувача або пароль',
    'Invalid password format': 'Невірний формат паролю',
    'Invalid phone number format': 'Невірний формат номеру телефону',
    'Loading...': 'Загружаємо...',
    'New Password': 'Новий пароль',
    'Resend a Code': 'Відправити код повторно',
    'Reset Password': 'Скинути пароль',
    'Sign Out': 'Вийти',
    'Sign Up with Amazon': 'Зареєструватися з Amazon',
    'Sign Up with Apple': 'Зареєструватися з Apple',
    'Sign Up with Facebook': 'Зареєструватися з Facebook',
    'Sign Up with Google': 'Зареєструватися з Google',
    'Sign Up': 'Зареєструватися',
    'User already exists': 'Користувач вже існує',
    'User does not exist': 'Такий користувач не існує',
    'Username cannot be empty': 'Імʼя користувача не може бути пустим',
    'Your passwords must match': 'Паролі мають збігатися',
};

const thDict$1 = {
    'Account recovery requires verified contact information': 'การกู้คืนบัญชีต้องมีข้อมูลติดต่อที่ได้รับการยืนยันแล้ว',
    'Add your Profile': 'เพิ่มโปรไฟล์ของคุณ',
    'Add your Website': 'เพิ่มเว็บไซต์ของคุณ',
    'Back to Sign In': 'กลับไปที่การเข้าสู่ระบบ',
    'Change Password': 'เปลี่ยนรหัสผ่าน',
    Changing: 'กำลังเปลี่ยน',
    Code: 'รหัส',
    'Confirm Password': 'ยืนยันรหัสผ่าน',
    'Please confirm your Password': 'กรุณายืนยันรหัสผ่านของคุณ',
    'Confirm Sign Up': 'ยืนยันการลงทะเบียน',
    'Confirm SMS Code': 'ยืนยันรหัส SMS',
    'Confirm MFA Code': 'ยืนยันรหัส MFA',
    'Confirm TOTP Code': 'ยืนยันรหัส TOTP',
    Confirm: 'ยืนยัน',
    'Confirmation Code': 'รหัสยืนยัน',
    Confirming: 'กำลังยืนยัน',
    'Create a new account': 'สร้างบัญชีใหม่',
    'Create Account': 'สร้างบัญชี',
    'Creating Account': 'กำลังสร้างบัญชี',
    'Dismiss alert': 'ปิดการแจ้งเตือน',
    Email: 'อีเมล',
    'Enter your Birthdate': 'กรอกวันเกิดของคุณ',
    'Enter your code': 'กรอกรหัสของคุณ',
    'Enter your Confirmation Code': 'กรอกรหัสยืนยันของคุณ',
    'Enter your Email': 'กรอกอีเมลของคุณ',
    'Enter your Family Name': 'กรอกนามสกุลของคุณ',
    'Enter your Given Name': 'กรอกชื่อของคุณ',
    'Enter your Middle Name': 'กรอกชื่อกลางของคุณ',
    'Enter your Name': 'กรอกชื่อของคุณ',
    'Enter your Nickname': 'กรอกชื่อเล่นของคุณ',
    'Enter your Password': 'กรอกรหัสผ่านของคุณ',
    'Enter your email': 'กรอกอีเมลของคุณ',
    'Enter your phone number': 'กรอกหมายเลขโทรศัพท์ของคุณ',
    'Enter your Preferred Username': 'กรอกชื่อผู้ใช้ที่ต้องการ',
    'Enter your username': 'กรอกชื่อผู้ใช้ของคุณ',
    'Forgot password?': 'ลืมรหัสผ่าน?',
    'Forgot your password?': 'ลืมรหัสผ่านใช่หรือไม่?',
    'Hide password': 'ซ่อนรหัสผ่าน',
    'It may take a minute to arrive': 'อาจใช้เวลาสักครู่',
    Loading: 'กำลังโหลด',
    'New password': 'รหัสผ่านใหม่',
    or: 'หรือ',
    Password: 'รหัสผ่าน',
    'Phone Number': 'หมายเลขโทรศัพท์',
    'Resend Code': 'ส่งรหัสอีกครั้ง',
    'Reset your Password': 'รีเซ็ตรหัสผ่านของคุณ',
    'Reset your password': 'รีเซ็ตรหัสผ่านของคุณ',
    'Send code': 'ส่งรหัส',
    'Send Code': 'ส่งรหัส',
    Sending: 'กำลังส่ง',
    'Setup TOTP': 'ตั้งค่า TOTP',
    'Show password': 'แสดงรหัสผ่าน',
    'Sign in to your account': 'เข้าสู่ระบบบัญชีของคุณ',
    'Sign In with Amazon': 'เข้าสู่ระบบด้วย Amazon',
    'Sign In with Apple': 'เข้าสู่ระบบด้วย Apple',
    'Sign In with Facebook': 'เข้าสู่ระบบด้วย Facebook',
    'Sign In with Google': 'เข้าสู่ระบบด้วย Google',
    'Sign in': 'เข้าสู่ระบบ',
    'Sign In': 'เข้าสู่ระบบ',
    'Signing in': 'กำลังเข้าสู่ระบบ',
    Skip: 'ข้าม',
    Submit: 'ส่ง',
    Submitting: 'กำลังส่ง',
    Username: 'ชื่อผู้ใช้',
    'Verify Contact': 'ยืนยันการติดต่อ',
    Verify: 'ยืนยัน',
    'We Emailed You': 'เราได้ส่งอีเมลถึงคุณแล้ว',
    'We Sent A Code': 'เราได้ส่งรหัสแล้ว',
    'We Texted You': 'เราได้ส่ง SMS ถึงคุณแล้ว',
    'Your code is on the way. To log in, enter the code we emailed to': 'รหัสของคุณกำลังมา เพื่อเข้าสู่ระบบ กรุณากรอกรหัสที่เราส่งไปยังอีเมล',
    'Your code is on the way. To log in, enter the code we sent you': 'รหัสของคุณกำลังมา เพื่อเข้าสู่ระบบ กรุณากรอกรหัสที่เราส่งให้คุณ',
    'Your code is on the way. To log in, enter the code we texted to': 'รหัสของคุณกำลังมา เพื่อเข้าสู่ระบบ กรุณากรอกรหัสที่เราส่งไปยัง SMS',
    // Additional translations
    'An account with the given email already exists.': 'บัญชีที่ใช้อีเมลนี้มีอยู่แล้ว',
    'Confirm a Code': 'ยืนยันรหัส',
    'Confirm Sign In': 'ยืนยันการเข้าสู่ระบบ',
    'Create account': 'สร้างบัญชี',
    'Sign Up with Facebook': 'ลงทะเบียนด้วย Facebook',
    'Sign Up with Google': 'ลงทะเบียนด้วย Google',
    'Sign Up with Apple': 'ลงทะเบียนด้วย Apple',
    'Sign Up with Line': 'ลงทะเบียนด้วย Line',
    'Forgot Password': 'ลืมรหัสผ่าน',
    'Have an account? ': 'มีบัญชีอยู่แล้ว? ',
    'Incorrect username or password': 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    'Invalid password format': 'รูปแบบรหัสผ่านไม่ถูกต้อง',
    'It may take a minute to arrive.': 'อาจใช้เวลาสักครู่ในการมาถึง',
    'Lost your code? ': 'หารหัสไม่เจอ? ',
    'New Password': 'รหัสผ่านใหม่',
    'No account? ': 'ไม่มีบัญชี? ',
    'Password attempts exceeded': 'เกินจำนวนครั้งที่อนุญาตให้ใส่รหัสผ่าน',
    'Reset password': 'รีเซ็ตรหัสผ่าน',
    'Reset Password': 'รีเซ็ตรหัสผ่าน',
    'Sign Out': 'ออกจากระบบ',
    'Sign Up': 'ลงทะเบียน',
    'User already exists': 'ผู้ใช้นี้มีอยู่แล้ว',
    'User does not exist': 'ไม่มีผู้ใช้นี้',
    'Username cannot be empty': 'ต้องใส่ชื่อผู้ใช้งาน',
};

const defaultTexts$1 = {
    ADD_PROFILE: 'Add your Profile',
    ADD_WEBSITE: 'Add your Website',
    BACK_SIGN_IN: 'Back to Sign In',
    BIRTHDATE: 'Birthdate',
    CHANGE_PASSWORD: 'Change Password',
    CHANGING_PASSWORD: 'Changing',
    CODE: 'Code',
    CODE_ARRIVAL: 'It may take a minute to arrive',
    CODE_EMAILED: 'Your code is on the way. To log in, enter the code we emailed to',
    CODE_SENT: 'Your code is on the way. To log in, enter the code we sent you',
    CODE_TEXTED: 'Your code is on the way. To log in, enter the code we texted to',
    CONFIRM_PASSWORD: 'Confirm Password',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Please confirm your Password',
    CONFIRM_RESET_PASSWORD_HEADING: 'Reset your Password',
    CONFIRM_SIGNUP_HEADING: 'Confirm Sign Up',
    CONFIRM_SMS: 'Confirm SMS Code',
    // If challenge name is not returned
    CONFIRM_MFA_DEFAULT: 'Confirm MFA Code',
    CONFIRM_TOTP: 'Confirm TOTP Code',
    CONFIRM: 'Confirm',
    CONFIRMATION_CODE: 'Confirmation Code',
    CONFIRMING: 'Confirming',
    CREATE_ACCOUNT: 'Create Account',
    CREATING_ACCOUNT: 'Creating Account',
    EMAIL_ADDRESS: 'Email',
    ENTER_BIRTHDATE: 'Enter your Birthdate',
    ENTER_CODE: 'Enter your code',
    ENTER_CONFIRMATION_CODE: 'Enter your Confirmation Code',
    ENTER_EMAIL: 'Enter your Email',
    ENTER_FAMILY_NAME: 'Enter your Family Name',
    ENTER_GIVEN_NAME: 'Enter your Given Name',
    ENTER_MIDDLE_NAME: 'Enter your Middle Name',
    ENTER_NAME: 'Enter your Name',
    ENTER_NICK_NAME: 'Enter your Nickname',
    ENTER_PASSWORD: 'Enter your Password',
    ENTER_PHONE_NUMBER: 'Enter your Phone Number',
    ENTER_PREFERRED_USERNAME: 'Enter your Preferred Username',
    ENTER_USERNAME: 'Enter your username',
    FAMILY_NAME: 'Family Name',
    GIVEN_NAME: 'Given Name',
    FORGOT_PASSWORD: 'Forgot Password?',
    FORGOT_YOUR_PASSWORD: 'Forgot your password?',
    HIDE_PASSWORD: 'Hide password',
    LOADING: 'Loading',
    LOGIN_NAME: 'Username',
    MIDDLE_NAME: 'Middle Name',
    NAME: 'Name',
    NICKNAME: 'Nickname',
    NEW_PASSWORD: 'New password',
    OR: 'or',
    PASSWORD: 'Password',
    PHONE_NUMBER: 'Phone Number',
    PREFERRED_USERNAME: 'Preferred Username',
    PROFILE: 'Profile',
    RESEND_CODE: 'Resend Code',
    RESET_PASSWORD_HEADING: 'Reset your password',
    RESET_PASSWORD: 'Reset Password',
    SEND_CODE: 'Send code',
    SENDING: 'Sending',
    SETUP_TOTP: 'Setup TOTP',
    SHOW_PASSWORD: 'Show password',
    SIGN_IN_BUTTON: 'Sign in',
    SIGN_IN_TAB: 'Sign In',
    SIGN_IN_WITH_AMAZON: 'Sign In with Amazon',
    SIGN_IN_WITH_APPLE: 'Sign In with Apple',
    SIGN_IN_WITH_FACEBOOK: 'Sign In with Facebook',
    SIGN_IN_WITH_GOOGLE: 'Sign In with Google',
    SIGN_IN: 'Sign in to your account',
    SIGN_UP_BUTTON: 'Create a new account',
    SIGNING_IN_BUTTON: 'Signing in',
    SKIP: 'Skip',
    SUBMIT: 'Submit',
    SUBMITTING: 'Submitting',
    UPPERCASE_COPY: 'COPY',
    VERIFY_CONTACT: 'Verify Contact',
    VERIFY_HEADING: 'Account recovery requires verified contact information',
    VERIFY: 'Verify',
    WE_EMAILED: 'We Emailed You',
    WE_SENT_CODE: 'We Sent A Code',
    WE_TEXTED: 'We Texted You',
    WEBSITE: 'Website',
};

//merge all the new module translations in respective locale constants
const deDict = { ...deDict$1 };
const enDict = {
    ...enDict$1,
};
const esDict = { ...esDict$1 };
const frDict = { ...frDict$1 };
const itDict = { ...itDict$1 };
const jaDict = { ...jaDict$1 };
const krDict = { ...krDict$1 };
const nbDict = { ...nbDict$1 };
const nlDict = { ...nlDict$1 };
const plDict = { ...plDict$1 };
const ptDict = { ...ptDict$1 };
const zhDict = { ...zhDict$1 };
const svDict = { ...svDict$1 };
const idDict = { ...idDict$1 };
const trDict = { ...trDict$1 };
const ruDict = { ...ruDict$1 };
const heDict = { ...heDict$1 };
const uaDict = { ...uaDict$1 };
const thDict = { ...thDict$1 };
const defaultTexts = {
    ...defaultTexts$1,
    // new module related default texts goes here
};

/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
/**
 * Contains translatable strings that authenticator provides by default. Customers
 * can use this to add custom vocabularies:
 *
 * ```
 * I18n.putVocabulariesForLanguage("en", {
 *  [DefaultTexts.SIGN_IN]: "Custom Sign In Text",
 *  [DefaultTexts.SIGN_IN_BUTTON]: "Custom Click Here to Sign In"
 * });
 * ```
 */
const DefaultTexts = { ...defaultTexts };
/**
 * This helper type checks that given phrase is one of the texts @aws-amplify/ui
 * provides by default. This enables vscode autocompletion to help catch typos
 * during development.
 *
 * You can also use translate<string> to handle custom strings or dynamic content.
 */
function translate(phrase) {
    return utils$1.I18n.get(phrase);
}
/**
 * Whether I18n has a translation entry for given phrase
 */
function hasTranslation(phrase) {
    return utils$1.I18n.get(phrase) !== phrase;
}
const translations = {
    de: deDict,
    en: enDict,
    es: esDict,
    fr: frDict,
    id: idDict,
    it: itDict,
    ja: jaDict,
    // TODO: remove kr in next major release
    kr: krDict,
    ko: krDict,
    nb: nbDict,
    nl: nlDict,
    pl: plDict,
    pt: ptDict,
    zh: zhDict,
    sv: svDict,
    tr: trDict,
    ru: ruDict,
    he: heDict,
    ua: uaDict,
    th: thDict,
};

/**
 * This file contains helpers related to forms and input attributes.
 */
const defaultFormFieldOptions = {
    birthdate: {
        label: 'Birthdate',
        placeholder: 'Enter your Birthdate',
        type: 'date',
        autocomplete: 'bday',
        isRequired: true,
    },
    confirmation_code: {
        label: 'Confirmation Code',
        placeholder: 'Enter your Confirmation Code',
        type: 'text',
        autocomplete: 'one-time-code',
        isRequired: true,
    },
    confirm_password: {
        label: 'Confirm Password',
        placeholder: 'Please confirm your Password',
        type: 'password',
        autocomplete: 'new-password',
        isRequired: true,
    },
    email: {
        label: 'Email',
        placeholder: 'Enter your Email',
        type: 'email',
        autocomplete: 'username',
        isRequired: true,
    },
    family_name: {
        label: 'Family Name',
        placeholder: 'Enter your Family Name',
        type: 'text',
        autocomplete: 'family-name',
        isRequired: true,
    },
    given_name: {
        label: 'Given Name',
        placeholder: 'Enter your Given Name',
        type: 'text',
        autocomplete: 'given-name',
        isRequired: true,
    },
    middle_name: {
        label: 'Middle Name',
        placeholder: 'Enter your Middle Name',
        type: 'text',
        autocomplete: 'additional-name',
        isRequired: true,
    },
    name: {
        label: 'Name',
        placeholder: 'Enter your Name',
        type: 'text',
        autocomplete: 'name',
        isRequired: true,
    },
    nickname: {
        label: 'Nickname',
        placeholder: 'Enter your Nickname',
        type: 'text',
        autocomplete: 'tel',
        isRequired: true,
    },
    password: {
        label: 'Password',
        placeholder: 'Enter your Password',
        type: 'password',
        autocomplete: 'new-password',
        isRequired: true,
    },
    phone_number: {
        label: 'Phone Number',
        placeholder: 'Enter your Phone Number',
        type: 'tel',
        autocomplete: 'tel',
        dialCode: '+1',
        dialCodeList: countryDialCodes,
        isRequired: true,
    },
    preferred_username: {
        label: 'Preferred Username',
        placeholder: 'Enter your Preferred Username',
        type: 'text',
        isRequired: true,
    },
    profile: {
        label: 'Profile',
        placeholder: 'Add your Profile',
        type: 'url',
        autocomplete: 'url',
        isRequired: true,
    },
    website: {
        label: 'Website',
        placeholder: 'Add your Website',
        type: 'url',
        autocomplete: 'url',
        isRequired: true,
    },
    username: {
        label: 'Username',
        placeholder: 'Enter your Username',
        type: 'text',
        autocomplete: 'username',
        isRequired: true,
    },
};
/**
 * List of special characters that Cognito allows.
 *
 * Adapted from https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html
 */
// prettier-ignore
const ALLOWED_SPECIAL_CHARACTERS = [
    '^', '$', '*', '.', '[', ']',
    '{', '}', '(', ')', '?', '"',
    '!', '@', '#', '%', '&', '/',
    '\\', ',', '>', '<', "'", ':',
    ';', '|', '_', '~', '`', '=',
    '+', '-', ' '
];
/**
 * Email validation regex
 *
 * source: HTML5 spec https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
 */
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
+ * map navigable route keys to auth event names
+ */
const NAVIGABLE_ROUTE_EVENT = {
    forgotPassword: 'FORGOT_PASSWORD',
    signIn: 'SIGN_IN',
    signUp: 'SIGN_UP',
};

const getRoute = (state, actorState) => {
    // 'federatedSignIn' exists as a state on both the 'signInActor' and 'signUpActor',
    // match against the `actorState` initially to determine if the federated sign in flow
    // has begun, then which actor has begun the flow and return the corresponding `route`
    if (actorState?.matches('federatedSignIn')) {
        if (state.matches('signUpActor')) {
            return 'signUp';
        }
        if (state.matches('signInActor')) {
            return 'signIn';
        }
    }
    switch (true) {
        case state.matches('idle'):
            return 'idle';
        case state.matches('setup'):
            return 'setup';
        case state.matches('signOut'):
            return 'signOut';
        case state.matches('authenticated'):
            return 'authenticated';
        case actorState?.matches('confirmSignUp'):
        case actorState?.matches('resendSignUpCode'):
            return 'confirmSignUp';
        case actorState?.matches('confirmSignIn'):
            return 'confirmSignIn';
        case actorState?.matches('setupTotp.edit'):
        case actorState?.matches('setupTotp.submit'):
            return 'setupTotp';
        case actorState?.matches('signIn'):
            return 'signIn';
        case actorState?.matches('signUp'):
        case actorState?.matches('autoSignIn'):
            return 'signUp';
        case actorState?.matches('forceChangePassword'):
            return 'forceNewPassword';
        case actorState?.matches('forgotPassword'):
            return 'forgotPassword';
        case actorState?.matches('confirmResetPassword'):
            return 'confirmResetPassword';
        case actorState?.matches('selectUserAttributes'):
            return 'verifyUser';
        case actorState?.matches('confirmVerifyUserAttribute'):
            return 'confirmVerifyUser';
        case state.matches('getCurrentUser'):
        case actorState?.matches('fetchUserAttributes'):
            /**
             * This route is needed for autoSignIn to capture both the
             * autoSignIn.pending and the resolved states when the
             * signIn actor is running.
             */
            return 'transition';
        default:
            return null;
    }
};

/**
 * This file contains helpers that translates xstate internals to more
 * understandable authenticator contexts. We provide these contexts with
 * `useAuthenticator` hook/composable/service.
 */
/**
 * Creates public facing auth helpers that abstracts out xstate implementation
 * detail. Each framework implementation can export these helpers so that
 * developers can send events without having to learn internals.
 *
 * ```
 * const [state, send] = useActor(...);
 * const { submit } = getSendEventAliases(send);
 * submit({ username, password})
 * ```
 */
const getSendEventAliases = (send) => {
    const sendToMachine = (type) => {
        // TODO If these were created during the creation of the machine & provider,
        // then invalid transitions could be caught via https://xstate.js.org/docs/guides/states.html#state-can-event
        return (data) => send({ type, data });
    };
    return {
        initializeMachine: sendToMachine('INIT'),
        resendCode: sendToMachine('RESEND'),
        signOut: sendToMachine('SIGN_OUT'),
        submitForm: sendToMachine('SUBMIT'),
        updateForm: sendToMachine('CHANGE'),
        updateBlur: sendToMachine('BLUR'),
        // Actions that don't immediately invoke a service but instead transition to a screen
        // are prefixed with `to*`
        toFederatedSignIn: sendToMachine('FEDERATED_SIGN_IN'),
        toForgotPassword: sendToMachine('FORGOT_PASSWORD'),
        toSignIn: sendToMachine('SIGN_IN'),
        toSignUp: sendToMachine('SIGN_UP'),
        skipVerification: sendToMachine('SKIP'),
    };
};
const getNextSendEventAliases = (send) => {
    const { toFederatedSignIn, submitForm, resendCode, skipVerification } = getSendEventAliases(send);
    return {
        handleSubmit: submitForm,
        resendConfirmationCode: resendCode,
        // manual "route" navigation
        setRoute: (route) => send({ type: NAVIGABLE_ROUTE_EVENT[route] }),
        skipAttributeVerification: skipVerification,
        toFederatedSignIn,
    };
};
const getServiceContextFacade = (state) => {
    const actorContext = (getActorContext$1(state) ?? {});
    const { challengeName, codeDeliveryDetails, remoteError: error, validationError: validationErrors, totpSecretCode = null, unverifiedUserAttributes, username, } = actorContext;
    const { socialProviders = [] } = state.context?.config ?? {};
    // check for user in actorContext prior to state context. actorContext is more "up to date",
    // but is not available on all states
    const user = actorContext?.user ?? state.context?.user;
    const hasValidationErrors = !!(validationErrors && Object.keys(validationErrors).length > 0);
    const actorState = getActorState(state);
    const isPending = state.hasTag('pending') || actorState?.hasTag('pending');
    const route = getRoute(state, actorState);
    // Auth status represents the current state of the auth flow
    // The `configuring` state is used to indicate when the xState machine is loading
    const authStatus = ((route) => {
        switch (route) {
            case 'idle':
            case 'setup':
                return 'configuring';
            case 'authenticated':
                return 'authenticated';
            default:
                return 'unauthenticated';
        }
    })(route);
    const facade = {
        authStatus,
        challengeName,
        codeDeliveryDetails,
        error,
        hasValidationErrors,
        isPending,
        route,
        socialProviders,
        totpSecretCode,
        unverifiedUserAttributes,
        user,
        username,
        validationErrors,
        // @v6-migration-note
        // While most of the properties
        // on `AuthenticatorServiceContextFacade` can resolve to `undefined`, updating
        // the interface requires material changes in consumers (namely `useAuthenticator`)
        // which will have implications on the UI layer as typeguards and non-null checks
        // are required to pass type checking. As the `Authenticator` is behaving as expected
        // with the `AuthenticatorServiceContextFacade` interface, prefer to cast
    };
    return facade;
};
const getNextServiceContextFacade = (state) => {
    const actorContext = (getActorContext$1(state) ?? {});
    const { challengeName, codeDeliveryDetails, remoteError: errorMessage, totpSecretCode, unverifiedUserAttributes, username, } = actorContext;
    const { socialProviders: federatedProviders, loginMechanisms } = state.context?.config ?? {};
    const loginMechanism = loginMechanisms?.[0];
    const actorState = getActorState(state);
    const isPending = state.hasTag('pending') || actorState?.hasTag('pending');
    // @todo-migration remove this cast for Authenticator.Next
    const route = getRoute(state, actorState);
    return {
        challengeName,
        codeDeliveryDetails,
        errorMessage,
        federatedProviders,
        isPending,
        loginMechanism,
        route,
        totpSecretCode,
        unverifiedUserAttributes,
        username,
    };
};
const getServiceFacade = ({ send, state, }) => {
    const sendEventAliases = getSendEventAliases(send);
    const serviceContext = getServiceContextFacade(state);
    return {
        ...sendEventAliases,
        ...serviceContext,
    };
};
const getNextServiceFacade = ({ send, state, }) => ({
    ...getNextSendEventAliases(send),
    ...getNextServiceContextFacade(state),
});

/** Federated IDPs that Authenticator supports */
exports.FederatedIdentityProviders = void 0;
(function (FederatedIdentityProviders) {
    FederatedIdentityProviders["Apple"] = "Apple";
    FederatedIdentityProviders["Amazon"] = "Amazon";
    FederatedIdentityProviders["Facebook"] = "Facebook";
    FederatedIdentityProviders["Google"] = "Google";
})(exports.FederatedIdentityProviders || (exports.FederatedIdentityProviders = {}));
/**
 * Cognito user contact method types that have not been verified as valid
 */
exports.UnverifiedContactMethodType = void 0;
(function (UnverifiedContactMethodType) {
    UnverifiedContactMethodType["Email"] = "email";
    UnverifiedContactMethodType["PhoneNumber"] = "phone_number";
})(exports.UnverifiedContactMethodType || (exports.UnverifiedContactMethodType = {}));

const isUnverifiedContactMethodType = (value) => Object.values(exports.UnverifiedContactMethodType).findIndex((val) => val === value) >= 0;

/** Array of auth fields that we supply defaults with */
const signUpFieldsWithDefault = [
    'birthdate',
    'email',
    'family_name',
    'given_name',
    'middle_name',
    'name',
    'nickname',
    'phone_number',
    'preferred_username',
    'profile',
    'website',
];
/** Array of auth fields that we do not supply defaults with */
const signUpFieldsWithoutDefault = [
    'address',
    'gender',
    'locale',
    'picture',
    'updated_at',
    'zoneinfo',
];
/** Array of known login mechanisms */
const LoginMechanismArray = [
    'username',
    'email',
    'phone_number',
];
const authFieldsWithDefaults = [
    ...LoginMechanismArray,
    ...signUpFieldsWithDefault,
    'confirmation_code',
    'password',
    'confirm_password',
];
const isAuthFieldsWithDefaults = (field) => {
    return authFieldsWithDefaults.includes(field);
};

const ComponentClassName = {
    Accordion: 'amplify-accordion',
    AccordionItem: 'amplify-accordion__item',
    AccordionItemTrigger: 'amplify-accordion__item__trigger',
    AccordionItemContent: 'amplify-accordion__item__content',
    AccordionItemIcon: 'amplify-accordion__item__icon',
    Alert: 'amplify-alert',
    AlertIcon: 'amplify-alert__icon',
    AlertHeading: 'amplify-alert__heading',
    AlertBody: 'amplify-alert__body',
    AlertDismiss: 'amplify-alert__dismiss',
    Autocomplete: 'amplify-autocomplete',
    AutocompleteMenu: 'amplify-autocomplete__menu',
    AutocompleteMenuEmpty: 'amplify-autocomplete__menu--empty',
    AutocompleteMenuFooter: 'amplify-autocomplete__menu__footer',
    AutocompleteMenuHeader: 'amplify-autocomplete__menu__header',
    AutocompleteMenuLoading: 'amplify-autocomplete__menu--loading',
    AutocompleteMenuOption: 'amplify-autocomplete__menu__option',
    AutocompleteMenuOptions: 'amplify-autocomplete__menu__options',
    Avatar: 'amplify-avatar',
    AvatarIcon: 'amplify-avatar__icon',
    AvatarImage: 'amplify-avatar__image',
    AvatarLoader: 'amplify-avatar__loader',
    AIConversation: 'amplify-ai-conversation',
    AIConversationAttachment: 'amplify-ai-conversation__attachment',
    AIConversationAttachmentList: 'amplify-ai-conversation__attachment__list',
    AIConversationAttachmentImage: 'amplify-ai-conversation__attachment__image',
    AIConversationAttachmentName: 'amplify-ai-conversation__attachment__name',
    AIConversationAttachmentSize: 'amplify-ai-conversation__attachment__size',
    AIConversationAttachmentRemove: 'amplify-ai-conversation__attachment__remove',
    AIConversationForm: 'amplify-ai-conversation__form',
    AIConversationFormAttach: 'amplify-ai-conversation__form__attach',
    AIConversationFormSend: 'amplify-ai-conversation__form__send',
    AIConversationFormField: 'amplify-ai-conversation__form__field',
    AIConversationFormDropzone: 'amplify-ai-conversation__form__dropzone',
    AIConversationMessage: 'amplify-ai-conversation__message',
    AIConversationMessageAvatar: 'amplify-ai-conversation__message__avatar',
    AIConversationMessageSender: 'amplify-ai-conversation__message__sender',
    AIConversationMessageSenderUsername: 'amplify-ai-conversation__message__sender__username',
    AIConversationMessageSenderTimestamp: 'amplify-ai-conversation__message__sender__timestamp',
    AIConversationMessageBody: 'amplify-ai-conversation__message__body',
    AIConversationMessageContent: 'amplify-ai-conversation__message__content',
    AIConversationMessageActions: 'amplify-ai-conversation__message__actions',
    AIConversationMessageList: 'amplify-ai-conversation__message__list',
    AIConversationPrompt: 'amplify-ai-conversation__prompt',
    Badge: 'amplify-badge',
    Breadcrumbs: 'amplify-breadcrumbs',
    BreadcrumbsList: 'amplify-breadcrumbs__list',
    BreadcrumbsItem: 'amplify-breadcrumbs__item',
    BreadcrumbsSeparator: 'amplify-breadcrumbs__separator',
    BreadcrumbsLink: 'amplify-breadcrumbs__link',
    Button: 'amplify-button',
    ButtonGroup: 'amplify-buttongroup',
    ButtonLoaderWrapper: 'amplify-button__loader-wrapper',
    Card: 'amplify-card',
    Checkbox: 'amplify-checkbox',
    CheckboxButton: 'amplify-checkbox__button',
    CheckboxIcon: 'amplify-checkbox__icon',
    CheckboxInput: 'amplify-checkbox__input',
    CheckboxLabel: 'amplify-checkbox__label',
    CheckboxField: 'amplify-checkboxfield',
    Collection: 'amplify-collection',
    CollectionItems: 'amplify-collection-items',
    CollectionSearch: 'amplify-collection-search',
    CollectionPagination: 'amplify-collection-pagination',
    CountryCodeSelect: 'amplify-countrycodeselect',
    DialCodeSelect: 'amplify-dialcodeselect',
    Divider: 'amplify-divider',
    DividerLabel: 'amplify-divider--label',
    DropZone: 'amplify-dropzone',
    Field: 'amplify-field',
    FieldDescription: 'amplify-field__description',
    FieldErrorMessage: 'amplify-field__error-message',
    FieldGroup: 'amplify-field-group',
    FieldGroupControl: 'amplify-field-group__control',
    FieldGroupOuterEnd: 'amplify-field-group__outer-end',
    FieldGroupOuterStart: 'amplify-field-group__outer-start',
    FieldGroupInnerEnd: 'amplify-field-group__inner-end',
    FieldGroupInnerStart: 'amplify-field-group__inner-start',
    FieldGroupIcon: 'amplify-field-group__icon',
    FieldGroupIconButton: 'amplify-field-group__icon-button',
    FieldGroupHasInnerEnd: 'amplify-field-group--has-inner-end',
    FieldGroupHasInnerStart: 'amplify-field-group--has-inner-start',
    FieldShowPassword: 'amplify-field__show-password',
    FieldGroupFieldWrapper: 'amplify-field-group__field-wrapper',
    Fieldset: 'amplify-fieldset',
    FieldsetLegend: 'amplify-fieldset__legend',
    FileUploader: 'amplify-fileuploader',
    FileUploaderDropZone: 'amplify-fileuploader__dropzone',
    FileUploaderDropZoneIcon: 'amplify-fileuploader__dropzone__icon',
    FileUploaderDropZoneText: 'amplify-fileuploader__dropzone__text',
    FileUploaderFilePicker: 'amplify-fileuploader__file__picker',
    FileUploaderFile: 'amplify-fileuploader__file',
    FileUploaderFileWrapper: 'amplify-fileuploader__file__wrapper',
    FileUploaderFileList: 'amplify-fileuploader__file__list',
    FileUploaderFileName: 'amplify-fileuploader__file__name',
    FileUploaderFileSize: 'amplify-fileuploader__file__size',
    FileUploaderFileInfo: 'amplify-fileuploader__file__info',
    FileUploaderFileImage: 'amplify-fileuploader__file__image',
    FileUploaderFileMain: 'amplify-fileuploader__file__main',
    FileUploaderFileStatus: 'amplify-fileuploader__file__status',
    FileUploaderLoader: 'amplify-fileuploader__loader',
    FileUploaderPreviewer: 'amplify-fileuploader__previewer',
    FileUploaderPreviewerText: 'amplify-fileuploader__previewer__text',
    FileUploaderPreviewerActions: 'amplify-fileuploader__previewer__actions',
    FileUploaderPreviewerFooter: 'amplify-fileuploader__previewer__footer',
    Flex: 'amplify-flex',
    Grid: 'amplify-grid',
    Heading: 'amplify-heading',
    HighlightMatch: 'amplify-highlightmatch',
    HighlightMatchHighlighted: 'amplify-highlightmatch__highlighted',
    Icon: 'amplify-icon',
    Image: 'amplify-image',
    Input: 'amplify-input',
    Label: 'amplify-label',
    Link: 'amplify-link',
    Loader: 'amplify-loader',
    LoaderLabel: 'amplify-loader__label',
    MenuContent: 'amplify-menu__content',
    MenuItem: 'amplify-menu__content__item',
    MenuTrigger: 'amplify-menu__trigger',
    MenuWrapper: 'amplify-menu__wrapper',
    Message: 'amplify-message',
    MessageIcon: 'amplify-message__icon',
    MessageHeading: 'amplify-message__heading',
    MessageBody: 'amplify-message__body',
    MessageContent: 'amplify-message__content',
    MessageDismiss: 'amplify-message__dismiss',
    Pagination: 'amplify-pagination',
    PaginationItem: 'amplify-pagination__item',
    PasswordField: 'amplify-passwordfield',
    PhoneNumberField: 'amplify-phonenumberfield',
    Placeholder: 'amplify-placeholder',
    Radio: 'amplify-radio',
    RadioButton: 'amplify-radio__button',
    RadioInput: 'amplify-radio__input',
    RadioLabel: 'amplify-radio__label',
    RadioGroupField: 'amplify-radiogroupfield',
    RadioGroup: 'amplify-radiogroup',
    Rating: 'amplify-rating',
    RatingItem: 'amplify-rating__item',
    RatingIcon: 'amplify-rating__icon',
    RatingLabel: 'amplify-rating__label',
    ScrollView: 'amplify-scrollview',
    SearchField: 'amplify-searchfield',
    SearchFieldClear: 'amplify-searchfield__clear',
    SearchFieldSearch: 'amplify-searchfield__search',
    Select: 'amplify-select',
    SelectField: 'amplify-selectfield',
    SelectWrapper: 'amplify-select__wrapper',
    SelectIcon: 'amplify-select__icon',
    SliderField: 'amplify-sliderfield',
    SliderFieldGroup: 'amplify-sliderfield__group',
    SliderFieldLabel: 'amplify-sliderfield__label',
    SliderFieldRange: 'amplify-sliderfield__range',
    SliderFieldRoot: 'amplify-sliderfield__root',
    SliderFieldThumb: 'amplify-sliderfield__thumb',
    SliderFieldTrack: 'amplify-sliderfield__track',
    StepperField: 'amplify-stepperfield',
    StepperFieldButtonDecrease: 'amplify-stepperfield__button--decrease',
    StepperFieldButtonIncrease: 'amplify-stepperfield__button--increase',
    StepperFieldInput: 'amplify-stepperfield__input',
    StorageImage: 'amplify-storageimage',
    StorageManager: 'amplify-storagemanager',
    StorageManagerDropZone: 'amplify-storagemanager__dropzone',
    StorageManagerDropZoneIcon: 'amplify-storagemanager__dropzone__icon',
    StorageManagerDropZoneText: 'amplify-storagemanager__dropzone__text',
    StorageManagerFilePicker: 'amplify-storagemanager__file__picker',
    StorageManagerFile: 'amplify-storagemanager__file',
    StorageManagerFileWrapper: 'amplify-storagemanager__file__wrapper',
    StorageManagerFileList: 'amplify-storagemanager__file__list',
    StorageManagerFileName: 'amplify-storagemanager__file__name',
    StorageManagerFileSize: 'amplify-storagemanager__file__size',
    StorageManagerFileInfo: 'amplify-storagemanager__file__info',
    StorageManagerFileImage: 'amplify-storagemanager__file__image',
    StorageManagerFileMain: 'amplify-storagemanager__file__main',
    StorageManagerFileStatus: 'amplify-storagemanager__file__status',
    StorageManagerLoader: 'amplify-storagemanager__loader',
    StorageManagerPreviewer: 'amplify-storagemanager__previewer',
    StorageManagerPreviewerText: 'amplify-storagemanager__previewer__text',
    StorageManagerPreviewerActions: 'amplify-storagemanager__previewer__actions',
    StorageManagerPreviewerFooter: 'amplify-storagemanager__previewer__footer',
    SwitchField: 'amplify-switchfield',
    SwitchLabel: 'amplify-switch__label',
    SwitchThumb: 'amplify-switch__thumb',
    SwitchTrack: 'amplify-switch__track',
    SwitchWrapper: 'amplify-switch__wrapper',
    Table: 'amplify-table',
    TableCaption: 'amplify-table__caption',
    TableBody: 'amplify-table__body',
    TableTd: 'amplify-table__td',
    TableTh: 'amplify-table__th',
    TableFoot: 'amplify-table__foot',
    TableHead: 'amplify-table__head',
    TableRow: 'amplify-table__row',
    Tabs: 'amplify-tabs',
    TabsList: 'amplify-tabs__list',
    TabsItem: 'amplify-tabs__item',
    TabsPanel: 'amplify-tabs__panel',
    Text: 'amplify-text',
    Textarea: 'amplify-textarea',
    TextAreaField: 'amplify-textareafield',
    TextField: 'amplify-textfield',
    ToggleButton: 'amplify-togglebutton',
    ToggleButtonGroup: 'amplify-togglebuttongroup',
    VisuallyHidden: 'amplify-visually-hidden',
};

const getFormDataFromEvent = (event) => {
    const formData = new FormData(event.target);
    return Object.fromEntries(formData);
};
const setFormOrder = (formOverrides, fieldNames) => {
    let orderedKeys = [];
    if (formOverrides) {
        orderedKeys = Object.keys(formOverrides)
            .reduce((prev, key) => {
            // reduce to array that can be sorted
            prev.push([key, formOverrides[key]?.order]);
            return prev;
        }, [])
            .sort((a, b) => 
        //sort them based on order
        a[1] - b[1]) // returned just key
            .filter((a) => a[1] !== undefined)
            .map((a) => a[0]);
    }
    // remove duplicates
    return Array.from(new Set([...orderedKeys, ...fieldNames]));
};
const isAuthFieldWithDefaults = (field) => {
    return authFieldsWithDefaults.includes(field);
};
const isArray = (val) => {
    return Array.isArray(val);
};
const getErrors = (errors) => {
    if (!errors)
        return null;
    if (isArray(errors)) {
        return errors;
    }
    else {
        return [errors];
    }
};

// replaces all characters in a string with '*', except for the first and last char
const censorAllButFirstAndLast = (value) => {
    const split = value.trim().split('');
    for (let i = 0; i < split.length; i++) {
        if (i > 0 && i < split.length - 1) {
            split[i] = '*';
        }
    }
    return split.join('');
};
// censors all but the last four characters of a phone number
const censorPhoneNumber = (val) => {
    if (val.length < 4) {
        return val;
    }
    const split = val.split('');
    for (let i = 0; i < split.length - 4; i++) {
        split[i] = '*';
    }
    return split.join('');
};
// censors all but the first and last of the name of an email and keeps domain
const censorEmail = (val) => {
    const splitEmail = val.split('@');
    const censoredName = censorAllButFirstAndLast(splitEmail[0]);
    return `${censoredName}@${splitEmail[1]}`;
};
// based on the ContactMethod type, returns a censored contact value
const censorContactMethod = (type, value) => {
    return type === 'Phone Number'
        ? censorPhoneNumber(value)
        : censorEmail(value);
};
const hasSpecialChars = (password) => ALLOWED_SPECIAL_CHARACTERS.some((char) => password.includes(char));
const getTotpCodeURL = (issuer, username, secret) => encodeURI(`otpauth://totp/${issuer}:${username}?secret=${secret}&issuer=${issuer}`);
function trimValues(values, ...ignored) {
    return Object.entries(values).reduce((acc, [name, value]) => ({
        ...acc,
        [name]: ignored.includes(name) ? value : value?.trim(),
    }), {});
}
const isValidEmail = (value) => {
    if (!value)
        return false;
    return emailRegex.test(value);
};

const getPrimaryAlias = (state) => {
    const loginMechanisms = state?.context.config?.loginMechanisms;
    /**
     * @migration this is where we grab only the first index of `aws_cognito_username_attributes`
     */
    const [primaryAlias] = loginMechanisms ?? ['username'];
    return primaryAlias;
};
/** Applies translations to label and placeholder */
const applyTranslation = (formFields) => {
    const newFormFields = { ...formFields };
    for (const [name, options] of Object.entries(formFields)) {
        const { label, placeholder } = options;
        newFormFields[name] = {
            ...options,
            label: label ? translate(label) : undefined,
            placeholder: placeholder ? translate(placeholder) : undefined,
        };
    }
    return newFormFields;
};
/** Sorts formFields according to their `order`.  */
const sortFormFields = (formFields) => {
    return Object.entries(formFields)
        .sort((a, b) => {
        const orderA = a[1].order || Number.MAX_VALUE;
        const orderB = b[1].order || Number.MAX_VALUE;
        return orderA - orderB;
    })
        .filter((formFieldEntry) => formFieldEntry[1] !== undefined);
};

/**
 * This file contains helpers that generate default formFields for each screen
 */
const DEFAULT_COUNTRY_CODE = '+1';
/** Helper function that gets the default formField for given field name */
const getDefaultFormField = (fieldName) => {
    let options = defaultFormFieldOptions[fieldName];
    const { type } = options;
    if (type === 'tel') {
        options = { ...options, dialCode: DEFAULT_COUNTRY_CODE };
    }
    return options;
};
// Helper function that returns default form field for configured primary alias
const getAliasDefaultFormField = (state) => {
    const primaryAlias = getPrimaryAlias(state);
    return {
        ...getDefaultFormField(primaryAlias),
        autocomplete: 'username',
    };
};
/** Reusable confirmation code form fields. */
const getConfirmationCodeFormFields = (state) => ({
    confirmation_code: {
        ...getDefaultFormField('confirmation_code'),
        label: 'Code *',
        placeholder: 'Code',
    },
});
const getSignInFormFields = (state) => ({
    username: { ...getAliasDefaultFormField(state) },
    password: {
        ...getDefaultFormField('password'),
        autocomplete: 'current-password',
    },
});
const getSignUpFormFields = (state) => {
    const { loginMechanisms, signUpAttributes } = state.context.config;
    const primaryAlias = getPrimaryAlias(state);
    /**
     * @migration signUp Fields created here
     */
    const fieldNames = Array.from(new Set([
        ...loginMechanisms,
        'password',
        'confirm_password',
        ...signUpAttributes,
    ]));
    const formField = {};
    for (const fieldName of fieldNames) {
        if (isAuthFieldWithDefaults(fieldName)) {
            const fieldAttrs = fieldName === primaryAlias
                ? getAliasDefaultFormField(state)
                : getDefaultFormField(fieldName);
            formField[fieldName] = { ...fieldAttrs };
        }
        else {
            // There's a `custom:*` attribute or one we don't already have an implementation for
            console.debug(`Authenticator does not have a default implementation for ${fieldName}. Customize SignUp FormFields to add your own.`);
        }
    }
    return formField;
};
const getConfirmSignUpFormFields = (state) => ({
    confirmation_code: {
        ...getDefaultFormField('confirmation_code'),
        placeholder: 'Enter your code',
    },
});
const getForgotPasswordFormFields = (state) => {
    const primaryAlias = getPrimaryAlias(state);
    const { label } = defaultFormFieldOptions[primaryAlias];
    return {
        username: {
            ...getAliasDefaultFormField(state),
            label: `Enter your ${label.toLowerCase()}`,
            placeholder: `Enter your ${label.toLowerCase()}`,
        },
    };
};
const getConfirmResetPasswordFormFields = (state) => ({
    ...getConfirmationCodeFormFields(),
    password: {
        ...getDefaultFormField('password'),
        label: 'New Password',
        placeholder: 'New Password',
    },
    confirm_password: {
        ...getDefaultFormField('confirm_password'),
        label: 'Confirm Password',
        placeholder: 'Confirm Password',
    },
});
const getForceNewPasswordFormFields = (state) => {
    const actorState = getActorState(state);
    const { missingAttributes } = actorState.context;
    const fieldNames = Array.from(new Set([
        'password',
        'confirm_password',
        ...(missingAttributes ?? []),
    ]));
    const formField = {};
    for (const fieldName of fieldNames) {
        if (isAuthFieldWithDefaults(fieldName)) {
            formField[fieldName] = { ...getDefaultFormField(fieldName) };
        }
        else {
            // There's a `custom:*` attribute or one we don't already have an implementation for
            console.debug(`Authenticator does not have a default implementation for ${fieldName}. Customize ForceNewPassword FormFields to add your own.`);
        }
    }
    return formField;
};
/** Collect all the defaultFormFields getters */
const defaultFormFieldsGetters = {
    signIn: getSignInFormFields,
    signUp: getSignUpFormFields,
    confirmSignUp: getConfirmSignUpFormFields,
    confirmSignIn: getConfirmationCodeFormFields,
    forceNewPassword: getForceNewPasswordFormFields,
    forgotPassword: getForgotPasswordFormFields,
    confirmResetPassword: getConfirmResetPasswordFormFields,
    confirmVerifyUser: getConfirmationCodeFormFields,
    setupTotp: getConfirmationCodeFormFields,
};

// Gets the default formFields for given route
const getDefaultFormFields = (route, state) => {
    const formFieldGetter = defaultFormFieldsGetters[route];
    return formFieldGetter(state);
};
// Gets custom formFields, and applies default values
const getCustomFormFields = (route, state) => {
    const customFormFields = getActorContext$1(state)?.formFields?.[route];
    if (!customFormFields || Object.keys(customFormFields).length === 0) {
        return {};
    }
    return Object.entries(customFormFields).reduce((acc, [fieldName, customOptions]) => {
        if ((route === 'signIn' || route === 'forgotPassword') &&
            fieldName === 'username') {
            // Unlike other screens, `signIn` and `forgotPassword` screens default login
            // alias field names to "username", even if it's a phone number or email.
            // In this case, we get the default formFieldOptions based on loginMechanism.
            const defaultOptions = getAliasDefaultFormField(state);
            // apply default to fill any gaps that are not present in customOptions
            const mergedOptions = { ...defaultOptions, ...customOptions };
            return { ...acc, [fieldName]: mergedOptions };
        }
        else if (isAuthFieldsWithDefaults(fieldName)) {
            // if this field is a known auth attribute that we have defaults for,
            // apply defaults to customOptions.
            const defaultOptions = defaultFormFieldOptions[fieldName];
            const mergedOptions = { ...defaultOptions, ...customOptions };
            return { ...acc, [fieldName]: mergedOptions };
        }
        else {
            // if this is not a known field, use customOptions as is.
            return { ...acc, [fieldName]: customOptions };
        }
    }, {});
};
const getFormFields = (route, state) => {
    const defaultFormFields = getDefaultFormFields(route, state);
    const customFormFields = getCustomFormFields(route, state);
    const formFields = { ...defaultFormFields, ...customFormFields };
    delete formFields['QR'];
    return applyTranslation(formFields);
};
const removeOrderKeys = (formFields) => formFields.map((field) => {
    const key = field[0];
    // Drop order key to prevent passing to form field UI components
    const values = { ...field[1], order: undefined };
    return [key, values];
});
/** Calls `getFormFields` above, then sorts it into an indexed array */
const getSortedFormFields = (route, state) => {
    const formFields = getFormFields(route, state);
    return removeOrderKeys(sortFormFields(formFields));
};

/**
 * ConfirmSignIn
 */
const getChallengeText = (challengeName) => {
    switch (challengeName) {
        case 'SMS_MFA':
            return translate(DefaultTexts.CONFIRM_SMS);
        case 'SOFTWARE_TOKEN_MFA':
            return translate(DefaultTexts.CONFIRM_TOTP);
        default:
            return translate(DefaultTexts.CONFIRM_MFA_DEFAULT);
    }
};
/**
 * ConfirmSignUp
 */
const getDeliveryMessageText = (codeDeliveryDetails) => {
    const { DeliveryMedium, Destination } = codeDeliveryDetails ?? {};
    const isEmailMessage = DeliveryMedium === 'EMAIL';
    const isTextMessage = DeliveryMedium === 'SMS';
    const arrivalMessage = translate(DefaultTexts.CODE_ARRIVAL);
    if (!(isEmailMessage || isTextMessage)) {
        return `${translate(DefaultTexts.CODE_SENT)}. ${arrivalMessage}.`;
    }
    const instructionMessage = isEmailMessage
        ? translate(DefaultTexts.CODE_EMAILED)
        : translate(DefaultTexts.CODE_TEXTED);
    return `${instructionMessage} ${Destination}. ${arrivalMessage}.`;
};
const getDeliveryMethodText = (codeDeliveryDetails) => {
    const { DeliveryMedium } = codeDeliveryDetails ?? {};
    const isEmailMessage = DeliveryMedium === 'EMAIL';
    const isTextMessage = DeliveryMedium === 'SMS';
    if (!isEmailMessage && isTextMessage) {
        return translate(DefaultTexts.WE_SENT_CODE);
    }
    return isEmailMessage
        ? translate(DefaultTexts.WE_EMAILED)
        : translate(DefaultTexts.WE_TEXTED);
};
/**
 * FederatedSignIn
 */
const providerNameMap = {
    amazon: 'Amazon',
    apple: 'Apple',
    facebook: 'Facebook',
    google: 'Google',
};
const getSignInWithFederationText = (route, provider) => {
    const isSignIn = route === 'signIn';
    return translate(`Sign ${isSignIn ? 'In' : 'Up'} with ${providerNameMap[provider]}`);
};
const authenticatorTextUtil = {
    /** Shared */
    getBackToSignInText: () => translate(DefaultTexts.BACK_SIGN_IN),
    getChangePasswordText: () => translate(DefaultTexts.CHANGE_PASSWORD),
    getChangingText: () => translate(DefaultTexts.CHANGING_PASSWORD),
    getConfirmText: () => translate(DefaultTexts.CONFIRM),
    getConfirmingText: () => translate(DefaultTexts.CONFIRMING),
    getCopyText: () => translate(DefaultTexts.UPPERCASE_COPY),
    getHidePasswordText: () => translate(DefaultTexts.HIDE_PASSWORD),
    getLoadingText: () => translate(DefaultTexts.LOADING),
    getOrText: () => translate(DefaultTexts.OR),
    getResendCodeText: () => translate(DefaultTexts.RESEND_CODE),
    getSendCodeText: () => translate(DefaultTexts.SEND_CODE),
    getSendingText: () => translate(DefaultTexts.SENDING),
    getShowPasswordText: () => translate(DefaultTexts.SHOW_PASSWORD),
    getSubmitText: () => translate(DefaultTexts.SUBMIT),
    getSubmittingText: () => translate(DefaultTexts.SUBMITTING),
    /** SignInSignUpTabs */
    getSignInTabText: () => translate(DefaultTexts.SIGN_IN_TAB),
    getSignUpTabText: () => translate(DefaultTexts.CREATE_ACCOUNT),
    /** SignIn */
    getForgotPasswordText: (shortVersion) => translate(shortVersion
        ? DefaultTexts.FORGOT_PASSWORD
        : DefaultTexts.FORGOT_YOUR_PASSWORD),
    getSigningInText: () => translate(DefaultTexts.SIGNING_IN_BUTTON),
    getSignInText: () => translate(DefaultTexts.SIGN_IN_BUTTON),
    /** SignUp */
    getCreatingAccountText: () => translate(DefaultTexts.CREATING_ACCOUNT),
    getCreateAccountText: () => translate(DefaultTexts.CREATE_ACCOUNT),
    /** ConfirmSignUp */
    getDeliveryMessageText,
    getDeliveryMethodText,
    /** ConfirmSignIn */
    getChallengeText,
    /** ForgotPassword */
    getResetYourPasswordText: () => translate(DefaultTexts.RESET_PASSWORD),
    /** SetupTotp */
    getSetupTotpText: () => translate(DefaultTexts.SETUP_TOTP),
    // TODO: add defaultText for below
    getSetupTotpInstructionsText: () => translate('Copy and paste the secret key below into an authenticator app and then enter the code in the text field below.'),
    // TODO: add defaultText for "COPIED"
    getCopiedText: () => translate('COPIED'),
    /** FederatedSignIn */
    getSignInWithFederationText,
    /** VerifyUser */
    getSkipText: () => translate(DefaultTexts.SKIP),
    getVerifyText: () => translate(DefaultTexts.VERIFY),
    getVerifyContactText: () => translate(DefaultTexts.VERIFY_CONTACT),
    getAccountRecoveryInfoText: () => translate(DefaultTexts.VERIFY_HEADING),
    /** Validations */
    // TODO: add defaultText
    getInvalidEmailText: () => translate('Please enter a valid email'),
    // TODO: add defaultText
    getRequiredFieldText: () => translate('This field is required'),
}; // using `as const` so that keys are strongly typed

const getLogger = (category) => new utils$1.ConsoleLogger(`AmplifyUI:${category}`);

const logger = getLogger('Auth');
const changePassword = async ({ currentPassword, newPassword, }) => {
    try {
        logger.debug('calling Auth.updatePassword');
        await auth.updatePassword({
            oldPassword: currentPassword,
            newPassword,
        });
        logger.debug('Auth.updatePassword was successful');
        return Promise.resolve();
    }
    catch (e) {
        logger.debug('Auth.updatePassword failed with error', e);
        return Promise.reject(e);
    }
};
const deleteUser = async () => {
    try {
        logger.debug('calling Auth.deleteUser');
        await auth.deleteUser();
        logger.debug('Auth.deleteUser was successful');
        return Promise.resolve();
    }
    catch (e) {
        logger.debug('Auth.deleteUser failed with error', e);
        return Promise.reject(e);
    }
};

// gets password requirement from Amplify.configure data
const getPasswordRequirement = () => {
    const config = awsAmplify.Amplify.getConfig();
    const passwordSettings = config?.Auth?.Cognito
        .passwordFormat;
    if (!passwordSettings) {
        return null;
    }
    return {
        minLength: passwordSettings.minLength,
        needsLowerCase: passwordSettings.requireLowercase ?? false,
        needsUpperCase: passwordSettings.requireUppercase ?? false,
        needsNumber: passwordSettings.requireNumbers ?? false,
        needsSpecialChar: passwordSettings.requireSpecialCharacters ?? false,
    };
};
const getHasMinLength = (minLength) => ({
    validationMode: 'onTouched',
    validator: (field) => field.length >= minLength,
    message: `Password must have at least ${minLength} characters`,
});
const hasLowerCase = {
    validationMode: 'onTouched',
    validator: (field) => /[a-z]/.test(field),
    message: 'Password must have lower case letters',
};
const hasUpperCase = {
    validationMode: 'onTouched',
    validator: (field) => /[A-Z]/.test(field),
    message: 'Password must have upper case letters',
};
const hasNumber = {
    validationMode: 'onTouched',
    validator: (field) => /[0-9]/.test(field),
    message: 'Password must have numbers',
};
const hasSpecialChar = {
    validationMode: 'onTouched',
    validator: (field) => hasSpecialChars(field),
    message: 'Password must have special characters',
};
const getMatchesConfirmPassword = (password) => {
    return {
        validationMode: 'onTouched',
        validator: (confirmPassword) => password === confirmPassword,
        message: 'Your passwords must match',
    };
};
const getDefaultPasswordValidators = () => {
    const requirement = getPasswordRequirement();
    if (!requirement)
        return [];
    const validators = [];
    const { minLength, needsLowerCase, needsUpperCase, needsNumber, needsSpecialChar, } = requirement;
    if (minLength) {
        validators.push(getHasMinLength(minLength));
    }
    if (needsLowerCase) {
        validators.push(hasLowerCase);
    }
    if (needsUpperCase) {
        validators.push(hasUpperCase);
    }
    if (needsNumber) {
        validators.push(hasNumber);
    }
    if (needsSpecialChar) {
        validators.push(hasSpecialChar);
    }
    return validators;
};
const getDefaultConfirmPasswordValidators = (password) => {
    return [getMatchesConfirmPassword(password)];
};
/*
 * `shouldValidate` determines whether validator should be run, based on validation mode,
 * input event type, and whether it has been blurred yet.
 */
const shouldValidate = ({ validationMode, eventType, hasBlurred, }) => {
    switch (validationMode) {
        case 'onBlur': {
            // only run validator on blur event
            return eventType === 'blur';
        }
        case 'onChange': {
            // only run validator on change event
            return eventType === 'change';
        }
        case 'onTouched': {
            /**
             * run validator on first blur event, and then every subsequent
             * blur/change event.
             */
            return eventType === 'blur' || hasBlurred;
        }
    }
};
// `runFieldValidator` runs all validators, and returns error messages.
const runFieldValidators = ({ value, validators, eventType, hasBlurred, }) => {
    if (!value)
        return [];
    return validators.reduce((prevErrors, validatorSpec) => {
        const { validator, validationMode, message } = validatorSpec;
        if (shouldValidate({ validationMode, eventType, hasBlurred })) {
            const hasError = !validator(value);
            return hasError ? [...prevErrors, message] : prevErrors;
        }
        return prevErrors;
    }, []);
};

// default `autoSignIn` flag is `true`
const DEFAULT_AUTO_SIGN_IN = true;
const EMPTY_STRING = '';
const sanitizePhoneNumber = (dialCode, phoneNumber) => `${dialCode}${phoneNumber}`.replace(/[^A-Z0-9+]/gi, '');
const selectUserAttributes = (_, key) => {
    // Allowlist of Cognito User Pool Attributes (from OpenID Connect specification)
    // See: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
    switch (key) {
        case 'address':
        case 'birthdate':
        case 'email':
        case 'family_name':
        case 'gender':
        case 'given_name':
        case 'locale':
        case 'middle_name':
        case 'name':
        case 'nickname':
        case 'phone_number':
        case 'picture':
        case 'preferred_username':
        case 'profile':
        case 'updated_at':
        case 'website':
        case 'zoneinfo':
            return true;
        // Otherwise, it's a custom attribute
        default:
            return key.startsWith('custom:');
    }
};
const getUserAttributes = (formValues) => {
    const { phone_number, ...userAttributes } = pickBy__default["default"](formValues, selectUserAttributes);
    // only include `phone_number` attribute in `userAttributes` if it has a value
    if (isString(phone_number) && phone_number !== EMPTY_STRING) {
        const { country_code } = formValues;
        return {
            ...userAttributes,
            phone_number: sanitizePhoneNumber(country_code, phone_number),
        };
    }
    return userAttributes;
};
const getSignUpInput = (username, formValues, loginMechanism) => {
    const { password, ...values } = formValues;
    const attributes = getUserAttributes(values);
    const options = {
        autoSignIn: DEFAULT_AUTO_SIGN_IN,
        userAttributes: {
            // use `username` value for `phone_number`
            ...(loginMechanism === 'phone_number'
                ? { ...attributes, phone_number: username }
                : attributes),
        },
    };
    return { username, password, options };
};
const getUsernameSignUp = ({ formValues, loginMechanisms, }) => {
    const loginMechanism = loginMechanisms[0];
    if (loginMechanism === 'phone_number') {
        const { country_code, phone_number } = formValues;
        return sanitizePhoneNumber(country_code, phone_number);
    }
    return formValues[loginMechanism];
};

const { assign } = xstate.actions;
const clearActorDoneData = assign({ actorDoneData: undefined });
const clearChallengeName = assign({ challengeName: undefined });
const clearMissingAttributes = assign({ missingAttributes: undefined });
const clearError = assign({ remoteError: undefined });
const clearFormValues = assign({ formValues: {} });
const clearTouched = assign({ touched: {} });
const clearUser = assign({ user: undefined });
const clearValidationError = assign({ validationError: {} });
/**
 * "set" actions
 */
const setTotpSecretCode = assign({
    totpSecretCode: (_, { data }) => {
        const { sharedSecret } = (data.nextStep?.totpSetupDetails ??
            {});
        return sharedSecret;
    },
});
const setSignInStep = assign({ step: 'SIGN_IN' });
const setShouldVerifyUserAttributeStep = assign({
    step: 'SHOULD_CONFIRM_USER_ATTRIBUTE',
});
const setConfirmAttributeCompleteStep = assign({
    step: 'CONFIRM_ATTRIBUTE_COMPLETE',
});
// map v6 `signInStep` to v5 `challengeName`
const setChallengeName = assign({
    challengeName: (_, { data }) => {
        const { signInStep } = data.nextStep;
        return signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE'
            ? 'SMS_MFA'
            : signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
                ? 'SOFTWARE_TOKEN_MFA'
                : undefined;
    },
});
const setUsernameForgotPassword = assign({
    username: ({ formValues, loginMechanisms }) => {
        const loginMechanism = loginMechanisms[0];
        const { username, country_code } = formValues;
        if (loginMechanism === 'phone_number') {
            // forgot password `formValues` uses `username` for base phone number value
            // prefix `country_code` for full `username`
            return sanitizePhoneNumber(country_code, username);
        }
        // default username field for loginMechanism === 'email' is "username" for SignIn
        return username;
    },
});
const setUsernameSignUp = assign({ username: getUsernameSignUp });
const setUsernameSignIn = assign({
    username: ({ formValues, loginMechanisms }) => {
        const loginMechanism = loginMechanisms[0];
        const { username, country_code } = formValues;
        if (loginMechanism === 'phone_number') {
            // sign in `formValues` uses `username` for base phone number value
            // prefix `country_code` for full `username`
            return sanitizePhoneNumber(country_code, username);
        }
        // return `email` and `username`
        return username;
    },
});
const setNextSignInStep = assign({
    step: (_, { data }) => data.nextStep.signInStep === 'DONE'
        ? 'SIGN_IN_COMPLETE'
        : data.nextStep.signInStep,
});
const setNextSignUpStep = assign({
    step: (_, { data }) => data.nextStep.signUpStep === 'DONE'
        ? 'SIGN_UP_COMPLETE'
        : data.nextStep.signUpStep,
});
const setNextResetPasswordStep = assign({
    step: (_, { data }) => data.nextStep.resetPasswordStep === 'DONE'
        ? 'RESET_PASSWORD_COMPLETE'
        : data.nextStep.resetPasswordStep,
});
const setMissingAttributes = assign({
    missingAttributes: (_, { data }) => data.nextStep?.missingAttributes,
});
const setFieldErrors = assign({
    validationError: (_, { data }) => data,
});
const setRemoteError = assign({
    remoteError: (_, { data }) => {
        if (data.name === 'NoUserPoolError') {
            return `Configuration error (see console) – please contact the administrator`;
        }
        return data?.message || data;
    },
});
const setUser = assign({ user: (_, { data }) => data });
const resolveCodeDeliveryDetails = (details) => ({
    Destination: details.destination,
    DeliveryMedium: details.deliveryMedium,
    AttributeName: details.attributName,
});
const setCodeDeliveryDetails = assign({
    codeDeliveryDetails: (_, { data }) => {
        if (data
            ?.nextStep?.codeDeliveryDetails) {
            return resolveCodeDeliveryDetails(data
                .nextStep.codeDeliveryDetails);
        }
        return resolveCodeDeliveryDetails(data);
    },
});
const handleInput = assign({
    formValues: (context, { data }) => {
        const { name, value } = data;
        return { ...context['formValues'], [name]: value };
    },
});
const handleSubmit = assign({
    formValues: (context, { data }) => 
    // do not trim password
    trimValues({ ...context['formValues'], ...data }, 'password'),
});
const handleBlur = assign({
    touched: (context, { data }) => ({
        ...context['touched'],
        [data.name]: true,
    }),
});
const setUnverifiedUserAttributes = assign({
    unverifiedUserAttributes: (_, { data }) => {
        const { email, phone_number } = data;
        const unverifiedUserAttributes = {
            ...(email && { email }),
            ...(phone_number && { phone_number }),
        };
        return unverifiedUserAttributes;
    },
});
const clearSelectedUserAttribute = assign({ selectedUserAttribute: undefined });
const setSelectedUserAttribute = assign({
    selectedUserAttribute: (context) => context.formValues?.unverifiedAttr,
});
// Maps to unexposed `ConfirmSignUpSignUpStep`
const setConfirmSignUpSignUpStep = assign({ step: 'CONFIRM_SIGN_UP' });
const ACTIONS = {
    clearActorDoneData,
    clearChallengeName,
    clearError,
    clearFormValues,
    clearMissingAttributes,
    clearSelectedUserAttribute,
    clearTouched,
    clearUser,
    clearValidationError,
    handleBlur,
    handleInput,
    handleSubmit,
    setChallengeName,
    setCodeDeliveryDetails,
    setFieldErrors,
    setMissingAttributes,
    setNextResetPasswordStep,
    setNextSignInStep,
    setNextSignUpStep,
    setRemoteError,
    setConfirmAttributeCompleteStep,
    setConfirmSignUpSignUpStep,
    setShouldVerifyUserAttributeStep,
    setSelectedUserAttribute,
    setSignInStep,
    setTotpSecretCode,
    setUser,
    setUnverifiedUserAttributes,
    setUsernameForgotPassword,
    setUsernameSignIn,
    setUsernameSignUp,
};

const SIGN_IN_STEP_MFA_CONFIRMATION = [
    'CONFIRM_SIGN_IN_WITH_SMS_CODE',
    'CONFIRM_SIGN_IN_WITH_TOTP_CODE',
];
// response next step guards
const shouldConfirmSignInWithNewPassword = (_, { data }) => data?.nextStep.signInStep ===
    'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED';
const shouldResetPasswordFromSignIn = (_, { data }) => data?.nextStep?.signInStep === 'RESET_PASSWORD';
const shouldConfirmSignUpFromSignIn = (_, { data }) => data?.nextStep.signInStep === 'CONFIRM_SIGN_UP';
const shouldAutoSignIn = (_, { data }) => data?.nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN';
const hasCompletedSignIn = (_, { data }) => data?.nextStep.signInStep === 'DONE';
const hasCompletedSignUp = (_, { data }) => data?.nextStep.signUpStep === 'DONE';
const hasCompletedResetPassword = (_, { data }) => data?.nextStep.resetPasswordStep === 'DONE';
// actor done guards read `step` from actor exit event
const hasCompletedAttributeConfirmation = (_, { data }) => data?.step === 'CONFIRM_ATTRIBUTE_COMPLETE';
const isConfirmUserAttributeStep = (_, { data }) => data?.step === 'CONFIRM_ATTRIBUTE_WITH_CODE';
const isShouldConfirmUserAttributeStep = (_, { data }) => data?.step === 'SHOULD_CONFIRM_USER_ATTRIBUTE';
const isResetPasswordStep = (_, { data }) => data?.step === 'RESET_PASSWORD';
const isConfirmSignUpStep = (_, { data }) => data?.step === 'CONFIRM_SIGN_UP';
// actor entry guards read `step` from actor context
const shouldConfirmSignIn = ({ step }) => SIGN_IN_STEP_MFA_CONFIRMATION.includes(step);
const shouldSetupTotp = ({ step }) => step === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP';
const shouldResetPassword = ({ step }) => step === 'RESET_PASSWORD';
const shouldConfirmResetPassword = ({ step }) => step === 'CONFIRM_RESET_PASSWORD_WITH_CODE';
const shouldConfirmSignUp = ({ step }) => step === 'CONFIRM_SIGN_UP';
// miscellaneous guards
const shouldVerifyAttribute = (_, { data }) => {
    const { phone_number_verified, email_verified } = data;
    // email/phone_verified is returned as a string
    const emailNotVerified = email_verified === undefined || email_verified === 'false';
    const phoneNotVerified = phone_number_verified === undefined || phone_number_verified === 'false';
    // only request verification if both email and phone are not verified
    return emailNotVerified && phoneNotVerified;
};
/**
 * This guard covers an edge case that exists in the current state of the UI.
 * As of now, our ConfirmSignUp screen only supports showing an input for a
 * confirmation code. However, a Cognito UserPool can instead verify users
 * through a link that gets emailed to them. If a user verifies through the
 * link and then they click on the "Resend Code" button, they will get an error
 * saying that the user has already been confirmed. If we encounter that error,
 * we want to just funnel them through the rest of the flow. In the future, we will
 * want to update our UI to support both confirmation codes and links.
 *
 * https://github.com/aws-amplify/amplify-ui/issues/219
 */
const isUserAlreadyConfirmed = (_, { data }) => data.message === 'User is already confirmed.';
const GUARDS = {
    hasCompletedAttributeConfirmation,
    hasCompletedResetPassword,
    hasCompletedSignIn,
    hasCompletedSignUp,
    isConfirmSignUpStep,
    isConfirmUserAttributeStep,
    isResetPasswordStep,
    isShouldConfirmUserAttributeStep,
    isUserAlreadyConfirmed,
    shouldAutoSignIn,
    shouldConfirmResetPassword,
    shouldConfirmSignIn,
    shouldConfirmSignInWithNewPassword,
    shouldConfirmSignUp,
    shouldConfirmSignUpFromSignIn,
    shouldResetPassword,
    shouldResetPasswordFromSignIn,
    shouldSetupTotp,
    shouldVerifyAttribute,
};

// Runs all validators given. Resolves if there are no error. Rejects otherwise.
const runValidators = async (formData, touchData, passwordSettings, validators) => {
    const errors = await Promise.all(validators.map((validator) => validator(formData, touchData, passwordSettings)));
    const mergedError = merge__default["default"]({}, ...errors);
    if (isEmpty(mergedError)) {
        // no errors were found
        return Promise.resolve();
    }
    else {
        return Promise.reject(mergedError);
    }
};

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
        const result = awsAmplify.Amplify.getConfig();
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
    getCurrentUser: auth.getCurrentUser,
    handleSignIn: auth.signIn,
    handleSignUp: auth.signUp,
    handleConfirmSignIn: auth.confirmSignIn,
    handleConfirmSignUp: auth.confirmSignUp,
    handleForgotPasswordSubmit: auth.confirmResetPassword,
    handleForgotPassword: auth.resetPassword,
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

function forgotPasswordActor({ services, }) {
    return xstate.createMachine({
        id: 'forgotPasswordActor',
        initial: 'init',
        predictableActionArguments: true,
        states: {
            init: {
                always: [
                    {
                        cond: 'shouldResetPassword',
                        target: 'confirmResetPassword',
                    },
                    {
                        cond: 'shouldConfirmResetPassword',
                        target: 'confirmResetPassword',
                    },
                    {
                        target: 'forgotPassword',
                    },
                ],
            },
            forgotPassword: {
                initial: 'edit',
                entry: 'sendUpdate',
                exit: ['clearError', 'clearTouched'],
                states: {
                    edit: {
                        entry: 'sendUpdate',
                        on: {
                            SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                            CHANGE: { actions: 'handleInput' },
                            BLUR: { actions: 'handleBlur' },
                        },
                    },
                    submit: {
                        tags: 'pending',
                        entry: ['sendUpdate', 'clearError', 'setUsernameForgotPassword'],
                        invoke: {
                            src: 'handleResetPassword',
                            onDone: {
                                actions: [
                                    'setCodeDeliveryDetails',
                                    'setNextResetPasswordStep',
                                ],
                                target: '#forgotPasswordActor.confirmResetPassword',
                            },
                            onError: {
                                actions: 'setRemoteError',
                                target: 'edit',
                            },
                        },
                    },
                },
            },
            confirmResetPassword: {
                type: 'parallel',
                exit: ['clearFormValues', 'clearError', 'clearTouched'],
                states: {
                    validation: {
                        initial: 'pending',
                        states: {
                            pending: {
                                invoke: {
                                    src: 'validateFields',
                                    onDone: {
                                        target: 'valid',
                                        actions: 'clearValidationError',
                                    },
                                    onError: {
                                        target: 'invalid',
                                        actions: 'setFieldErrors',
                                    },
                                },
                            },
                            valid: { entry: 'sendUpdate' },
                            invalid: { entry: 'sendUpdate' },
                        },
                        on: {
                            CHANGE: {
                                actions: 'handleInput',
                                target: '.pending',
                            },
                            BLUR: {
                                actions: 'handleBlur',
                                target: '.pending',
                            },
                        },
                    },
                    submission: {
                        initial: 'idle',
                        states: {
                            idle: {
                                entry: 'sendUpdate',
                                on: {
                                    SUBMIT: { actions: 'handleSubmit', target: 'validate' },
                                    RESEND: 'resendCode',
                                    CHANGE: { actions: 'handleInput' },
                                    BLUR: { actions: 'handleBlur' },
                                },
                            },
                            validate: {
                                entry: 'sendUpdate',
                                invoke: {
                                    src: 'validateFields',
                                    onDone: {
                                        target: 'pending',
                                        actions: 'clearValidationError',
                                    },
                                    onError: {
                                        target: 'idle',
                                        actions: 'setFieldErrors',
                                    },
                                },
                            },
                            resendCode: {
                                tags: 'pending',
                                entry: ['clearError', 'sendUpdate'],
                                invoke: {
                                    src: 'handleResetPassword',
                                    onDone: { target: 'idle' },
                                    onError: { actions: 'setRemoteError', target: 'idle' },
                                },
                            },
                            pending: {
                                tags: 'pending',
                                entry: ['clearError', 'sendUpdate'],
                                invoke: {
                                    src: 'handleConfirmResetPassword',
                                    onDone: [
                                        {
                                            cond: 'hasCompletedResetPassword',
                                            actions: 'setNextResetPasswordStep',
                                            target: '#forgotPasswordActor.resolved',
                                        },
                                        {
                                            actions: 'setSignInStep',
                                            target: '#forgotPasswordActor.resolved',
                                        },
                                    ],
                                    onError: { actions: 'setRemoteError', target: 'idle' },
                                },
                            },
                        },
                    },
                },
            },
            resolved: {
                type: 'final',
                data: ({ step }) => ({ step }),
            },
        },
    }, {
        // sendUpdate is a HOC
        actions: { ...ACTIONS, sendUpdate: xstate.sendUpdate() },
        guards: GUARDS,
        services: {
            handleResetPassword({ username }) {
                return services.handleForgotPassword({ username });
            },
            handleConfirmResetPassword({ formValues, username }) {
                const { confirmation_code: confirmationCode, password: newPassword } = formValues;
                return services.handleForgotPasswordSubmit({
                    confirmationCode,
                    newPassword,
                    username,
                });
            },
            validateFields(context) {
                return runValidators(context.formValues, context.touched, context.passwordSettings, [
                    defaultServices.validateFormPassword,
                    defaultServices.validateConfirmPassword,
                ]);
            },
        },
    });
}

const getFederatedSignInState = (target) => ({
    entry: ['sendUpdate', 'clearError'],
    invoke: {
        src: 'signInWithRedirect',
        onDone: { target },
        onError: { actions: 'setRemoteError', target },
    },
});

const handleSignInResponse = {
    onDone: [
        {
            cond: 'hasCompletedSignIn',
            actions: 'setNextSignInStep',
            target: '#signInActor.fetchUserAttributes',
        },
        {
            cond: 'shouldConfirmSignInWithNewPassword',
            actions: ['setMissingAttributes', 'setNextSignInStep'],
            target: '#signInActor.forceChangePassword',
        },
        {
            cond: 'shouldResetPasswordFromSignIn',
            actions: 'setNextSignInStep',
            target: '#signInActor.resetPassword',
        },
        {
            cond: 'shouldConfirmSignUpFromSignIn',
            actions: 'setNextSignInStep',
            target: '#signInActor.resendSignUpCode',
        },
        {
            actions: [
                'setChallengeName',
                'setMissingAttributes',
                'setNextSignInStep',
                'setTotpSecretCode',
            ],
            target: '#signInActor.init',
        },
    ],
    onError: { actions: 'setRemoteError', target: 'edit' },
};
const handleFetchUserAttributesResponse$1 = {
    onDone: [
        {
            cond: 'shouldVerifyAttribute',
            actions: [
                'setShouldVerifyUserAttributeStep',
                'setUnverifiedUserAttributes',
            ],
            target: '#signInActor.resolved',
        },
        {
            actions: 'setConfirmAttributeCompleteStep',
            target: '#signInActor.resolved',
        },
    ],
    onError: {
        actions: 'setConfirmAttributeCompleteStep',
        target: '#signInActor.resolved',
    },
};
function signInActor({ services }) {
    return xstate.createMachine({
        id: 'signInActor',
        initial: 'init',
        predictableActionArguments: true,
        states: {
            init: {
                always: [
                    {
                        cond: 'shouldConfirmSignIn',
                        target: 'confirmSignIn',
                    },
                    {
                        cond: 'shouldSetupTotp',
                        target: 'setupTotp',
                    },
                    {
                        cond: ({ step }) => step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
                        actions: 'setActorDoneData',
                        target: 'forceChangePassword',
                    },
                    { target: 'signIn' },
                ],
            },
            federatedSignIn: getFederatedSignInState('signIn'),
            fetchUserAttributes: {
                invoke: {
                    src: 'fetchUserAttributes',
                    ...handleFetchUserAttributesResponse$1,
                },
            },
            resendSignUpCode: {
                invoke: {
                    src: 'handleResendSignUpCode',
                    onDone: {
                        actions: 'setCodeDeliveryDetails',
                        target: '#signInActor.resolved',
                    },
                    onError: {
                        actions: 'setRemoteError',
                        target: '#signInActor.signIn',
                    },
                },
            },
            resetPassword: {
                invoke: {
                    src: 'resetPassword',
                    onDone: [
                        {
                            actions: 'setCodeDeliveryDetails',
                            target: '#signInActor.resolved',
                        },
                    ],
                    onError: { actions: ['setRemoteError', 'sendUpdate'] },
                },
            },
            signIn: {
                initial: 'edit',
                exit: 'clearTouched',
                states: {
                    edit: {
                        entry: 'sendUpdate',
                        on: {
                            CHANGE: { actions: 'handleInput' },
                            FEDERATED_SIGN_IN: { target: '#signInActor.federatedSignIn' },
                            SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                        },
                    },
                    submit: {
                        tags: 'pending',
                        entry: ['clearError', 'sendUpdate', 'setUsernameSignIn'],
                        exit: 'clearFormValues',
                        invoke: { src: 'handleSignIn', ...handleSignInResponse },
                    },
                },
            },
            confirmSignIn: {
                initial: 'edit',
                exit: [
                    'clearChallengeName',
                    'clearFormValues',
                    'clearError',
                    'clearTouched',
                ],
                states: {
                    edit: {
                        entry: 'sendUpdate',
                        on: {
                            SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                            SIGN_IN: '#signInActor.signIn',
                            CHANGE: { actions: 'handleInput' },
                        },
                    },
                    submit: {
                        tags: 'pending',
                        entry: ['clearError', 'sendUpdate'],
                        invoke: {
                            src: 'confirmSignIn',
                            ...handleSignInResponse,
                        },
                    },
                },
            },
            forceChangePassword: {
                entry: 'sendUpdate',
                type: 'parallel',
                exit: ['clearFormValues', 'clearError', 'clearTouched'],
                states: {
                    validation: {
                        initial: 'pending',
                        states: {
                            pending: {
                                invoke: {
                                    src: 'validateFields',
                                    onDone: {
                                        target: 'valid',
                                        actions: 'clearValidationError',
                                    },
                                    onError: {
                                        target: 'invalid',
                                        actions: 'setFieldErrors',
                                    },
                                },
                            },
                            valid: { entry: 'sendUpdate' },
                            invalid: { entry: 'sendUpdate' },
                        },
                        on: {
                            SIGN_IN: {
                                actions: 'setSignInStep',
                                target: '#signInActor.resolved',
                            },
                            CHANGE: {
                                actions: 'handleInput',
                                target: '.pending',
                            },
                            BLUR: {
                                actions: 'handleBlur',
                                target: '.pending',
                            },
                        },
                    },
                    submit: {
                        initial: 'edit',
                        entry: 'clearError',
                        states: {
                            edit: {
                                entry: 'sendUpdate',
                                on: {
                                    SUBMIT: { actions: 'handleSubmit', target: 'validate' },
                                },
                            },
                            validate: {
                                entry: 'sendUpdate',
                                invoke: {
                                    src: 'validateFields',
                                    onDone: {
                                        actions: 'clearValidationError',
                                        target: 'pending',
                                    },
                                    onError: { actions: 'setFieldErrors', target: 'edit' },
                                },
                            },
                            pending: {
                                tags: 'pending',
                                entry: ['sendUpdate', 'clearError'],
                                invoke: {
                                    src: 'handleForceChangePassword',
                                    ...handleSignInResponse,
                                },
                            },
                        },
                    },
                },
            },
            setupTotp: {
                initial: 'edit',
                exit: ['clearFormValues', 'clearError', 'clearTouched'],
                states: {
                    edit: {
                        entry: 'sendUpdate',
                        on: {
                            SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                            SIGN_IN: '#signInActor.signIn',
                            CHANGE: { actions: 'handleInput' },
                        },
                    },
                    submit: {
                        tags: 'pending',
                        entry: ['sendUpdate', 'clearError'],
                        invoke: { src: 'confirmSignIn', ...handleSignInResponse },
                    },
                },
            },
            resolved: {
                type: 'final',
                data: (context) => ({
                    codeDeliveryDetails: context.codeDeliveryDetails,
                    remoteError: context.remoteError,
                    step: context.step,
                    unverifiedUserAttributes: context.unverifiedUserAttributes,
                    username: context.username,
                }),
            },
        },
    }, {
        // sendUpdate is a HOC
        actions: { ...ACTIONS, sendUpdate: xstate.sendUpdate() },
        guards: GUARDS,
        services: {
            async fetchUserAttributes() {
                return auth.fetchUserAttributes();
            },
            resetPassword({ username }) {
                return auth.resetPassword({ username });
            },
            handleResendSignUpCode({ username }) {
                return auth.resendSignUpCode({ username });
            },
            handleSignIn({ formValues, username }) {
                const { password } = formValues;
                return services.handleSignIn({ username, password });
            },
            confirmSignIn({ formValues }) {
                const { confirmation_code: challengeResponse } = formValues;
                return services.handleConfirmSignIn({ challengeResponse });
            },
            async handleForceChangePassword({ formValues }) {
                let { password: challengeResponse, phone_number, country_code, 
                // destructure and toss UI confirm_password field
                // to prevent error from sending to confirmSignIn
                confirm_password, ...userAttributes } = formValues;
                let phoneNumberWithCountryCode;
                if (phone_number) {
                    phoneNumberWithCountryCode =
                        `${country_code}${phone_number}`.replace(/[^A-Z0-9+]/gi, '');
                    userAttributes = {
                        ...userAttributes,
                        phone_number: phoneNumberWithCountryCode,
                    };
                }
                const input = {
                    challengeResponse,
                    options: { userAttributes },
                };
                return auth.confirmSignIn(input);
            },
            signInWithRedirect(_, { data }) {
                return auth.signInWithRedirect(data);
            },
            async validateFields(context) {
                return runValidators(context.formValues, context.touched, context.passwordSettings, [
                    defaultServices.validateFormPassword,
                    defaultServices.validateConfirmPassword,
                ]);
            },
        },
    });
}

const handleResetPasswordResponse = {
    onDone: [
        { actions: 'setCodeDeliveryDetails', target: '#signUpActor.resolved' },
    ],
    onError: { actions: ['setRemoteError', 'sendUpdate'] },
};
const handleAutoSignInResponse = {
    onDone: [
        {
            cond: 'hasCompletedSignIn',
            actions: 'setNextSignInStep',
            target: '#signUpActor.fetchUserAttributes',
        },
        {
            cond: 'shouldConfirmSignInWithNewPassword',
            actions: 'setNextSignInStep',
            target: '#signUpActor.resolved',
        },
        {
            cond: 'shouldResetPasswordFromSignIn',
            actions: 'setNextSignInStep',
            target: '#signUpActor.resetPassword',
        },
        {
            cond: 'shouldConfirmSignUpFromSignIn',
            actions: 'setNextSignInStep',
            target: '#signUpActor.resendSignUpCode',
        },
        {
            actions: [
                'setNextSignInStep',
                'setChallengeName',
                'setMissingAttributes',
                'setTotpSecretCode',
            ],
            target: '#signUpActor.resolved',
        },
    ],
    onError: {
        actions: 'setRemoteError',
        target: '#signUpActor.resolved',
    },
};
const handleFetchUserAttributesResponse = {
    onDone: [
        {
            cond: 'shouldVerifyAttribute',
            actions: [
                'setShouldVerifyUserAttributeStep',
                'setUnverifiedUserAttributes',
            ],
            target: '#signUpActor.resolved',
        },
        {
            actions: 'setConfirmAttributeCompleteStep',
            target: '#signUpActor.resolved',
        },
    ],
    onError: {
        actions: 'setConfirmAttributeCompleteStep',
        target: '#signUpActor.resolved',
    },
};
function signUpActor({ services }) {
    return xstate.createMachine({
        id: 'signUpActor',
        initial: 'init',
        predictableActionArguments: true,
        states: {
            init: {
                always: [
                    { cond: 'shouldConfirmSignUp', target: 'confirmSignUp' },
                    { target: 'signUp' },
                ],
            },
            autoSignIn: {
                tags: 'pending',
                invoke: { src: 'autoSignIn', ...handleAutoSignInResponse },
            },
            fetchUserAttributes: {
                invoke: {
                    src: 'fetchUserAttributes',
                    ...handleFetchUserAttributesResponse,
                },
            },
            federatedSignIn: getFederatedSignInState('signUp'),
            resetPassword: {
                invoke: { src: 'resetPassword', ...handleResetPasswordResponse },
            },
            resendSignUpCode: {
                tags: 'pending',
                entry: 'sendUpdate',
                exit: 'sendUpdate',
                invoke: {
                    src: 'resendSignUpCode',
                    onDone: {
                        actions: ['setCodeDeliveryDetails', 'sendUpdate'],
                        target: '#signUpActor.confirmSignUp',
                    },
                    onError: [
                        {
                            cond: 'isUserAlreadyConfirmed',
                            target: '#signUpActor.resolved',
                        },
                        { actions: ['setRemoteError', 'sendUpdate'] },
                    ],
                },
            },
            signUp: {
                type: 'parallel',
                exit: 'clearTouched',
                on: {
                    FEDERATED_SIGN_IN: { target: 'federatedSignIn' },
                },
                states: {
                    validation: {
                        initial: 'pending',
                        states: {
                            pending: {
                                invoke: {
                                    src: 'validateSignUp',
                                    onDone: {
                                        actions: 'clearValidationError',
                                        target: 'valid',
                                    },
                                    onError: { actions: 'setFieldErrors', target: 'invalid' },
                                },
                            },
                            valid: { entry: 'sendUpdate' },
                            invalid: { entry: 'sendUpdate' },
                        },
                        on: {
                            BLUR: { actions: 'handleBlur', target: '.pending' },
                            CHANGE: { actions: 'handleInput', target: '.pending' },
                        },
                    },
                    submission: {
                        initial: 'idle',
                        states: {
                            idle: {
                                entry: ['sendUpdate'],
                                on: {
                                    SUBMIT: { actions: 'handleSubmit', target: 'validate' },
                                },
                            },
                            validate: {
                                entry: 'sendUpdate',
                                invoke: {
                                    src: 'validateSignUp',
                                    onDone: {
                                        target: 'handleSignUp',
                                        actions: 'clearValidationError',
                                    },
                                    onError: { actions: 'setFieldErrors', target: 'idle' },
                                },
                            },
                            handleSignUp: {
                                tags: 'pending',
                                entry: ['setUsernameSignUp', 'clearError'],
                                exit: 'sendUpdate',
                                invoke: {
                                    src: 'handleSignUp',
                                    onDone: [
                                        {
                                            cond: 'hasCompletedSignUp',
                                            actions: 'setNextSignUpStep',
                                            target: '#signUpActor.resolved',
                                        },
                                        {
                                            cond: 'shouldAutoSignIn',
                                            actions: 'setNextSignUpStep',
                                            target: '#signUpActor.autoSignIn',
                                        },
                                        {
                                            actions: [
                                                'setCodeDeliveryDetails',
                                                'setNextSignUpStep',
                                            ],
                                            target: '#signUpActor.init',
                                        },
                                    ],
                                    onError: {
                                        actions: ['sendUpdate', 'setRemoteError'],
                                        target: 'idle',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            confirmSignUp: {
                initial: 'edit',
                entry: 'sendUpdate',
                states: {
                    edit: {
                        on: {
                            SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                            CHANGE: { actions: 'handleInput' },
                            BLUR: { actions: 'handleBlur' },
                            RESEND: '#signUpActor.resendSignUpCode',
                        },
                    },
                    submit: {
                        tags: 'pending',
                        entry: ['clearError', 'sendUpdate'],
                        invoke: {
                            src: 'confirmSignUp',
                            onDone: [
                                {
                                    cond: 'shouldAutoSignIn',
                                    actions: ['setNextSignUpStep', 'clearFormValues'],
                                    target: '#signUpActor.autoSignIn',
                                },
                                {
                                    actions: 'setNextSignUpStep',
                                    target: '#signUpActor.init',
                                },
                            ],
                            onError: {
                                actions: ['setRemoteError', 'sendUpdate'],
                                target: 'edit',
                            },
                        },
                    },
                },
            },
            resolved: {
                type: 'final',
                data: (context) => ({
                    challengeName: context.challengeName,
                    missingAttributes: context.missingAttributes,
                    remoteError: context.remoteError,
                    step: context.step,
                    totpSecretCode: context.totpSecretCode,
                    username: context.username,
                    unverifiedUserAttributes: context.unverifiedUserAttributes,
                }),
            },
        },
    }, {
        // sendUpdate is a HOC
        actions: { ...ACTIONS, sendUpdate: xstate.sendUpdate() },
        guards: GUARDS,
        services: {
            autoSignIn() {
                return auth.autoSignIn();
            },
            async fetchUserAttributes() {
                return auth.fetchUserAttributes();
            },
            confirmSignUp({ formValues, username }) {
                const { confirmation_code: confirmationCode } = formValues;
                const input = { username, confirmationCode };
                return services.handleConfirmSignUp(input);
            },
            resendSignUpCode({ username }) {
                return auth.resendSignUpCode({ username });
            },
            signInWithRedirect(_, { data }) {
                return auth.signInWithRedirect(data);
            },
            handleSignUp(context) {
                const { formValues, loginMechanisms, username } = context;
                const loginMechanism = loginMechanisms[0];
                const input = getSignUpInput(username, formValues, loginMechanism);
                return services.handleSignUp(input);
            },
            async validateSignUp(context) {
                // This needs to exist in the machine to reference new `services`
                return runValidators(context.formValues, context.touched, context.passwordSettings, [
                    // Validation of password
                    services.validateFormPassword,
                    // Validation for default form fields
                    services.validateConfirmPassword,
                    services.validatePreferredUsername,
                    // Validation for any custom Sign Up fields
                    services.validateCustomSignUp,
                ]);
            },
        },
    });
}

const signOutActor = () => {
    return xstate.createMachine({
        initial: 'pending',
        id: 'signOutActor',
        predictableActionArguments: true,
        states: {
            pending: {
                tags: 'pending',
                invoke: {
                    src: 'signOut',
                    onDone: 'resolved',
                    onError: 'rejected',
                },
            },
            resolved: { type: 'final' },
            rejected: { type: 'final' },
        },
    }, {
        services: {
            signOut: () => auth.signOut(),
        },
    });
};

function verifyUserAttributesActor() {
    return xstate.createMachine({
        id: 'verifyUserAttributesActor',
        initial: 'selectUserAttributes',
        predictableActionArguments: true,
        states: {
            selectUserAttributes: {
                initial: 'edit',
                exit: ['clearError', 'clearTouched', 'sendUpdate'],
                states: {
                    edit: {
                        entry: 'sendUpdate',
                        on: {
                            SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                            SKIP: { target: '#verifyUserAttributesActor.resolved' },
                            CHANGE: { actions: 'handleInput' },
                        },
                    },
                    submit: {
                        tags: 'pending',
                        entry: ['clearError', 'sendUpdate'],
                        invoke: {
                            src: 'sendUserAttributeVerificationCode',
                            onDone: {
                                actions: [
                                    'setSelectedUserAttribute',
                                    'setCodeDeliveryDetails',
                                ],
                                target: '#verifyUserAttributesActor.confirmVerifyUserAttribute',
                            },
                            onError: {
                                actions: 'setRemoteError',
                                target: 'edit',
                            },
                        },
                    },
                },
            },
            confirmVerifyUserAttribute: {
                initial: 'edit',
                exit: ['clearError', 'clearFormValues', 'clearTouched'],
                states: {
                    edit: {
                        entry: 'sendUpdate',
                        on: {
                            SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                            SKIP: '#verifyUserAttributesActor.resolved',
                            CHANGE: { actions: 'handleInput' },
                        },
                    },
                    submit: {
                        tags: 'pending',
                        entry: ['clearError', 'sendUpdate'],
                        invoke: {
                            src: 'confirmVerifyUserAttribute',
                            onDone: {
                                actions: [
                                    'setConfirmAttributeCompleteStep',
                                    'clearSelectedUserAttribute',
                                ],
                                target: '#verifyUserAttributesActor.resolved',
                            },
                            onError: {
                                actions: 'setRemoteError',
                                target: 'edit',
                            },
                        },
                    },
                },
            },
            resolved: { type: 'final', data: ({ step }) => ({ step }) },
        },
    }, {
        // sendUpdate is a HOC
        actions: { ...ACTIONS, sendUpdate: xstate.sendUpdate() },
        services: {
            sendUserAttributeVerificationCode({ formValues: { unverifiedAttr } }) {
                const input = {
                    userAttributeKey: unverifiedAttr,
                };
                return auth.sendUserAttributeVerificationCode(input);
            },
            async confirmVerifyUserAttribute({ formValues: { confirmation_code: confirmationCode }, selectedUserAttribute, }) {
                const input = {
                    confirmationCode,
                    userAttributeKey: selectedUserAttribute,
                };
                return auth.confirmUserAttribute(input);
            },
            async validateFields(context) {
                return runValidators(context.formValues, context.touched, context.passwordSettings, [
                    defaultServices.validateFormPassword,
                    defaultServices.validateConfirmPassword,
                ]);
            },
        },
    });
}

const getActorContext = (context, defaultStep) => ({
    ...context.actorDoneData,
    step: context?.actorDoneData?.step ?? defaultStep,
    // initialize empty objects on actor start
    formValues: {},
    touched: {},
    validationError: {},
    // values included on `context.config` that should be available in actors
    formFields: context.config?.formFields,
    loginMechanisms: context.config?.loginMechanisms,
    passwordSettings: context.config?.passwordSettings,
    signUpAttributes: context.config?.signUpAttributes,
    socialProviders: context.config?.socialProviders,
});
const { choose, stop } = xstate.actions;
const stopActor = (machineId) => stop(machineId);
// setup step waits for ui to emit INIT action to proceed to configure
const LEGACY_WAIT_CONFIG = {
    on: {
        INIT: {
            actions: 'configure',
            target: 'getConfig',
        },
        SIGN_OUT: '#authenticator.signOut',
    },
};
// setup step proceeds directly to configure
const NEXT_WAIT_CONFIG = {
    always: { actions: 'configure', target: 'getConfig' },
};
function createAuthenticatorMachine(options) {
    const { useNextWaitConfig, ...overrideConfigServices } = options ?? {};
    const initConfig = useNextWaitConfig ? NEXT_WAIT_CONFIG : LEGACY_WAIT_CONFIG;
    return xstate.createMachine({
        id: 'authenticator',
        initial: 'idle',
        context: {
            user: undefined,
            config: {},
            services: defaultServices,
            actorRef: undefined,
            hasSetup: false,
        },
        predictableActionArguments: true,
        states: {
            // See: https://xstate.js.org/docs/guides/communication.html#invoking-promises
            idle: {
                invoke: {
                    src: 'handleGetCurrentUser',
                    onDone: { actions: 'setUser', target: 'setup' },
                    onError: { target: 'setup' },
                },
            },
            setup: {
                initial: 'initConfig',
                states: {
                    initConfig,
                    getConfig: {
                        invoke: {
                            src: 'getAmplifyConfig',
                            onDone: [
                                {
                                    actions: ['applyAmplifyConfig', 'setHasSetup'],
                                    cond: 'hasUser',
                                    target: '#authenticator.authenticated',
                                },
                                {
                                    actions: ['applyAmplifyConfig', 'setHasSetup'],
                                    target: 'goToInitialState',
                                },
                            ],
                        },
                    },
                    goToInitialState: {
                        always: [
                            {
                                cond: 'isInitialStateSignUp',
                                target: '#authenticator.signUpActor',
                            },
                            {
                                cond: 'isInitialStateResetPassword',
                                target: '#authenticator.forgotPasswordActor',
                            },
                            { target: '#authenticator.signInActor' },
                        ],
                    },
                },
            },
            getCurrentUser: {
                invoke: {
                    src: 'handleGetCurrentUser',
                    onDone: {
                        actions: 'setUser',
                        target: '#authenticator.authenticated',
                    },
                    onError: { target: '#authenticator.setup' },
                },
            },
            signInActor: {
                initial: 'spawnActor',
                states: {
                    spawnActor: {
                        always: { actions: 'spawnSignInActor', target: 'runActor' },
                    },
                    runActor: {
                        entry: 'clearActorDoneData',
                        exit: stopActor('signInActor'),
                    },
                },
                on: {
                    FORGOT_PASSWORD: 'forgotPasswordActor',
                    SIGN_IN: 'signInActor',
                    SIGN_UP: 'signUpActor',
                    'done.invoke.signInActor': [
                        {
                            cond: 'hasCompletedAttributeConfirmation',
                            target: '#authenticator.getCurrentUser',
                        },
                        {
                            cond: 'isShouldConfirmUserAttributeStep',
                            actions: 'setActorDoneData',
                            target: '#authenticator.verifyUserAttributesActor',
                        },
                        {
                            cond: 'isResetPasswordStep',
                            actions: 'setActorDoneData',
                            target: '#authenticator.forgotPasswordActor',
                        },
                        {
                            cond: 'isConfirmSignUpStep',
                            actions: 'setActorDoneData',
                            target: '#authenticator.signUpActor',
                        },
                    ],
                },
            },
            signUpActor: {
                initial: 'spawnActor',
                states: {
                    spawnActor: {
                        always: { actions: 'spawnSignUpActor', target: 'runActor' },
                    },
                    runActor: {
                        entry: 'clearActorDoneData',
                        exit: stopActor('signUpActor'),
                    },
                },
                on: {
                    SIGN_IN: 'signInActor',
                    'done.invoke.signUpActor': [
                        {
                            cond: 'hasCompletedAttributeConfirmation',
                            target: '#authenticator.getCurrentUser',
                        },
                        {
                            cond: 'isShouldConfirmUserAttributeStep',
                            actions: 'setActorDoneData',
                            target: '#authenticator.verifyUserAttributesActor',
                        },
                        {
                            cond: 'isConfirmUserAttributeStep',
                            target: '#authenticator.verifyUserAttributesActor',
                        },
                        {
                            actions: 'setActorDoneData',
                            target: '#authenticator.signInActor',
                        },
                    ],
                },
            },
            forgotPasswordActor: {
                initial: 'spawnActor',
                states: {
                    spawnActor: {
                        always: {
                            actions: 'spawnForgotPasswordActor',
                            target: 'runActor',
                        },
                    },
                    runActor: {
                        entry: 'clearActorDoneData',
                        exit: stopActor('forgotPasswordActor'),
                    },
                },
                on: {
                    SIGN_IN: 'signInActor',
                    'done.invoke.forgotPasswordActor': [
                        { target: '#authenticator.signInActor' },
                    ],
                },
            },
            verifyUserAttributesActor: {
                initial: 'spawnActor',
                states: {
                    spawnActor: {
                        always: {
                            actions: 'spawnVerifyUserAttributesActor',
                            target: 'runActor',
                        },
                    },
                    runActor: {
                        entry: 'clearActorDoneData',
                        exit: stopActor('verifyUserAttributesActor'),
                    },
                },
                on: {
                    'done.invoke.verifyUserAttributesActor': [
                        {
                            actions: 'setActorDoneData',
                            target: '#authenticator.getCurrentUser',
                        },
                    ],
                },
            },
            authenticated: {
                initial: 'idle',
                states: {
                    idle: { on: { TOKEN_REFRESH: 'refreshUser' } },
                    refreshUser: {
                        invoke: {
                            src: '#authenticator.getCurrentUser',
                            onDone: { actions: 'setUser', target: 'idle' },
                            onError: { target: '#authenticator.signOut' },
                        },
                    },
                },
                on: { SIGN_OUT: 'signOut' },
            },
            signOut: {
                initial: 'spawnActor',
                states: {
                    spawnActor: {
                        always: { actions: 'spawnSignOutActor', target: 'runActor' },
                    },
                    runActor: {
                        entry: 'clearActorDoneData',
                        exit: stopActor('signOutActor'),
                    },
                },
                on: {
                    'done.invoke.signOutActor': {
                        actions: 'clearUser',
                        target: 'setup.getConfig',
                    },
                },
            },
        },
        on: {
            SIGN_IN_WITH_REDIRECT: { target: '#authenticator.getCurrentUser' },
            CHANGE: { actions: 'forwardToActor' },
            BLUR: { actions: 'forwardToActor' },
            SUBMIT: { actions: 'forwardToActor' },
            FEDERATED_SIGN_IN: { actions: 'forwardToActor' },
            RESEND: { actions: 'forwardToActor' },
            SIGN_IN: { actions: 'forwardToActor' },
            SKIP: { actions: 'forwardToActor' },
        },
    }, {
        actions: {
            ...ACTIONS,
            forwardToActor: choose([
                { cond: 'hasActor', actions: xstate.forwardTo(({ actorRef }) => actorRef) },
            ]),
            setActorDoneData: xstate.assign({
                actorDoneData: (context, event) => ({
                    challengeName: event.data.challengeName,
                    codeDeliveryDetails: event.data.codeDeliveryDetails,
                    missingAttributes: event.data.missingAttributes,
                    remoteError: event.data.remoteError,
                    username: event.data.username,
                    step: event.data.step,
                    totpSecretCode: event.data.totpSecretCode,
                    unverifiedUserAttributes: event.data.unverifiedUserAttributes,
                }),
            }),
            applyAmplifyConfig: xstate.assign({
                config(context, { data: cliConfig }) {
                    // Prefer explicitly configured settings over default CLI values\
                    const { loginMechanisms = cliConfig.loginMechanisms ?? [], signUpAttributes = cliConfig.signUpAttributes ?? [], socialProviders = cliConfig.socialProviders ?? [], initialState, formFields: _formFields, passwordSettings = cliConfig.passwordFormat ??
                        {}, } = context.config;
                    // By default, Cognito assumes `username`, so there isn't a different username attribute like `email`.
                    // We explicitly add it as a login mechanism to be consistent with Admin UI's language.
                    if (loginMechanisms.length === 0) {
                        loginMechanisms.push('username');
                    }
                    const formFields = convertFormFields(_formFields) ?? {};
                    return {
                        formFields,
                        initialState,
                        loginMechanisms,
                        passwordSettings,
                        signUpAttributes,
                        socialProviders,
                    };
                },
            }),
            spawnSignInActor: xstate.assign({
                actorRef: (context, _) => {
                    const { services } = context;
                    const actor = signInActor({ services }).withContext(getActorContext(context, 'SIGN_IN'));
                    return xstate.spawn(actor, { name: 'signInActor' });
                },
            }),
            spawnSignUpActor: xstate.assign({
                actorRef: (context, _) => {
                    const { services } = context;
                    const actor = signUpActor({ services }).withContext(getActorContext(context, 'SIGN_UP'));
                    return xstate.spawn(actor, { name: 'signUpActor' });
                },
            }),
            spawnForgotPasswordActor: xstate.assign({
                actorRef: (context, _) => {
                    const { services } = context;
                    const actor = forgotPasswordActor({ services }).withContext(getActorContext(context, 'FORGOT_PASSWORD'));
                    return xstate.spawn(actor, { name: 'forgotPasswordActor' });
                },
            }),
            spawnVerifyUserAttributesActor: xstate.assign({
                actorRef: (context) => {
                    const actor = verifyUserAttributesActor().withContext(getActorContext(context));
                    return xstate.spawn(actor, { name: 'verifyUserAttributesActor' });
                },
            }),
            spawnSignOutActor: xstate.assign({
                actorRef: (context) => {
                    const actor = signOutActor().withContext({ user: context?.user });
                    return xstate.spawn(actor, { name: 'signOutActor' });
                },
            }),
            configure: xstate.assign((_, event) => {
                const { services: customServices, ...config } = !isEmptyObject(overrideConfigServices)
                    ? overrideConfigServices
                    : event.data ?? {};
                return {
                    services: { ...defaultServices, ...customServices },
                    config,
                };
            }),
            setHasSetup: xstate.assign({ hasSetup: true }),
        },
        guards: {
            ...GUARDS,
            hasActor: ({ actorRef }) => !!actorRef,
            isInitialStateSignUp: ({ config }) => config.initialState === 'signUp',
            isInitialStateResetPassword: ({ config }) => config.initialState === 'forgotPassword',
            shouldSetup: ({ hasSetup }) => !hasSetup,
            hasUser: ({ user }) => {
                return !!user;
            },
        },
        services: {
            getAmplifyConfig: ({ services }) => services.getAmplifyConfig(),
            handleGetCurrentUser: ({ services }) => services.getCurrentUser(),
        },
    });
}
function convertFormFields(formFields) {
    if (formFields) {
        Object.keys(formFields).forEach((component) => {
            Object.keys(formFields[component]).forEach((inputName) => {
                let ff = formFields[component][inputName];
                ff.required = ff.isRequired;
            });
        });
    }
    return formFields;
}

const borderWidths = {
    small: { value: '1px' },
    medium: { value: '2px' },
    large: { value: '3px' },
};

const colors = {
    red: {
        10: { value: 'hsl(0, 75%, 95%)' },
        20: { value: 'hsl(0, 75%, 85%)' },
        40: { value: 'hsl(0, 75%, 75%)' },
        60: { value: 'hsl(0, 50%, 50%)' },
        80: { value: 'hsl(0, 95%, 30%)' },
        90: { value: 'hsl(0, 100%, 20%)' },
        100: { value: 'hsl(0, 100%, 15%)' },
    },
    orange: {
        10: { value: 'hsl(30, 75%, 95%)' },
        20: { value: 'hsl(30, 75%, 85%)' },
        40: { value: 'hsl(30, 75%, 75%)' },
        60: { value: 'hsl(30, 50%, 50%)' },
        80: { value: 'hsl(30, 95%, 30%)' },
        90: { value: 'hsl(30, 100%, 20%)' },
        100: { value: 'hsl(30, 100%, 15%)' },
    },
    yellow: {
        10: { value: 'hsl(60, 75%, 95%)' },
        20: { value: 'hsl(60, 75%, 85%)' },
        40: { value: 'hsl(60, 75%, 75%)' },
        60: { value: 'hsl(60, 50%, 50%)' },
        80: { value: 'hsl(60, 95%, 30%)' },
        90: { value: 'hsl(60, 100%, 20%)' },
        100: { value: 'hsl(60, 100%, 15%)' },
    },
    green: {
        10: { value: 'hsl(130, 60%, 95%)' },
        20: { value: 'hsl(130, 60%, 90%)' },
        40: { value: 'hsl(130, 44%, 63%)' },
        60: { value: 'hsl(130, 43%, 46%)' },
        80: { value: 'hsl(130, 33%, 37%)' },
        90: { value: 'hsl(130, 27%, 29%)' },
        100: { value: 'hsl(130, 22%, 23%)' },
    },
    teal: {
        10: { value: 'hsl(190, 75%, 95%)' },
        20: { value: 'hsl(190, 75%, 85%)' },
        40: { value: 'hsl(190, 70%, 70%)' },
        60: { value: 'hsl(190, 50%, 50%)' },
        80: { value: 'hsl(190, 95%, 30%)' },
        90: { value: 'hsl(190, 100%, 20%)' },
        100: { value: 'hsl(190, 100%, 15%)' },
    },
    blue: {
        10: { value: 'hsl(220, 95%, 95%)' },
        20: { value: 'hsl(220, 85%, 85%)' },
        40: { value: 'hsl(220, 70%, 70%)' },
        60: { value: 'hsl(220, 50%, 50%)' },
        80: { value: 'hsl(220, 95%, 30%)' },
        90: { value: 'hsl(220, 100%, 20%)' },
        100: { value: 'hsl(220, 100%, 15%)' },
    },
    purple: {
        10: { value: 'hsl(300, 95%, 95%)' },
        20: { value: 'hsl(300, 85%, 85%)' },
        40: { value: 'hsl(300, 70%, 70%)' },
        60: { value: 'hsl(300, 50%, 50%)' },
        80: { value: 'hsl(300, 95%, 30%)' },
        90: { value: 'hsl(300, 100%, 20%)' },
        100: { value: 'hsl(300, 100%, 15%)' },
    },
    pink: {
        10: { value: 'hsl(340, 95%, 95%)' },
        20: { value: 'hsl(340, 90%, 85%)' },
        40: { value: 'hsl(340, 70%, 70%)' },
        60: { value: 'hsl(340, 50%, 50%)' },
        80: { value: 'hsl(340, 95%, 30%)' },
        90: { value: 'hsl(340, 100%, 20%)' },
        100: { value: 'hsl(340, 100%, 15%)' },
    },
    neutral: {
        10: { value: 'hsl(210, 5%, 98%)' },
        20: { value: 'hsl(210, 5%, 94%)' },
        40: { value: 'hsl(210, 5%, 87%)' },
        60: { value: 'hsl(210, 10%, 58%)' },
        80: { value: 'hsl(210, 10%, 40%)' },
        90: { value: 'hsl(210, 25%, 25%)' },
        100: { value: 'hsl(210, 50%, 10%)' },
    },
    primary: {
        10: { value: '{colors.teal.10.value}' },
        20: { value: '{colors.teal.20.value}' },
        40: { value: '{colors.teal.40.value}' },
        60: { value: '{colors.teal.60.value}' },
        80: { value: '{colors.teal.80.value}' },
        90: { value: '{colors.teal.90.value}' },
        100: { value: '{colors.teal.100.value}' },
    },
    secondary: {
        10: { value: '{colors.purple.10.value}' },
        20: { value: '{colors.purple.20.value}' },
        40: { value: '{colors.purple.40.value}' },
        60: { value: '{colors.purple.60.value}' },
        80: { value: '{colors.purple.80.value}' },
        90: { value: '{colors.purple.90.value}' },
        100: { value: '{colors.purple.100.value}' },
    },
    font: {
        primary: { value: '{colors.neutral.100.value}' },
        secondary: { value: '{colors.neutral.90.value}' },
        tertiary: { value: '{colors.neutral.80.value}' },
        disabled: { value: '{colors.neutral.60.value}' },
        inverse: { value: '{colors.white.value}' },
        interactive: { value: '{colors.primary.80.value}' },
        // Hover and Focus colors are intentionally different colors.
        // This allows users to distinguish between the current keyboard focus
        // and the location of their pointer
        hover: { value: '{colors.primary.90.value}' },
        // Focus color is set to 100 to ensure enough contrast for accessibility
        focus: { value: '{colors.primary.100.value}' },
        active: { value: '{colors.primary.100.value}' },
        info: { value: '{colors.blue.90.value}' },
        warning: { value: '{colors.orange.90.value}' },
        error: { value: '{colors.red.90.value}' },
        success: { value: '{colors.green.90.value}' },
    },
    background: {
        primary: { value: '{colors.white.value}' },
        secondary: { value: '{colors.neutral.10.value}' },
        tertiary: { value: '{colors.neutral.20.value}' },
        quaternary: { value: '{colors.neutral.60.value}' },
        disabled: { value: '{colors.background.tertiary.value}' },
        info: { value: '{colors.blue.10.value}' },
        warning: { value: '{colors.orange.10.value}' },
        error: { value: '{colors.red.10.value}' },
        success: { value: '{colors.green.10.value}' },
    },
    border: {
        primary: { value: '{colors.neutral.60.value}' },
        secondary: { value: '{colors.neutral.40.value}' },
        tertiary: { value: '{colors.neutral.20.value}' },
        disabled: { value: '{colors.border.tertiary.value}' },
        pressed: { value: '{colors.primary.100.value}' },
        // Focus color is set to 100 to ensure enough contrast for accessibility
        focus: { value: '{colors.primary.100.value}' },
        error: { value: '{colors.red.80.value}' },
        info: { value: '{colors.blue.80.value}' },
        success: { value: '{colors.green.80.value}' },
        warning: { value: '{colors.orange.80.value}' },
    },
    shadow: {
        primary: { value: 'hsla(210, 50%, 10%, 0.25)' },
        secondary: { value: 'hsla(210, 50%, 10%, 0.15)' },
        tertiary: { value: 'hsla(210, 50%, 10%, 0.05)' },
    },
    overlay: {
        5: { value: 'hsla(0, 0%, 0%, 0.05)' },
        10: { value: 'hsla(0, 0%, 0%, 0.1)' },
        20: { value: 'hsla(0, 0%, 0%, 0.2)' },
        30: { value: 'hsla(0, 0%, 0%, 0.3)' },
        40: { value: 'hsla(0, 0%, 0%, 0.4)' },
        50: { value: 'hsla(0, 0%, 0%, 0.5)' },
        60: { value: 'hsla(0, 0%, 0%, 0.6)' },
        70: { value: 'hsla(0, 0%, 0%, 0.7)' },
        80: { value: 'hsla(0, 0%, 0%, 0.8)' },
        90: { value: 'hsla(0, 0%, 0%, 0.9)' },
    },
    black: { value: 'hsl(0, 0%, 0%)' },
    white: { value: 'hsl(0, 0%, 100%)' },
    transparent: { value: 'transparent' },
};

const alert = {
    // Default styles
    alignItems: { value: 'center' },
    justifyContent: { value: 'space-between' },
    color: { value: '{colors.font.primary.value}' },
    backgroundColor: { value: '{colors.background.tertiary.value}' },
    paddingBlock: { value: '{space.small.value}' },
    paddingInline: { value: '{space.medium.value}' },
    icon: {
        size: { value: '{fontSizes.xl.value}' },
    },
    heading: {
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.bold.value}' },
    },
    // Variations
    info: {
        color: { value: '{colors.font.info.value}' },
        backgroundColor: { value: '{colors.background.info.value}' },
    },
    error: {
        color: { value: '{colors.font.error.value}' },
        backgroundColor: { value: '{colors.background.error.value}' },
    },
    warning: {
        color: { value: '{colors.font.warning.value}' },
        backgroundColor: { value: '{colors.background.warning.value}' },
    },
    success: {
        color: { value: '{colors.font.success.value}' },
        backgroundColor: { value: '{colors.background.success.value}' },
    },
};

const autocomplete = {
    menu: {
        width: { value: '100%' },
        marginBlockStart: { value: '{space.xxxs}' },
        backgroundColor: { value: '{colors.background.primary}' },
        borderColor: { value: '{colors.border.primary}' },
        borderWidth: { value: '{borderWidths.small}' },
        borderStyle: { value: 'solid' },
        borderRadius: { value: '{radii.small}' },
        options: {
            display: { value: 'flex' },
            flexDirection: { value: 'column' },
            maxHeight: { value: '300px' },
        },
        option: {
            backgroundColor: { value: '{colors.background.primary}' },
            color: { value: 'currentcolor' },
            cursor: { value: 'pointer' },
            transitionDuration: { value: '{time.short}' },
            transitionProperty: { value: 'background-color, color' },
            transitionTimingFunction: { value: 'ease' },
            _active: {
                backgroundColor: { value: '{colors.primary.80}' },
                color: { value: '{colors.white}' },
            },
        },
        _empty: {
            display: { value: 'flex' },
        },
        _loading: {
            alignItems: { value: 'center' },
            display: { value: 'flex' },
            gap: { value: '{space.xxxs}' },
        },
        spaceShared: {
            paddingBlock: { value: '{space.xs}' },
            paddingInline: { value: '{space.small}' },
        },
    },
};

const authenticator = {
    maxWidth: { value: '60rem' },
    modal: {
        width: { value: '{space.relative.full}' },
        height: { value: '{space.relative.full}' },
        backgroundColor: { value: '{colors.overlay.50.value}' },
        top: { value: '{space.zero}' },
        left: { value: '{space.zero}' },
    },
    container: {
        widthMax: { value: '30rem' },
    },
    router: {
        borderWidth: { value: '{borderWidths.small.value}' },
        borderStyle: { value: 'solid' },
        borderColor: { value: '{colors.border.primary.value}' },
        backgroundColor: { value: '{colors.background.primary.value}' },
        boxShadow: { value: '{shadows.medium.value}' },
    },
    footer: {
        paddingBottom: { value: '{space.medium.value}' },
    },
    form: {
        padding: { value: '{space.xl.value}' },
    },
    state: {
        inactive: {
            backgroundColor: { value: '{colors.background.secondary.value}' },
        },
    },
    orContainer: {
        color: { value: '{colors.neutral.80.value}' },
        orLine: {
            backgroundColor: { value: '{colors.background.primary.value}' },
        },
    },
};

const avatar = {
    // Default styles
    color: { value: '{colors.font.tertiary.value}' },
    lineHeight: { value: 1 },
    fontWeight: { value: '{fontWeights.semibold.value}' },
    fontSize: { value: '{fontSizes.small.value}' },
    textAlign: { value: 'center' },
    width: { value: '{fontSizes.xxl.value}' },
    height: { value: '{fontSizes.xxl.value}' },
    backgroundColor: { value: '{colors.background.tertiary}' },
    borderRadius: { value: '100%' },
    borderColor: { value: '{colors.border.primary.value}' },
    borderWidth: { value: '{borderWidths.medium.value}' },
    // Color Theme Variations
    info: {
        color: { value: '{colors.font.info.value}' },
        backgroundColor: { value: '{colors.background.info.value}' },
        borderColor: { value: '{colors.border.info.value}' },
    },
    warning: {
        color: { value: '{colors.font.warning.value}' },
        backgroundColor: { value: '{colors.background.warning.value}' },
        borderColor: { value: '{colors.border.warning.value}' },
    },
    success: {
        color: { value: '{colors.font.success.value}' },
        backgroundColor: { value: '{colors.background.success.value}' },
        borderColor: { value: '{colors.border.success.value}' },
    },
    error: {
        color: { value: '{colors.font.error.value}' },
        backgroundColor: { value: '{colors.background.error.value}' },
        borderColor: { value: '{colors.border.error.value}' },
    },
    // Sizes
    small: {
        fontSize: { value: '{fontSizes.xs.value}' },
        width: { value: '{fontSizes.xl.value}' },
        height: { value: '{fontSizes.xl.value}' },
    },
    // medium is the default size
    large: {
        fontSize: { value: '{fontSizes.medium.value}' },
        width: { value: '{fontSizes.xxxl.value}' },
        height: { value: '{fontSizes.xxxl.value}' },
    },
};

const badge = {
    // Default styles
    color: { value: '{colors.font.primary.value}' },
    lineHeight: { value: 1 },
    fontWeight: { value: '{fontWeights.semibold.value}' },
    fontSize: { value: '{fontSizes.small.value}' },
    textAlign: { value: 'center' },
    paddingVertical: { value: '{space.xs.value}' },
    paddingHorizontal: { value: '{space.small.value}' },
    backgroundColor: { value: '{colors.background.tertiary.value}' },
    // An arbitrarily large value to ensure that the left and right sides of the badge are perfectly rounded for any size variation
    borderRadius: { value: '{radii.xl.value}' },
    // Variations
    info: {
        color: { value: '{colors.font.info.value}' },
        backgroundColor: { value: '{colors.background.info.value}' },
    },
    warning: {
        color: { value: '{colors.font.warning.value}' },
        backgroundColor: { value: '{colors.background.warning.value}' },
    },
    success: {
        color: { value: '{colors.font.success.value}' },
        backgroundColor: { value: '{colors.background.success.value}' },
    },
    error: {
        color: { value: '{colors.font.error.value}' },
        backgroundColor: { value: '{colors.background.error.value}' },
    },
    // Sizes
    small: {
        fontSize: { value: '{fontSizes.xs.value}' },
        paddingVertical: { value: '{space.xxs.value}' },
        paddingHorizontal: { value: '{space.xs.value}' },
    },
    // medium is the default size
    large: {
        fontSize: { value: '{fontSizes.medium.value}' },
        paddingVertical: { value: '{space.small.value}' },
        paddingHorizontal: { value: '{space.medium.value}' },
    },
};

const breadcrumbs = {
    flexDirection: { value: 'row' },
    flexWrap: { value: 'wrap' },
    gap: { value: '0' },
    color: { value: '{colors.font.tertiary}' },
    item: {
        flexDirection: { value: 'row' },
        color: { value: 'inherit' },
        fontSize: { value: 'inherit' },
        alignItems: { value: 'center' },
        lineHeight: { value: '1' },
    },
    separator: {
        color: { value: 'inherit' },
        fontSize: { value: 'inherit' },
        paddingInline: { value: '{space.xxs}' },
    },
    link: {
        color: { value: '{components.link.color}' },
        fontSize: { value: 'inherit' },
        fontWeight: { value: 'normal' },
        textDecoration: { value: 'none' },
        paddingInline: { value: '{space.xs}' },
        paddingBlock: { value: '{space.xxs}' },
        current: {
            color: { value: 'inherit' },
            fontSize: { value: 'inherit' },
            fontWeight: { value: 'normal' },
            textDecoration: { value: 'none' },
        },
    },
};

const button = {
    // shared styles
    fontWeight: { value: '{fontWeights.bold.value}' },
    transitionDuration: {
        value: '{components.fieldcontrol.transitionDuration.value}',
    },
    fontSize: { value: '{components.fieldcontrol.fontSize.value}' },
    lineHeight: { value: '{components.fieldcontrol.lineHeight.value}' },
    paddingBlockStart: {
        value: '{components.fieldcontrol.paddingBlockStart.value}',
    },
    paddingBlockEnd: {
        value: '{components.fieldcontrol.paddingBlockEnd.value}',
    },
    paddingInlineStart: {
        value: '{components.fieldcontrol.paddingInlineStart.value}',
    },
    paddingInlineEnd: {
        value: '{components.fieldcontrol.paddingInlineEnd.value}',
    },
    backgroundColor: { value: 'transparent' },
    borderColor: { value: '{components.fieldcontrol.borderColor.value}' },
    borderWidth: { value: '{components.fieldcontrol.borderWidth.value}' },
    borderStyle: { value: '{components.fieldcontrol.borderStyle.value}' },
    borderRadius: { value: '{components.fieldcontrol.borderRadius.value}' },
    color: { value: '{colors.font.primary.value}' },
    _hover: {
        color: { value: '{colors.font.focus.value}' },
        backgroundColor: { value: '{colors.primary.10.value}' },
        borderColor: { value: '{colors.primary.60.value}' },
    },
    _focus: {
        color: { value: '{colors.font.focus.value}' },
        backgroundColor: { value: '{colors.primary.10.value}' },
        borderColor: { value: '{colors.border.focus.value}' },
        boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
    },
    _active: {
        color: { value: '{colors.font.active.value}' },
        backgroundColor: { value: '{colors.primary.20.value}' },
        borderColor: { value: '{colors.primary.100.value}' },
    },
    _loading: {
        color: { value: '{colors.font.disabled.value}' },
        backgroundColor: { value: 'transparent' },
        borderColor: { value: '{colors.border.tertiary.value}' },
    },
    _disabled: {
        color: { value: '{colors.font.disabled.value}' },
        backgroundColor: { value: 'transparent' },
        borderColor: { value: '{colors.border.tertiary.value}' },
    },
    // variations
    outlined: {
        info: {
            borderColor: { value: '{colors.blue.60.value}' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.blue.100}' },
            _hover: {
                borderColor: { value: '{colors.blue.60.value}' },
                backgroundColor: { value: '{colors.blue.10.value}' },
                color: { value: '{colors.blue.100.value}' },
            },
            _focus: {
                borderColor: { value: '{colors.blue.100.value}' },
                backgroundColor: { value: '{colors.blue.10.value}' },
                color: { value: '{colors.blue.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.info._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: '{colors.blue.100.value}' },
                backgroundColor: { value: '{colors.blue.20.value}' },
                color: { value: '{colors.blue.100.value}' },
            },
        },
        warning: {
            borderColor: { value: '{colors.orange.60.value}' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.orange.100}' },
            _hover: {
                borderColor: { value: '{colors.orange.60.value}' },
                backgroundColor: { value: '{colors.orange.10.value}' },
                color: { value: '{colors.orange.100.value}' },
            },
            _focus: {
                borderColor: { value: '{colors.orange.100.value}' },
                backgroundColor: { value: '{colors.orange.10.value}' },
                color: { value: '{colors.orange.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.warning._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: '{colors.orange.100.value}' },
                backgroundColor: { value: '{colors.orange.20.value}' },
                color: { value: '{colors.orange.100.value}' },
            },
        },
        success: {
            borderColor: { value: '{colors.green.60.value}' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.green.100}' },
            _hover: {
                borderColor: { value: '{colors.green.60.value}' },
                backgroundColor: { value: '{colors.green.10.value}' },
                color: { value: '{colors.green.100.value}' },
            },
            _focus: {
                borderColor: { value: '{colors.green.100.value}' },
                backgroundColor: { value: '{colors.green.10.value}' },
                color: { value: '{colors.green.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.success._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: '{colors.green.100.value}' },
                backgroundColor: { value: '{colors.green.20.value}' },
                color: { value: '{colors.green.100.value}' },
            },
        },
        error: {
            borderColor: { value: '{colors.red.80.value}' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.red.100}' },
            _hover: {
                borderColor: { value: '{colors.red.80.value}' },
                backgroundColor: { value: '{colors.red.10.value}' },
                color: { value: '{colors.red.100.value}' },
            },
            _focus: {
                borderColor: { value: '{colors.red.100.value}' },
                backgroundColor: { value: '{colors.red.10.value}' },
                color: { value: '{colors.red.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol._error._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: '{colors.red.100.value}' },
                backgroundColor: { value: '{colors.red.20.value}' },
                color: { value: '{colors.red.100.value}' },
            },
        },
        overlay: {
            borderColor: { value: '{colors.overlay.60.value}' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.font.primary.value}' },
            _hover: {
                borderColor: { value: '{colors.overlay.60.value}' },
                backgroundColor: { value: '{colors.overlay.5.value}' },
                color: { value: '{colors.neutral.90.value}' },
            },
            _focus: {
                borderColor: { value: '{colors.overlay.90.value}' },
                backgroundColor: { value: '{colors.overlay.5.value}' },
                color: { value: '{colors.neutral.90.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.overlay._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: '{colors.overlay.90.value}' },
                backgroundColor: { value: '{colors.overlay.10.value}' },
                color: { value: '{colors.neutral.100.value}' },
            },
        },
    },
    primary: {
        borderColor: { value: 'transparent' },
        borderWidth: { value: '{borderWidths.small.value}' },
        borderStyle: { value: 'solid' },
        backgroundColor: { value: '{colors.primary.80.value}' },
        color: { value: '{colors.font.inverse.value}' },
        _disabled: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.background.disabled.value}' },
            color: { value: '{colors.font.disabled.value}' },
        },
        _loading: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.background.disabled.value}' },
            color: { value: '{colors.font.disabled.value}' },
        },
        _hover: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.primary.90.value}' },
            color: { value: '{colors.font.inverse.value}' },
        },
        _focus: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.primary.90.value}' },
            color: { value: '{colors.font.inverse.value}' },
            boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
        },
        _active: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.primary.100.value}' },
            color: { value: '{colors.font.inverse.value}' },
        },
        info: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.blue.80}' },
            color: { value: '{colors.font.inverse.value}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.blue.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.blue.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.info._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.blue.100.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
        },
        warning: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.orange.80}' },
            color: { value: '{colors.font.inverse.value}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.orange.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.orange.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.overlay._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.orange.100.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
        },
        error: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.red.80}' },
            color: { value: '{colors.font.inverse.value}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.red.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.red.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol._error._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.red.100.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
        },
        success: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.green.80}' },
            color: { value: '{colors.font.inverse.value}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.green.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.green.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.success._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.green.100.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
        },
        overlay: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.overlay.70}' },
            color: { value: '{colors.font.inverse.value}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.overlay.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.overlay.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.overlay._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.overlay.90.value}' },
                color: { value: '{colors.font.inverse.value}' },
            },
        },
    },
    menu: {
        borderWidth: { value: '{space.zero.value}' },
        backgroundColor: { value: 'transparent' },
        justifyContent: { value: 'start' },
        // Focus and hover styles are identical for menu variation
        // because for Menu primitive, menu items are forced to be focused even
        // for mouse interactions, making it impossible to distinguish the two interactions
        _hover: {
            color: { value: '{colors.font.inverse.value}' },
            backgroundColor: { value: '{colors.primary.80.value}' },
        },
        _focus: {
            color: { value: '{colors.font.inverse.value}' },
            backgroundColor: { value: '{colors.primary.80.value}' },
        },
        _active: {
            color: { value: '{colors.font.inverse.value}' },
            backgroundColor: { value: '{colors.primary.90.value}' },
        },
        _disabled: {
            color: { value: '{colors.font.disabled.value}' },
        },
    },
    link: {
        backgroundColor: { value: 'transparent' },
        borderColor: { value: 'transparent' },
        borderWidth: { value: '{borderWidths.small.value}' },
        color: { value: '{colors.font.interactive.value}' },
        _hover: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.primary.10.value}' },
            color: { value: '{colors.font.hover.value}' },
        },
        _focus: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.primary.10.value}' },
            color: { value: '{colors.font.focus.value}' },
            boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
        },
        _active: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.primary.20.value}' },
            color: { value: '{colors.font.active.value}' },
        },
        _disabled: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.font.disabled.value}' },
        },
        _loading: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.font.disabled.value}' },
        },
        info: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.blue.100}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.blue.10.value}' },
                color: { value: '{colors.blue.90.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.blue.10.value}' },
                color: { value: '{colors.blue.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.info._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.blue.20.value}' },
                color: { value: '{colors.blue.100.value}' },
            },
        },
        warning: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.orange.100}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.orange.10.value}' },
                color: { value: '{colors.orange.90.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.orange.10.value}' },
                color: { value: '{colors.orange.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.warning._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.orange.20.value}' },
                color: { value: '{colors.orange.100.value}' },
            },
        },
        success: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.green.100}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.green.10.value}' },
                color: { value: '{colors.green.90.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.green.10.value}' },
                color: { value: '{colors.green.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.success._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.green.20.value}' },
                color: { value: '{colors.green.100.value}' },
            },
        },
        error: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.red.100}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.red.10.value}' },
                color: { value: '{colors.red.90.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.red.10.value}' },
                color: { value: '{colors.red.100.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol._error._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.red.20.value}' },
                color: { value: '{colors.red.100.value}' },
            },
        },
        overlay: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.neutral.100}' },
            _hover: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.overlay.5.value}' },
                color: { value: '{colors.overlay.80.value}' },
            },
            _focus: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.overlay.5.value}' },
                color: { value: '{colors.overlay.90.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol.overlay._focus.boxShadow.value}',
                },
            },
            _active: {
                borderColor: { value: 'transparent' },
                backgroundColor: { value: '{colors.overlay.10.value}' },
                color: { value: '{colors.overlay.90.value}' },
            },
        },
    },
    warning: {
        backgroundColor: { value: 'transparent' },
        borderColor: { value: '{colors.red.60}' },
        borderWidth: { value: '{borderWidths.small}' },
        color: { value: '{colors.red.60}' },
        _hover: {
            borderColor: { value: '{colors.red.80}' },
            backgroundColor: { value: '{colors.red.10}' },
            color: { value: '{colors.font.error}' },
        },
        _focus: {
            borderColor: { value: '{colors.red.80}' },
            backgroundColor: { value: '{colors.red.10}' },
            color: { value: '{colors.red.80}' },
            boxShadow: { value: '{components.fieldcontrol._error._focus.boxShadow}' },
        },
        _active: {
            borderColor: { value: '{colors.red.100}' },
            backgroundColor: { value: '{colors.red.20}' },
            color: { value: '{colors.red.100}' },
        },
        _disabled: {
            borderColor: { value: '{colors.border.tertiary}' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.font.disabled}' },
        },
        _loading: {
            borderColor: { value: '{colors.border.tertiary}' },
            backgroundColor: { value: 'transparent' },
            color: { value: '{colors.font.disabled}' },
        },
    },
    destructive: {
        borderColor: { value: 'transparent' },
        borderWidth: { value: '{borderWidths.small}' },
        borderStyle: { value: 'solid' },
        backgroundColor: { value: '{colors.red.60}' },
        color: { value: '{colors.font.inverse}' },
        _disabled: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.background.disabled}' },
            color: { value: '{colors.font.disabled}' },
        },
        _loading: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.background.disabled}' },
            color: { value: '{colors.font.disabled}' },
        },
        _hover: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.red.80}' },
            color: { value: '{colors.font.inverse}' },
        },
        _focus: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.red.80}' },
            color: { value: '{colors.font.inverse}' },
            boxShadow: { value: '{components.fieldcontrol._error._focus.boxShadow}' },
        },
        _active: {
            borderColor: { value: 'transparent' },
            backgroundColor: { value: '{colors.red.100}' },
            color: { value: '{colors.font.inverse}' },
        },
    },
    // sizes
    small: {
        fontSize: { value: '{components.fieldcontrol.small.fontSize.value}' },
        paddingBlockStart: {
            value: '{components.fieldcontrol.small.paddingBlockStart.value}',
        },
        paddingBlockEnd: {
            value: '{components.fieldcontrol.small.paddingBlockEnd.value}',
        },
        paddingInlineStart: {
            value: '{components.fieldcontrol.small.paddingInlineStart.value}',
        },
        paddingInlineEnd: {
            value: '{components.fieldcontrol.small.paddingInlineEnd.value}',
        },
    },
    large: {
        fontSize: { value: '{components.fieldcontrol.large.fontSize.value}' },
        paddingBlockStart: {
            value: '{components.fieldcontrol.large.paddingBlockStart.value}',
        },
        paddingBlockEnd: {
            value: '{components.fieldcontrol.large.paddingBlockEnd.value}',
        },
        paddingInlineStart: {
            value: '{components.fieldcontrol.large.paddingInlineStart.value}',
        },
        paddingInlineEnd: {
            value: '{components.fieldcontrol.large.paddingInlineEnd.value}',
        },
    },
    loaderWrapper: {
        alignItems: {
            value: 'center',
        },
        gap: {
            value: '{space.xs.value}',
        },
    },
};

const card = {
    backgroundColor: { value: '{colors.background.primary.value}' },
    borderRadius: { value: '{radii.xs.value}' },
    borderWidth: { value: '0' },
    borderStyle: { value: 'solid' },
    borderColor: { value: 'transparent' },
    boxShadow: { value: 'none' },
    padding: { value: '{space.medium.value}' },
    outlined: {
        backgroundColor: { value: '{components.card.backgroundColor.value}' },
        borderRadius: { value: '{radii.xs.value}' },
        borderWidth: { value: '{borderWidths.small.value}' },
        borderStyle: { value: 'solid' },
        borderColor: { value: '{colors.border.primary.value}' },
        boxShadow: { value: '{components.card.boxShadow.value}' },
    },
    elevated: {
        backgroundColor: { value: '{components.card.backgroundColor.value}' },
        borderRadius: { value: '{radii.xs.value}' },
        borderWidth: { value: '0' },
        borderStyle: { value: 'solid' },
        borderColor: { value: 'transparent' },
        boxShadow: { value: '{shadows.medium.value}' },
    },
};

const checkbox = {
    cursor: { value: 'pointer' },
    alignItems: { value: 'center' },
    _disabled: {
        cursor: {
            value: 'not-allowed',
        },
    },
    button: {
        position: { value: 'relative' },
        alignItems: { value: 'center' },
        justifyContent: { value: 'center' },
        color: { value: '{colors.font.inverse.value}' },
        before: {
            width: { value: '100%' },
            height: { value: '100%' },
            borderWidth: { value: '{borderWidths.medium.value}' },
            borderRadius: { value: '20%' },
            borderStyle: { value: 'solid' },
            borderColor: { value: '{colors.border.primary.value}' },
        },
        _focus: {
            outlineColor: { value: '{colors.transparent.value}' },
            outlineStyle: { value: 'solid' },
            outlineWidth: { value: '{outlineWidths.medium.value}' },
            outlineOffset: { value: '{outlineOffsets.medium.value}' },
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
        },
        _disabled: {
            borderColor: { value: '{colors.border.disabled.value}' },
        },
        _error: {
            borderColor: { value: '{colors.border.error.value}' },
            _focus: {
                borderColor: { value: '{colors.border.error.value}' },
                boxShadow: {
                    value: '{components.fieldcontrol._error._focus.boxShadow.value}',
                },
            },
        },
    },
    icon: {
        backgroundColor: { value: '{colors.primary.80.value}' },
        borderRadius: { value: '20%' },
        opacity: { value: '{opacities.0.value}' },
        transform: { value: 'scale(0)' },
        transitionProperty: { value: 'all' },
        transitionDuration: { value: '{time.short.value}' },
        transitionTimingFunction: { value: 'ease-in-out' },
        _checked: {
            opacity: { value: '{opacities.100.value}' },
            transform: { value: 'scale(1)' },
            _disabled: {
                backgroundColor: { value: '{colors.background.disabled.value}' },
            },
        },
        _indeterminate: {
            opacity: { value: '{opacities.100.value}' },
            transform: { value: 'scale(1)' },
            _disabled: {
                backgroundColor: { value: '{colors.background.disabled.value}' },
            },
        },
    },
    label: {
        color: { value: '{components.text.color.value}' },
        _disabled: {
            color: {
                value: '{colors.font.disabled.value}',
            },
        },
    },
};

const checkboxfield = {
    alignItems: { value: 'flex-start' },
    alignContent: { value: 'center' },
    flexDirection: { value: 'column' },
    justifyContent: { value: 'center' },
};

//we are reusing the types from the nested components but new tokens need to be created that reference the previous tokens so that they can inherit the needed values but can be overwritten and only effect the collection component.
//only a subset of the design tokens of the nested components are being exposed, this can be expanded later.
const collection = {
    pagination: {
        current: {
            color: { value: '{components.pagination.current.color}' },
            backgroundColor: {
                value: '{components.pagination.current.backgroundColor}',
            },
        },
        button: {
            color: { value: '{components.pagination.button.color}' },
            _hover: {
                backgroundColor: {
                    value: '{components.pagination.button.hover.backgroundColor}',
                },
                color: { value: '{components.pagination.button.hover.color}' },
            },
            _disabled: {
                color: { value: '{components.pagination.button.disabled.color}' },
            },
        },
    },
    search: {
        input: {
            color: { value: '{components.searchfield.color}' },
        },
        button: {
            color: { value: '{components.searchfield.button.color}' },
            _active: {
                backgroundColor: {
                    value: '{components.searchfield.button._active.backgroundColor}',
                },
                borderColor: {
                    value: '{components.searchfield.button._active.borderColor}',
                },
                color: { value: '{components.searchfield.button._active.color}' },
            },
            _disabled: {
                backgroundColor: {
                    value: '{components.searchfield.button._disabled.backgroundColor}',
                },
                borderColor: {
                    value: '{components.searchfield.button._disabled.borderColor}',
                },
                color: {
                    value: '{components.searchfield.button._disabled.color}',
                },
            },
            _focus: {
                backgroundColor: {
                    value: '{components.searchfield.button._focus.backgroundColor}',
                },
                borderColor: {
                    value: '{components.searchfield.button._focus.borderColor}',
                },
                color: { value: '{components.searchfield.button._focus.color}' },
            },
            _hover: {
                backgroundColor: {
                    value: '{components.searchfield.button._hover.backgroundColor}',
                },
                borderColor: {
                    value: '{components.searchfield.button._hover.borderColor}',
                },
                color: { value: '{components.searchfield.button._hover.color}' },
            },
        },
    },
};

const copy = {
    fontSize: { value: '{fontSizes.xs}' },
    gap: { value: '{space.relative.medium}' },
    svg: {
        path: {
            fill: {
                value: '{colors.font.primary}',
            },
        },
    },
    toolTip: {
        bottom: { value: '{space.large}' },
        color: { value: '{colors.teal.100}' },
        fontSize: { value: '{fontSizes.xxs}' },
    },
};

const dialcodeselect = {
    height: {
        value: '{space.relative.full.value}',
    },
};

const divider = {
    borderStyle: { value: 'solid' },
    borderColor: { value: '{colors.border.primary.value}' },
    borderWidth: { value: '{borderWidths.medium.value}' },
    label: {
        color: { value: '{colors.font.tertiary.value}' },
        paddingInline: { value: '{space.medium.value}' },
        fontSize: { value: '{fontSizes.small.value}' },
        backgroundColor: { value: '{colors.background.primary.value}' },
    },
    small: {
        borderWidth: { value: '{borderWidths.small.value}' },
    },
    large: {
        borderWidth: { value: '{borderWidths.large.value}' },
    },
    opacity: {
        value: '{opacities.60.value}',
    },
};

const dropzone = {
    backgroundColor: { value: '{colors.background.primary}' },
    borderRadius: { value: '{radii.small}' },
    borderColor: { value: '{colors.border.primary}' },
    borderStyle: { value: 'dashed' },
    borderWidth: { value: '{borderWidths.small}' },
    color: { value: '{colors.font.primary}' },
    gap: { value: '{space.small}' },
    paddingBlock: { value: '{space.xl}' },
    paddingInline: { value: '{space.large}' },
    textAlign: { value: 'center' },
    _active: {
        backgroundColor: { value: '{colors.primary.10}' },
        borderRadius: { value: '{components.dropzone.borderRadius}' },
        borderColor: { value: '{colors.border.pressed}' },
        borderStyle: { value: '{components.dropzone.borderStyle}' },
        borderWidth: { value: '{components.dropzone.borderWidth}' },
        color: { value: '{colors.font.primary}' },
    },
    _disabled: {
        backgroundColor: { value: '{colors.background.disabled}' },
        borderRadius: { value: '{components.dropzone.borderRadius}' },
        borderColor: { value: '{colors.border.disabled}' },
        borderStyle: { value: '{components.dropzone.borderStyle}' },
        borderWidth: { value: '{components.dropzone.borderWidth}' },
        color: { value: '{colors.font.disabled}' },
    },
    accepted: {
        backgroundColor: { value: '{colors.background.success}' },
        borderRadius: { value: '{components.dropzone.borderRadius}' },
        borderColor: { value: '{colors.border.success}' },
        borderStyle: { value: '{components.dropzone.borderStyle}' },
        borderWidth: { value: '{components.dropzone.borderWidth}' },
        color: { value: '{colors.font.success}' },
    },
    rejected: {
        backgroundColor: { value: '{colors.background.error}' },
        borderRadius: { value: '{components.dropzone.borderRadius}' },
        borderColor: { value: '{colors.border.pressed}' },
        borderStyle: { value: '{components.dropzone.borderStyle}' },
        borderWidth: { value: '{components.dropzone.borderWidth}' },
        color: { value: '{colors.font.error}' },
    },
};

const accordion = {
    backgroundColor: { value: '{colors.background.primary.value}' },
    item: {
        borderColor: { value: '{colors.border.secondary.value}' },
        borderWidth: { value: '{borderWidths.small.value}' },
        borderStyle: { value: 'solid' },
        borderRadius: { value: '{radii.small.value}' },
        trigger: {
            alignItems: { value: 'center' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            color: { value: 'inherit' },
            gap: { value: '{space.small.value}' },
            justifyContent: { value: 'space-between' },
            paddingBlock: { value: '{space.xs.value}' },
            paddingInline: { value: '{space.small.value}' },
            _hover: {
                color: { value: 'inherit' },
                backgroundColor: { value: '{colors.overlay.5.value}' },
            },
            _focus: {
                borderColor: { value: '{colors.border.focus.value}' },
                boxShadow: {
                    value: {
                        offsetX: '0',
                        offsetY: '0',
                        blurRadius: '0',
                        spreadRadius: '2px',
                        color: '{colors.border.focus.value}',
                    },
                },
            },
        },
        content: {
            color: { value: 'inherit' },
            paddingInline: { value: '{space.small.value}' },
            paddingBlockEnd: { value: '{space.small.value}' },
            paddingBlockStart: { value: '{space.xxxs.value}' },
        },
        icon: {
            color: { value: '{colors.font.tertiary.value}' },
            transitionDuration: { value: '{time.medium.value}' },
            transitionTimingFunction: { value: 'cubic-bezier(0.87, 0, 0.13, 1)' },
        },
    },
};

const field = {
    // default styles
    gap: { value: '{space.xs.value}' },
    fontSize: { value: '{fontSizes.medium.value}' },
    flexDirection: { value: 'column' },
    // Adjust base fontSize and gap for small and large sizes
    small: {
        gap: { value: '{space.xxxs.value}' },
        fontSize: { value: '{fontSizes.small.value}' },
    },
    large: {
        gap: { value: '{space.small.value}' },
        fontSize: { value: '{fontSizes.large.value}' },
    },
    label: {
        color: { value: '{colors.font.secondary.value}' },
    },
};

const fieldcontrol = {
    borderStyle: { value: 'solid' },
    borderColor: { value: '{colors.border.primary.value}' },
    borderWidth: { value: '{borderWidths.small.value}' },
    borderRadius: { value: '{radii.small.value}' },
    color: { value: '{colors.font.primary.value}' },
    paddingBlockStart: {
        value: '{space.xs.value}',
    },
    paddingBlockEnd: {
        value: '{space.xs.value}',
    },
    paddingInlineStart: {
        value: '{space.medium.value}',
    },
    paddingInlineEnd: {
        value: '{space.medium.value}',
    },
    fontSize: { value: '{components.field.fontSize.value}' },
    lineHeight: { value: '{lineHeights.medium.value}' },
    transitionDuration: { value: '{time.medium.value}' },
    outlineColor: { value: '{colors.transparent.value}' },
    outlineStyle: { value: 'solid' },
    outlineWidth: { value: '{outlineWidths.medium.value}' },
    outlineOffset: { value: '{outlineOffsets.medium.value}' },
    small: {
        fontSize: { value: '{components.field.small.fontSize.value}' },
        paddingBlockStart: {
            value: '{space.xxs.value}',
        },
        paddingBlockEnd: {
            value: '{space.xxs.value}',
        },
        paddingInlineStart: {
            value: '{space.small.value}',
        },
        paddingInlineEnd: {
            value: '{space.small.value}',
        },
    },
    large: {
        fontSize: { value: '{components.field.large.fontSize.value}' },
        paddingBlockStart: {
            value: '{space.xs.value}',
        },
        paddingBlockEnd: {
            value: '{space.xs.value}',
        },
        paddingInlineStart: {
            value: '{space.medium.value}',
        },
        paddingInlineEnd: {
            value: '{space.medium.value}',
        },
    },
    quiet: {
        borderStyle: { value: 'none' },
        borderInlineStart: { value: 'none' },
        borderInlineEnd: { value: 'none' },
        borderBlockStart: { value: 'none' },
        borderRadius: { value: '0' },
        _focus: {
            borderBlockEndColor: { value: 'transparent' },
            boxShadow: {
                value: '{components.fieldcontrol._focus.boxShadow.value}',
            },
        },
        _error: {
            borderBlockEndColor: { value: '{colors.border.error.value}' },
            _focus: {
                borderBlockEndColor: { value: 'transparent' },
                boxShadow: {
                    value: '{components.fieldcontrol._error._focus.boxShadow.value}',
                },
            },
        },
    },
    _focus: {
        // These focus styles have been calibrated to create
        // a highly visible focus indicator per WCAG 2.2 guidlines:
        // See: https://www.w3.org/TR/WCAG22/#focus-appearance
        //
        // Key features:
        // * Focus indicator area is at least the 2 CSS px perimeter around the component.
        // * Contrast between focused and unfocused area of contrast has a ratio of 3:1
        //
        // IMPORTANT: Must recalibrate if `colors.border.focus` are changed
        borderColor: { value: '{colors.border.focus.value}' },
        boxShadow: {
            value: {
                offsetX: '0px',
                offsetY: '0px',
                blurRadius: '0px',
                spreadRadius: '2px',
                color: '{colors.border.focus.value}',
            },
        },
    },
    _disabled: {
        color: { value: '{colors.font.disabled.value}' },
        cursor: { value: 'not-allowed' },
        borderColor: { value: '{colors.transparent.value}' },
        backgroundColor: { value: '{colors.background.disabled.value}' },
    },
    _error: {
        borderColor: { value: '{colors.border.error.value}' },
        color: { value: '{colors.font.error.value}' },
        _focus: {
            boxShadow: {
                value: {
                    offsetX: '0px',
                    offsetY: '0px',
                    blurRadius: '0px',
                    spreadRadius: '2px',
                    color: '{colors.border.error.value}',
                },
            },
        },
    },
    info: {
        _focus: {
            boxShadow: {
                value: {
                    offsetX: '0px',
                    offsetY: '0px',
                    blurRadius: '0px',
                    spreadRadius: '2px',
                    color: '{colors.blue.100.value}',
                },
            },
        },
    },
    warning: {
        _focus: {
            boxShadow: {
                value: {
                    offsetX: '0px',
                    offsetY: '0px',
                    blurRadius: '0px',
                    spreadRadius: '2px',
                    color: '{colors.orange.100.value}',
                },
            },
        },
    },
    success: {
        _focus: {
            boxShadow: {
                value: {
                    offsetX: '0px',
                    offsetY: '0px',
                    blurRadius: '0px',
                    spreadRadius: '2px',
                    color: '{colors.green.100.value}',
                },
            },
        },
    },
    overlay: {
        _focus: {
            boxShadow: {
                value: {
                    offsetX: '0px',
                    offsetY: '0px',
                    blurRadius: '0px',
                    spreadRadius: '2px',
                    color: '{colors.overlay.90.value}',
                },
            },
        },
    },
};

const fieldgroup = {
    gap: { value: '{space.zero.value}' },
    vertical: {
        alignItems: { value: 'center' },
    },
    outer: {
        alignItems: { value: 'center' },
    },
};

const fieldset = {
    backgroundColor: { value: 'transparent' },
    borderRadius: { value: '{radii.xs.value}' },
    flexDirection: {
        value: 'column',
    },
    gap: { value: '{components.field.gap.value}' },
    legend: {
        color: { value: '{colors.font.primary.value}' },
        fontSize: { value: '{components.field.fontSize.value}' },
        fontWeight: { value: '{fontWeights.bold.value}' },
        lineHeight: { value: '{lineHeights.medium.value}' },
        small: {
            fontSize: '{components.field.small.fontSize.value}',
        },
        large: {
            fontSize: '{components.field.large.fontSize.value}',
        },
    },
    outlined: {
        padding: '{space.medium.value}',
        borderColor: '{colors.neutral.40.value}',
        borderWidth: '{borderWidths.small.value}',
        borderStyle: 'solid',
        small: {
            padding: '{space.small.value}',
        },
        large: {
            padding: '{space.large.value}',
        },
    },
    small: {
        gap: '{components.field.small.gap.value}',
    },
    large: {
        gap: '{components.field.large.gap.value}',
    },
};

const fieldmessages = {
    error: {
        color: { value: '{colors.font.error.value}' },
        fontSize: { value: '{fontSizes.small.value}' },
    },
    description: {
        color: { value: '{colors.font.secondary.value}' },
        fontStyle: { value: 'italic' },
        fontSize: { value: '{fontSizes.small.value}' },
    },
};

const fileuploader = {
    dropzone: {
        backgroundColor: { value: '{colors.background.primary}' },
        borderRadius: { value: '{radii.small}' },
        borderColor: { value: '{colors.border.primary}' },
        borderStyle: { value: 'dashed' },
        borderWidth: { value: '{borderWidths.small}' },
        gap: { value: '{space.small}' },
        paddingBlock: { value: '{space.xl}' },
        paddingInline: { value: '{space.large}' },
        textAlign: { value: 'center' },
        _active: {
            backgroundColor: { value: '{colors.primary.10}' },
            borderRadius: {
                value: '{components.fileuploader.dropzone.borderRadius}',
            },
            borderColor: { value: '{colors.border.pressed}' },
            borderStyle: {
                value: '{components.fileuploader.dropzone.borderStyle}',
            },
            borderWidth: { value: '{borderWidths.medium}' },
        },
        icon: {
            color: { value: '{colors.border.primary}' },
            fontSize: { value: '{fontSizes.xxl}' },
        },
        text: {
            color: { value: '{colors.font.tertiary}' },
            fontSize: { value: '{fontSizes.medium}' },
            fontWeight: { value: '{fontWeights.bold}' },
        },
    },
    file: {
        backgroundColor: { value: '{colors.background.primary}' },
        borderRadius: { value: '{radii.small}' },
        borderColor: { value: '{colors.border.primary}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.small}' },
        paddingBlock: { value: '{space.xs}' },
        paddingInline: { value: '{space.small}' },
        gap: { value: '{space.small}' },
        alignItems: { value: 'baseline' },
        name: {
            fontSize: { value: '{fontSizes.medium}' },
            fontWeight: { value: '{fontWeights.bold}' },
            color: { value: '{colors.font.primary}' },
        },
        size: {
            fontSize: { value: '{fontSizes.small}' },
            fontWeight: { value: '{fontWeights.normal}' },
            color: { value: '{colors.font.tertiary}' },
        },
        image: {
            width: { value: '{space.xxl}' },
            height: { value: '{space.xxl}' },
            backgroundColor: { value: '{colors.background.secondary}' },
            color: { value: '{colors.font.tertiary}' },
            borderRadius: { value: '{radii.small}' },
        },
    },
    filelist: {
        flexDirection: { value: 'column' },
        gap: { value: '{space.small}' },
    },
    loader: {
        strokeLinecap: { value: 'round' },
        strokeEmpty: { value: '{colors.border.secondary}' },
        strokeFilled: { value: '{components.loader.strokeFilled}' },
        strokeWidth: { value: '{borderWidths.large}' },
    },
    previewer: {
        backgroundColor: { value: '{colors.background.primary}' },
        borderColor: { value: '{colors.border.primary}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.small}' },
        borderRadius: { value: '{radii.small}' },
        paddingBlock: { value: '{space.zero}' },
        paddingInline: { value: '{space.zero}' },
        maxHeight: { value: '40rem' },
        maxWidth: { value: 'auto' },
        text: {
            fontSize: { value: '{fontSizes.medium}' },
            fontWeight: { value: '{fontWeights.bold}' },
            color: { value: '{colors.font.primary}' },
        },
        body: {
            paddingBlock: { value: '{space.medium}' },
            paddingInline: { value: '{space.medium}' },
            gap: { value: '{space.small}' },
        },
        footer: {
            justifyContent: { value: 'flex-end' },
        },
    },
};

const flex = {
    gap: { value: '{space.medium.value}' },
    justifyContent: { value: 'normal' },
    alignItems: { value: 'stretch' },
    alignContent: { value: 'normal' },
    flexWrap: { value: 'nowrap' },
};

const heading = {
    color: { value: '{colors.font.primary.value}' },
    lineHeight: { value: '{lineHeights.small.value}' },
    1: {
        fontSize: { value: '{fontSizes.xxxxl.value}' },
        fontWeight: { value: '{fontWeights.light.value}' },
    },
    2: {
        fontSize: { value: '{fontSizes.xxxl.value}' },
        fontWeight: { value: '{fontWeights.normal.value}' },
    },
    3: {
        fontSize: { value: '{fontSizes.xxl.value}' },
        fontWeight: { value: '{fontWeights.medium.value}' },
    },
    4: {
        fontSize: { value: '{fontSizes.xl.value}' },
        fontWeight: { value: '{fontWeights.semibold.value}' },
    },
    5: {
        fontSize: { value: '{fontSizes.large.value}' },
        fontWeight: { value: '{fontWeights.bold.value}' },
    },
    6: {
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.extrabold.value}' },
    },
};

const highlightmatch = {
    highlighted: {
        fontWeight: { value: '{fontWeights.bold}' },
    },
};

const icon = {
    lineHeight: { value: 1 },
    height: { value: '1em' }, // Should match height of parent container font-size
};

const input = {
    color: { value: '{components.fieldcontrol.color.value}' },
    borderColor: { value: '{components.fieldcontrol.borderColor.value}' },
    fontSize: { value: '{components.fieldcontrol.fontSize.value}' },
    _focus: {
        borderColor: {
            value: '{components.fieldcontrol._focus.borderColor.value}',
        },
    },
};

const image = {
    maxWidth: { value: '100%' },
    height: { value: 'auto' },
    objectFit: { value: 'initial' },
    objectPosition: { value: 'initial' },
};

const inappmessaging = {
    banner: {
        height: { value: '150px ' },
        width: { value: '400px ' },
    },
    button: {
        backgroundColor: { value: '#e8e8e8' },
        borderRadius: { value: '5px' },
        color: { value: 'black' },
    },
    dialog: {
        height: { value: '50vh' },
        minHeight: { value: '400px' },
        minWidth: { value: '400px' },
        width: { value: '30vw' },
    },
    header: {
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.extrabold.value}' },
    },
};

const link = {
    active: { color: { value: '{colors.font.active.value}' } },
    color: { value: '{colors.font.interactive.value}' },
    focus: { color: { value: '{colors.font.focus.value}' } },
    hover: { color: { value: '{colors.font.hover.value}' } },
    visited: { color: { value: '{colors.font.interactive.value}' } },
};

const liveness = {
    cameraModule: {
        backgroundColor: { value: '{colors.background.primary.value}' },
    },
};

const loader = {
    width: { value: '{fontSizes.medium.value}' },
    height: { value: '{fontSizes.medium.value}' },
    fontSize: { value: '{fontSizes.xs.value}' },
    strokeEmpty: { value: '{colors.neutral.20.value}' },
    strokeFilled: { value: '{colors.primary.80.value}' },
    strokeLinecap: { value: 'round' },
    animationDuration: { value: '1s' },
    small: {
        width: { value: '{fontSizes.small.value}' },
        height: { value: '{fontSizes.small.value}' },
        fontSize: { value: '{fontSizes.xxs.value}' },
    },
    large: {
        width: { value: '{fontSizes.large.value}' },
        height: { value: '{fontSizes.large.value}' },
        fontSize: { value: '{fontSizes.small.value}' },
    },
    linear: {
        width: { value: '100%' },
        minWidth: { value: '5rem' },
        fontSize: { value: '{fontSizes.xxs.value}' },
        strokeWidth: { value: '{fontSizes.xxs.value}' },
        strokeFilled: { value: '{colors.primary.80.value}' },
        strokeEmpty: { value: '{colors.neutral.20.value}' },
        strokeLinecap: { value: 'round' },
        animationDuration: { value: '1s' },
        small: {
            strokeWidth: { value: '{fontSizes.xxxs.value}' },
            fontSize: { value: '{fontSizes.xxxs.value}' },
        },
        large: {
            strokeWidth: { value: '{fontSizes.xs.value}' },
            fontSize: { value: '{fontSizes.xs.value}' },
        },
    },
    text: {
        fill: { value: '{colors.font.primary.value}' },
    },
};

const menu = {
    backgroundColor: { value: '{colors.background.primary.value}' },
    borderRadius: { value: '{radii.medium.value}' },
    borderWidth: { value: '{borderWidths.small.value}' },
    borderStyle: { value: 'solid' },
    borderColor: { value: '{colors.border.primary.value}' },
    boxShadow: { value: '{shadows.large.value}' },
    flexDirection: { value: 'column' },
    gap: { value: '{space.zero.value}' },
    maxWidth: { value: '30rem' },
    minWidth: { value: '14rem' },
    small: {
        width: { value: '{fontSizes.medium.value}' },
        height: { value: '{fontSizes.medium.value}' },
    },
    large: {
        width: { value: '{fontSizes.xxxl.value}' },
        height: { value: '{fontSizes.xxxl.value}' },
    },
    item: {
        minHeight: { value: '2.5rem' },
        paddingInlineStart: { value: '{space.medium.value}' },
        paddingInlineEnd: { value: '{space.medium.value}' },
    },
};

const message = {
    // Default styles
    alignItems: { value: 'center' },
    backgroundColor: { value: '{colors.background.tertiary.value}' },
    borderColor: { value: 'transparent' },
    borderStyle: { value: 'solid' },
    borderWidth: { value: '{borderWidths.small.value}' },
    borderRadius: { value: '{radii.xs.value}' },
    color: { value: '{colors.font.primary.value}' },
    justifyContent: { value: 'flex-start' },
    paddingBlock: { value: '{space.small.value}' },
    paddingInline: { value: '{space.medium.value}' },
    lineHeight: { value: '{lineHeights.small.value}' },
    icon: {
        size: { value: '{fontSizes.xl.value}' },
    },
    heading: {
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.bold.value}' },
    },
    dismiss: {
        gap: { value: '{space.xxs.value}' },
    },
    // Variations
    plain: {
        color: { value: '{colors.font.primary.value}' },
        backgroundColor: { value: '{colors.background.primary.value}' },
        borderColor: { value: 'transparent' },
        info: {
            color: { value: '{colors.font.info.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: 'transparent' },
        },
        error: {
            color: { value: '{colors.font.error.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: 'transparent' },
        },
        success: {
            color: { value: '{colors.font.success.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: 'transparent' },
        },
        warning: {
            color: { value: '{colors.font.warning.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: 'transparent' },
        },
    },
    outlined: {
        color: { value: '{colors.font.primary.value}' },
        backgroundColor: { value: '{colors.background.primary.value}' },
        borderColor: { value: '{colors.border.primary.value}' },
        info: {
            color: { value: '{colors.font.info.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: '{colors.border.info.value}' },
        },
        error: {
            color: { value: '{colors.font.error.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: '{colors.border.error.value}' },
        },
        success: {
            color: { value: '{colors.font.success.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: '{colors.border.success.value}' },
        },
        warning: {
            color: { value: '{colors.font.warning.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: '{colors.border.warning.value}' },
        },
    },
    filled: {
        color: { value: '{colors.font.primary.value}' },
        backgroundColor: { value: '{colors.background.secondary.value}' },
        borderColor: { value: 'transparent' },
        info: {
            color: { value: '{colors.font.info.value}' },
            backgroundColor: { value: '{colors.background.info.value}' },
            borderColor: { value: 'transparent' },
        },
        error: {
            color: { value: '{colors.font.error.value}' },
            backgroundColor: { value: '{colors.background.error.value}' },
            borderColor: { value: 'transparent' },
        },
        success: {
            color: { value: '{colors.font.success.value}' },
            backgroundColor: { value: '{colors.background.success.value}' },
            borderColor: { value: 'transparent' },
        },
        warning: {
            color: { value: '{colors.font.warning.value}' },
            backgroundColor: { value: '{colors.background.warning.value}' },
            borderColor: { value: 'transparent' },
        },
    },
};

const pagination = {
    current: {
        alignItems: { value: 'center' },
        justifyContent: { value: 'center' },
        color: { value: '{colors.font.inverse.value}' },
        fontSize: { value: '{fontSizes.small.value}' },
        backgroundColor: { value: '{colors.overlay.40.value}' },
    },
    button: {
        color: { value: '{colors.font.primary.value}' },
        paddingInlineStart: { value: '{space.xxs.value}' },
        paddingInlineEnd: { value: '{space.xxs.value}' },
        transitionProperty: { value: 'background-color' },
        transitionDuration: { value: '{time.medium.value}' },
        hover: {
            backgroundColor: { value: '{colors.overlay.10.value}' },
            color: { value: '{colors.font.primary.value}' },
        },
        disabled: {
            color: { value: '{colors.font.disabled.value}' },
        },
    },
    ellipsis: {
        alignItems: { value: 'baseline' },
        justifyContent: { value: 'center' },
        paddingInlineStart: { value: '{space.xs.value}' },
        paddingInlineEnd: { value: '{space.xs.value}' },
    },
    itemContainer: {
        marginLeft: { value: '{space.xxxs.value}' },
        marginRight: { value: '{space.xxxs.value}' },
    },
    itemShared: {
        height: { value: '{fontSizes.xxl.value}' },
        minWidth: { value: '{fontSizes.xxl.value}' },
        borderRadius: { value: '{fontSizes.medium.value}' },
    },
};

const passwordfield = {
    color: { value: '{components.fieldcontrol.color.value}' },
    button: {
        color: { value: '{components.button.color.value}' },
        _active: {
            backgroundColor: {
                value: '{components.button._active.backgroundColor.value}',
            },
            borderColor: { value: '{components.button._active.borderColor.value}' },
            color: { value: '{components.button._active.color.value}' },
        },
        _disabled: {
            backgroundColor: {
                value: '{components.button._disabled.backgroundColor.value}',
            },
            borderColor: {
                value: '{components.button._disabled.borderColor.value}',
            },
            color: { value: '{components.button._disabled.color.value}' },
        },
        _error: {
            color: { value: '{components.button.outlined.error.color.value}' },
            backgroundColor: {
                value: '{components.button.outlined.error.backgroundColor.value}',
            },
            borderColor: {
                value: '{components.button.outlined.error.borderColor.value}',
            },
            _active: {
                borderColor: {
                    value: '{components.button.outlined.error._active.borderColor.value}',
                },
                backgroundColor: {
                    value: '{components.button.outlined.error._active.backgroundColor.value}',
                },
                color: {
                    value: '{components.button.outlined.error._active.color.value}',
                },
            },
            _focus: {
                borderColor: {
                    value: '{components.button.outlined.error._focus.borderColor.value}',
                },
                backgroundColor: {
                    value: '{components.button.outlined.error._focus.backgroundColor.value}',
                },
                color: {
                    value: '{components.button.outlined.error._focus.color.value}',
                },
                boxShadow: {
                    value: '{components.button.outlined.error._focus.boxShadow.value}',
                },
            },
            _hover: {
                borderColor: {
                    value: '{components.button.outlined.error._hover.borderColor.value}',
                },
                backgroundColor: {
                    value: '{components.button.outlined.error._hover.backgroundColor.value}',
                },
                color: {
                    value: '{components.button.outlined.error._hover.color.value}',
                },
            },
        },
        _focus: {
            backgroundColor: {
                value: '{components.button._focus.backgroundColor.value}',
            },
            borderColor: { value: '{components.button._focus.borderColor.value}' },
            color: { value: '{components.button._focus.color.value}' },
        },
        _hover: {
            backgroundColor: {
                value: '{components.button._hover.backgroundColor.value}',
            },
            borderColor: { value: '{components.button._hover.borderColor.value}' },
            color: { value: '{components.button._hover.color.value}' },
        },
    },
};

const phonenumberfield = {
    color: { value: '{components.fieldcontrol.color}' },
    borderColor: { value: '{components.fieldcontrol.borderColor}' },
    fontSize: { value: '{components.fieldcontrol.fontSize}' },
    _focus: {
        borderColor: { value: '{components.fieldcontrol._focus.borderColor}' },
    },
};

const placeholder = {
    borderRadius: { value: '{radii.small.value}' },
    transitionDuration: { value: '{time.long.value}' },
    startColor: { value: '{colors.background.secondary.value}' },
    endColor: { value: '{colors.background.tertiary.value}' },
    // sizes
    small: {
        height: { value: '{space.small.value}' },
    },
    default: {
        height: { value: '{space.medium.value}' },
    },
    large: {
        height: { value: '{space.large.value}' },
    },
};

const radio = {
    alignItems: { value: 'center' },
    justifyContent: { value: 'flex-start' },
    gap: { value: 'inherit' },
    _disabled: { cursor: { value: 'not-allowed' } },
    button: {
        alignItems: { value: 'center' },
        justifyContent: { value: 'center' },
        width: { value: '{fontSizes.medium.value}' },
        height: { value: '{fontSizes.medium.value}' },
        boxSizing: { value: 'border-box' },
        borderWidth: { value: '{borderWidths.medium.value}' },
        borderStyle: { value: 'solid' },
        borderRadius: { value: '50%' },
        borderColor: { value: '{colors.border.primary.value}' },
        color: { value: '{colors.background.primary.value}' },
        backgroundColor: { value: '{colors.background.primary.value}' },
        transitionProperty: { value: 'all' },
        transitionDuration: { value: '{time.medium.value}' },
        outlineColor: { value: '{colors.transparent.value}' },
        outlineStyle: { value: 'solid' },
        outlineWidth: { value: '{outlineWidths.medium.value}' },
        outlineOffset: { value: '{outlineOffsets.medium.value}' },
        // We want the dot inside the border to be a border-width from the border
        padding: { value: '{borderWidths.medium.value}' },
        small: {
            width: { value: '{fontSizes.small.value}' },
            height: { value: '{fontSizes.small.value}' },
        },
        large: {
            width: { value: '{fontSizes.large.value}' },
            height: { value: '{fontSizes.large.value}' },
        },
        _checked: {
            color: {
                value: '{colors.primary.80.value}',
            },
            _disabled: { color: { value: '{colors.background.disabled.value}' } },
        },
        _focus: {
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
        },
        _error: {
            borderColor: { value: '{colors.border.error.value}' },
            _focus: {
                boxShadow: {
                    value: '{components.fieldcontrol._error._focus.boxShadow.value}',
                },
            },
        },
        _disabled: {
            borderColor: { value: '{colors.border.disabled.value}' },
            backgroundColor: { value: '{colors.background.primary.value}' },
        },
    },
    label: {
        color: { value: '{components.text.color.value}' },
        _disabled: {
            color: {
                value: '{colors.font.disabled.value}',
            },
        },
    },
};

const radiogroup = {
    radio: {
        borderWidth: { value: '{components.radio.button.borderWidth}' },
        borderColor: { value: '{components.radio.button.borderColor}' },
        backgroundColor: { value: '{components.radio.button.backgroundColor}' },
        _checked: {
            color: { value: '{components.radio.button._checked.color}' },
        },
        label: {
            color: { value: '{components.radio.label.color}' },
        },
    },
    legend: {
        color: { value: '{components.fieldset.legend.color}' },
        fontWeight: { value: '{fontWeights.normal}' },
    },
};

const rating = {
    large: { size: { value: '{fontSizes.xxxl.value}' } },
    default: { size: { value: '{fontSizes.xl.value}' } },
    small: { size: { value: '{fontSizes.small.value}' } },
    filled: { color: { value: '{colors.secondary.80.value}' } },
    empty: { color: { value: '{colors.background.tertiary.value}' } },
};

const searchfield = {
    color: { value: '{components.fieldcontrol.color.value}' },
    button: {
        color: { value: '{components.button.color.value}' },
        backgroundColor: { value: '{colors.background.primary.value}' },
        _active: {
            backgroundColor: {
                value: '{components.button._active.backgroundColor.value}',
            },
            borderColor: { value: '{components.button._active.borderColor.value}' },
            color: { value: '{components.button._active.color.value}' },
        },
        _disabled: {
            backgroundColor: {
                value: '{components.button._disabled.backgroundColor.value}',
            },
            borderColor: {
                value: '{components.button._disabled.borderColor.value}',
            },
            color: { value: '{components.button._disabled.color.value}' },
        },
        _focus: {
            backgroundColor: {
                value: '{components.button._focus.backgroundColor.value}',
            },
            borderColor: { value: '{components.button._focus.borderColor.value}' },
            color: { value: '{components.button._focus.color.value}' },
        },
        _hover: {
            backgroundColor: {
                value: '{components.button._hover.backgroundColor.value}',
            },
            borderColor: { value: '{components.button._hover.borderColor.value}' },
            color: { value: '{components.button._hover.color.value}' },
        },
    },
};

const select = {
    color: { value: '{components.fieldcontrol.color}' },
    backgroundColor: { value: '{colors.background.primary.value}' },
    paddingInlineEnd: { value: '{space.xxl.value}' },
    _disabled: {
        color: { value: '{colors.font.disabled.value}' },
        backgroundColor: { value: '{colors.background.disabled.value}' },
    },
    // wrappers
    wrapper: {
        flex: { value: '1' },
        display: { value: 'block' },
        position: { value: 'relative' },
        cursor: { value: 'pointer' },
    },
    iconWrapper: {
        alignItems: { value: 'center' },
        position: { value: 'absolute' },
        top: { value: '50%' },
        right: { value: '{space.medium.value}' },
        transform: { value: 'translateY(-50%)' },
        pointerEvents: { value: 'none' },
        small: {
            right: { value: '{space.xs.value}' },
        },
        large: {
            right: { value: '{space.medium.value}' },
        },
    },
    // It's important to test these option values on Chrome/FireFox/Edge
    // on Windows because they allow styling of the option element.
    // Chrome/Safari/Firefox on Mac uses the system ui.
    option: {
        backgroundColor: { value: 'transparent' },
        color: { value: '{colors.font.primary.value}' },
        _disabled: {
            color: { value: '{colors.font.disabled.value}' },
            backgroundColor: {
                value: 'transparent',
            },
        },
    },
    whiteSpace: { value: 'nowrap' },
    minWidth: { value: '6.5rem' },
    small: {
        minWidth: { value: '5.5rem' },
        paddingInlineEnd: { value: '{space.xl.value}' },
    },
    large: {
        minWidth: { value: '7.5rem' },
        paddingInlineEnd: { value: '{space.xxl.value}' },
    },
    expanded: {
        paddingBlock: { value: '{space.xs.value}' },
        paddingInline: { value: '{space.small.value}' },
        option: {
            paddingBlock: { value: '{space.xs.value}' },
            paddingInline: { value: '{space.small.value}' },
        },
    },
};

const selectfield = {
    borderColor: { value: '{components.fieldcontrol.borderColor}' },
    color: { value: '{components.fieldcontrol.color}' },
    flexDirection: {
        value: 'column',
    },
    fontSize: { value: '{components.fieldcontrol.fontSize}' },
    _focus: {
        borderColor: { value: '{components.fieldcontrol._focus.borderColor}' },
    },
    label: {
        color: { value: '{components.field.label.color}' },
    },
};

const sliderfield = {
    paddingBlock: { value: '{space.xs.value}' },
    // The track is the thin background of the slider
    track: {
        backgroundColor: { value: '{colors.background.quaternary.value}' },
        borderRadius: { value: '9999px' },
        height: { value: '0.375rem' },
        minWidth: { value: '10rem' },
    },
    // The range is the filled part of the track
    range: {
        backgroundColor: { value: '{colors.primary.80.value}' },
        borderRadius: { value: '9999px' },
        _disabled: {
            backgroundColor: { value: '{colors.background.disabled.value}' },
        },
    },
    // The thumb is the circle above the track that the user drags
    thumb: {
        width: { value: '1.25rem' },
        height: { value: '1.25rem' },
        backgroundColor: { value: '{colors.background.primary.value}' },
        boxShadow: { value: '{shadows.small.value}' },
        borderRadius: { value: '50%' },
        borderWidth: { value: '{borderWidths.medium.value}' },
        borderColor: { value: '{colors.border.primary.value}' },
        borderStyle: { value: 'solid' },
        _disabled: {
            backgroundColor: { value: '{colors.background.disabled.value}' },
            borderColor: { value: 'transparent' },
            boxShadow: { value: 'none' },
        },
        _hover: {
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: '{colors.border.focus.value}' },
        },
        _focus: {
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
        },
    },
    small: {
        track: {
            height: { value: '0.25rem' },
        },
        thumb: {
            width: { value: '1rem' },
            height: { value: '1rem' },
        },
    },
    large: {
        track: {
            height: { value: '0.625rem' },
        },
        thumb: {
            width: { value: '1.5rem' },
            height: { value: '1.5rem' },
        },
    },
};

const stepperfield = {
    borderColor: { value: '{components.fieldcontrol.borderColor}' },
    flexDirection: { value: 'column' },
    input: {
        color: { value: '{components.fieldcontrol.color}' },
        fontSize: { value: '{components.fieldcontrol.fontSize}' },
        textAlign: { value: 'center' },
    },
    button: {
        color: { value: '{components.button.color}' },
        backgroundColor: { value: '{colors.transparent}' },
        _active: {
            color: { value: '{components.button._active.color}' },
            backgroundColor: { value: '{components.button._active.backgroundColor}' },
        },
        _focus: {
            color: { value: '{components.button._focus.color}' },
            backgroundColor: { value: '{components.button._focus.backgroundColor}' },
        },
        _disabled: {
            color: { value: '{components.button._disabled.color}' },
            backgroundColor: {
                value: '{components.fieldcontrol._disabled.backgroundColor}',
            },
        },
        _hover: {
            color: { value: '{components.button._hover.color}' },
            backgroundColor: { value: '{components.button._hover.backgroundColor}' },
        },
    },
};

const storagemanager = {
    dropzone: {
        backgroundColor: { value: '{colors.background.primary}' },
        borderRadius: { value: '{radii.small}' },
        borderColor: { value: '{colors.border.primary}' },
        borderStyle: { value: 'dashed' },
        borderWidth: { value: '{borderWidths.small}' },
        gap: { value: '{space.small}' },
        paddingBlock: { value: '{space.xl}' },
        paddingInline: { value: '{space.large}' },
        textAlign: { value: 'center' },
        _active: {
            backgroundColor: { value: '{colors.primary.10}' },
            borderRadius: {
                value: '{components.storagemanager.dropzone.borderRadius}',
            },
            borderColor: { value: '{colors.border.pressed}' },
            borderStyle: {
                value: '{components.storagemanager.dropzone.borderStyle}',
            },
            borderWidth: { value: '{borderWidths.medium}' },
        },
        icon: {
            color: { value: '{colors.border.primary}' },
            fontSize: { value: '{fontSizes.xxl}' },
        },
        text: {
            color: { value: '{colors.font.tertiary}' },
            fontSize: { value: '{fontSizes.medium}' },
            fontWeight: { value: '{fontWeights.bold}' },
        },
    },
    file: {
        backgroundColor: { value: '{colors.background.primary}' },
        borderRadius: { value: '{radii.small}' },
        borderColor: { value: '{colors.border.primary}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.small}' },
        paddingBlock: { value: '{space.xs}' },
        paddingInline: { value: '{space.small}' },
        gap: { value: '{space.small}' },
        alignItems: { value: 'baseline' },
        name: {
            fontSize: { value: '{fontSizes.medium}' },
            fontWeight: { value: '{fontWeights.bold}' },
            color: { value: '{colors.font.primary}' },
        },
        size: {
            fontSize: { value: '{fontSizes.small}' },
            fontWeight: { value: '{fontWeights.normal}' },
            color: { value: '{colors.font.tertiary}' },
        },
        image: {
            width: { value: '{space.xxl}' },
            height: { value: '{space.xxl}' },
            backgroundColor: { value: '{colors.background.secondary}' },
            color: { value: '{colors.font.tertiary}' },
            borderRadius: { value: '{radii.small}' },
        },
    },
    filelist: {
        flexDirection: { value: 'column' },
        gap: { value: '{space.small}' },
    },
    loader: {
        strokeLinecap: { value: 'round' },
        strokeEmpty: { value: '{colors.border.secondary}' },
        strokeFilled: { value: '{components.loader.strokeFilled}' },
        strokeWidth: { value: '{borderWidths.large}' },
    },
    previewer: {
        backgroundColor: { value: '{colors.background.primary}' },
        borderColor: { value: '{colors.border.primary}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.small}' },
        borderRadius: { value: '{radii.small}' },
        paddingBlock: { value: '{space.zero}' },
        paddingInline: { value: '{space.zero}' },
        maxHeight: { value: '40rem' },
        maxWidth: { value: 'auto' },
        text: {
            fontSize: { value: '{fontSizes.medium}' },
            fontWeight: { value: '{fontWeights.bold}' },
            color: { value: '{colors.font.primary}' },
        },
        body: {
            paddingBlock: { value: '{space.medium}' },
            paddingInline: { value: '{space.medium}' },
            gap: { value: '{space.small}' },
        },
        footer: {
            justifyContent: { value: 'flex-end' },
        },
    },
};

const switchfield = {
    // States
    _disabled: {
        opacity: { value: '{opacities.60.value}' },
    },
    _focused: {
        shadow: {
            value: '{components.fieldcontrol._focus.boxShadow.value}',
        },
    },
    // Sizes
    fontSize: { value: '{fontSizes.medium.value}' },
    large: {
        fontSize: { value: '{fontSizes.large.value}' },
    },
    small: {
        fontSize: { value: '{fontSizes.small.value}' },
    },
    // Child elements
    label: {
        padding: { value: '{space.xs.value}' },
    },
    thumb: {
        backgroundColor: { value: '{colors.background.primary.value}' },
        borderColor: { value: 'transparent' },
        borderWidth: { value: '{borderWidths.small.value}' },
        borderStyle: { value: 'solid' },
        borderRadius: { value: '{radii.xxxl.value}' },
        checked: {
            transform: { value: '{transforms.slideX.medium.value}' },
        },
        transition: {
            duration: { value: '{time.medium.value}' },
        },
        width: { value: '{space.relative.medium.value}' },
    },
    track: {
        backgroundColor: { value: '{colors.background.quaternary.value}' },
        borderRadius: { value: '{radii.xxxl.value}' },
        checked: {
            backgroundColor: { value: '{colors.primary.80.value}' },
        },
        height: { value: '{space.relative.medium.value}' },
        padding: { value: '{outlineWidths.medium.value}' },
        transition: {
            duration: { value: '{time.short.value}' },
        },
        width: { value: '{space.relative.xl.value}' },
        _error: {
            backgroundColor: { value: '{colors.background.error.value}' },
        },
    },
};

const table = {
    /**
     * Default table styles
     */
    borderCollapse: { value: 'collapse' },
    display: { value: 'table' },
    width: { value: '100%' },
    /**
     * Default table head styles
     */
    head: {
        display: { value: 'table-header-group' },
        verticalAlign: { value: 'middle' },
    },
    /**
     * Default table body styles
     */
    body: {
        display: { value: 'table-row-group' },
        verticalAlign: { value: 'middle' },
    },
    /**
     * Default table foot styles
     */
    foot: {
        display: { value: 'table-footer-group' },
        verticalAlign: { value: 'middle' },
    },
    /**
     * Default table row styles
     */
    row: {
        display: { value: 'table-row' },
        verticalAlign: { value: 'middle' },
        hover: {
            backgroundColor: { value: '{colors.background.tertiary.value}' },
        },
        striped: {
            backgroundColor: { value: '{colors.background.secondary.value}' },
        },
    },
    /**
     * Default table header cell styles
     */
    header: {
        borderColor: { value: '{colors.border.tertiary.value}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.small.value}' },
        color: { value: '{colors.font.primary.value}' },
        display: { value: 'table-cell' },
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.bold.value}' },
        padding: { value: '{space.medium.value}' },
        verticalAlign: { value: 'middle' },
        large: {
            fontSize: { value: '{fontSizes.large.value}' },
            padding: { value: '{space.large.value}' },
        },
        small: {
            fontSize: { value: '{fontSizes.small.value}' },
            padding: { value: '{space.xs.value}' },
        },
    },
    /**
     * Default table data cell styles
     */
    data: {
        borderColor: { value: '{colors.border.tertiary.value}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.small.value}' },
        color: { value: '{colors.font.primary.value}' },
        display: { value: 'table-cell' },
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.normal.value}' },
        padding: { value: '{space.medium.value}' },
        verticalAlign: { value: 'middle' },
        large: {
            fontSize: { value: '{fontSizes.large.value}' },
            padding: { value: '{space.large.value}' },
        },
        small: {
            fontSize: { value: '{fontSizes.small.value}' },
            padding: { value: '{space.xs.value}' },
        },
    },
    /**
     * Default table caption styles
     */
    caption: {
        captionSide: { value: 'bottom' },
        color: { value: '{colors.font.primary.value}' },
        display: { value: 'table-caption' },
        fontSize: { value: '{fontSizes.medium.value}' },
        textAlign: { value: 'center' },
        wordBreak: { value: 'break-all' },
        large: {
            fontSize: { value: '{fontSizes.large.value}' },
        },
        small: {
            fontSize: { value: '{fontSizes.small.value}' },
        },
    },
};

const tabs = {
    backgroundColor: { value: 'transparent' },
    borderColor: { value: '{colors.border.secondary.value}' },
    borderStyle: { value: 'solid' },
    borderWidth: { value: '{borderWidths.medium.value}' },
    gap: { value: '0' },
    item: {
        backgroundColor: { value: 'transparent' },
        borderColor: { value: '{colors.border.secondary.value}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.medium.value}' },
        color: { value: '{colors.font.secondary.value}' },
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.bold.value}' },
        paddingVertical: { value: '{space.small.value}' },
        paddingHorizontal: { value: '{space.medium.value}' },
        textAlign: { value: 'center' },
        transitionDuration: { value: '{time.medium.value}' },
        _hover: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: { value: 'none' },
            color: { value: '{colors.font.hover.value}' },
        },
        _focus: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: {
                value: {
                    offsetX: '0px',
                    offsetY: '0px',
                    blurRadius: '0px',
                    spreadRadius: '{borderWidths.medium}',
                    color: '{colors.border.focus.value}',
                },
            },
            color: { value: '{colors.font.focus.value}' },
        },
        _active: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.font.interactive.value}' },
            boxShadow: { value: 'none' },
            color: { value: '{colors.font.interactive.value}' },
        },
        _disabled: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.border.tertiary.value}' },
            boxShadow: { value: 'none' },
            color: { value: '{colors.font.disabled.value}' },
        },
    },
    panel: {
        backgroundColor: { value: 'transparent' },
        paddingInline: { value: '0' },
        paddingBlock: { value: '{space.small.value}' },
    },
};

const text = {
    // default styles
    color: { value: '{colors.font.primary.value}' },
    // variations
    primary: {
        color: { value: '{colors.font.primary.value}' },
    },
    secondary: {
        color: { value: '{colors.font.secondary.value}' },
    },
    tertiary: {
        color: { value: '{colors.font.tertiary.value}' },
    },
    error: {
        color: { value: '{colors.font.error.value}' },
    },
    warning: {
        color: { value: '{colors.font.warning.value}' },
    },
    success: {
        color: { value: '{colors.font.success.value}' },
    },
    info: {
        color: { value: '{colors.font.info.value}' },
    },
};

const textareafield = {
    color: { value: '{components.fieldcontrol.color.value}' },
    borderColor: { value: '{components.fieldcontrol.borderColor.value}' },
    _focus: {
        borderColor: {
            value: '{components.fieldcontrol._focus.borderColor.value}',
        },
    },
};

const textfield = {
    color: { value: '{components.fieldcontrol.color.value}' },
    borderColor: { value: '{components.fieldcontrol.borderColor.value}' },
    fontSize: { value: '{components.fieldcontrol.fontSize.value}' },
    _focus: {
        borderColor: {
            value: '{components.fieldcontrol._focus.borderColor.value}',
        },
    },
};

const togglebutton = {
    borderColor: { value: '{colors.border.primary.value}' },
    color: { value: '{colors.font.primary.value}' },
    _hover: {
        backgroundColor: { value: '{colors.overlay.10.value}' },
    },
    _focus: {
        borderColor: { value: '{colors.border.focus.value}' },
        color: { value: '{colors.font.primary.value}' },
    },
    _active: {
        backgroundColor: { value: '{colors.transparent.value}' },
    },
    _disabled: {
        backgroundColor: { value: '{colors.transparent.value}' },
        borderColor: { value: '{colors.border.disabled.value}' },
        color: { value: '{colors.font.disabled.value}' },
    },
    _pressed: {
        borderColor: { value: '{colors.border.pressed.value}' },
        color: { value: '{colors.font.primary.value}' },
        backgroundColor: { value: '{colors.overlay.20.value}' },
        _hover: {
            backgroundColor: { value: '{colors.overlay.30.value}' },
        },
    },
    primary: {
        backgroundColor: { value: '{colors.transparent.value}' },
        borderWidth: { value: '{borderWidths.small.value}' },
        _focus: {
            borderColor: { value: '{colors.border.focus.value}' },
            backgroundColor: { value: '{colors.transparent.value}' },
            boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
            color: { value: '{colors.font.primary.value}' },
        },
        _hover: {
            backgroundColor: { value: '{colors.overlay.10.value}' },
            color: { value: '{colors.font.primary.value}' },
        },
        _disabled: {
            borderColor: { value: '{colors.border.disabled.value}' },
            backgroundColor: { value: '{colors.background.disabled.value}' },
            color: { value: '{colors.font.disabled.value}' },
        },
        _pressed: {
            backgroundColor: { value: '{colors.primary.80.value}' },
            borderColor: { value: '{colors.primary.80.value}' },
            color: { value: '{colors.background.primary.value}' },
            _focus: {
                backgroundColor: {
                    value: '{colors.border.focus.value}',
                },
                borderColor: { value: '{colors.border.focus.value}' },
                color: { value: '{colors.background.primary.value}' },
            },
            _hover: {
                borderColor: { value: '{colors.primary.60.value}' },
                backgroundColor: {
                    value: '{colors.primary.60.value}',
                },
                boxShadow: { value: '{colors.primary.60.value}' },
                color: { value: '{colors.background.primary.value}' },
            },
        },
    },
    link: {
        backgroundColor: { value: '{colors.transparent.value}' },
        color: { value: '{colors.overlay.50.value}' },
        _hover: {
            backgroundColor: { value: '{colors.transparent.value}' },
            color: { value: '{colors.overlay.50.value}' },
        },
        _focus: {
            backgroundColor: { value: '{colors.transparent.value}' },
            color: { value: '{colors.overlay.50.value}' },
        },
        _disabled: {
            backgroundColor: { value: '{colors.transparent.value}' },
            color: { value: '{colors.font.disabled.value}' },
        },
        _pressed: {
            backgroundColor: { value: '{colors.transparent.value}' },
            color: { value: '{colors.overlay.90.value}' },
            _focus: {
                backgroundColor: { value: '{colors.transparent.value}' },
                color: { value: '{colors.overlay.90.value}' },
            },
            _hover: {
                color: { value: '{colors.overlay.90.value}' },
                backgroundColor: { value: '{colors.transparent.value}' },
            },
        },
    },
};

const togglebuttongroup = {
    alignItems: { value: 'center' },
    alignContent: { value: 'center' },
    justifyContent: { value: 'flex-start' },
};

const components = {
    accordion,
    alert,
    authenticator,
    autocomplete,
    avatar,
    badge,
    breadcrumbs,
    button,
    card,
    checkbox,
    checkboxfield,
    collection,
    copy,
    countrycodeselect: dialcodeselect,
    divider,
    dropzone,
    field,
    fieldcontrol,
    fieldgroup,
    fieldmessages,
    fieldset,
    fileuploader,
    flex,
    heading,
    icon,
    highlightmatch,
    image,
    inappmessaging,
    input,
    link,
    liveness,
    loader,
    menu,
    message,
    pagination,
    passwordfield,
    phonenumberfield,
    placeholder,
    radio,
    radiogroup,
    rating,
    searchfield,
    select,
    selectfield,
    sliderfield,
    stepperfield,
    storagemanager,
    switchfield,
    table,
    tabs,
    text,
    textareafield,
    textfield,
    togglebutton,
    togglebuttongroup,
};

// TODO: update the design tokens to use an array
// export interface FontDesignToken {
//   value: Array<string>
// }
const fonts = {
    default: {
        variable: {
            value: `'InterVariable', 'Inter var', 'Inter', -apple-system, BlinkMacSystemFont,
        'Helvetica Neue', 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans',
        sans-serif`,
        },
        static: {
            value: `'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
        'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif`,
        },
    },
};

const fontSizes = {
    xxxs: { value: '0.375rem' },
    xxs: { value: '0.5rem' },
    xs: { value: '0.75rem' },
    small: { value: '0.875rem' },
    medium: { value: '1rem' },
    large: { value: '1.25rem' },
    xl: { value: '1.5rem' },
    xxl: { value: '2rem' },
    xxxl: { value: '2.5rem' },
    xxxxl: { value: '3rem' },
};

const fontWeights = {
    hairline: { value: 100 },
    thin: { value: 200 },
    light: { value: 300 },
    normal: { value: 400 },
    medium: { value: 500 },
    semibold: { value: 600 },
    bold: { value: 700 },
    extrabold: { value: 800 },
    black: { value: 900 },
};

const lineHeights = {
    small: { value: '1.25' },
    medium: { value: '1.5' },
    large: { value: '2' },
};

const opacities = {
    0: { value: '0' },
    10: { value: '0.1' },
    20: { value: '0.2' },
    30: { value: '0.3' },
    40: { value: '0.4' },
    50: { value: '0.5' },
    60: { value: '0.6' },
    70: { value: '0.7' },
    80: { value: '0.8' },
    90: { value: '0.9' },
    100: { value: '1' },
};

const outlineOffsets = {
    small: { value: '1px' },
    medium: { value: '2px' },
    large: { value: '3px' },
};

const outlineWidths = {
    small: { value: '1px' },
    medium: { value: '2px' },
    large: { value: '3px' },
};

const radii = {
    xs: { value: '0.125rem' },
    small: { value: '0.25rem' },
    medium: { value: '0.5rem' },
    large: { value: '1rem' },
    xl: { value: '2rem' },
    xxl: { value: '4rem' },
    xxxl: { value: '8rem' },
};

const shadows = {
    small: {
        value: {
            offsetX: '0px',
            offsetY: '2px',
            blurRadius: '4px',
            color: '{colors.shadow.tertiary.value}',
        },
    },
    medium: {
        value: {
            offsetX: '0px',
            offsetY: '2px',
            blurRadius: '6px',
            color: '{colors.shadow.secondary.value}',
        },
    },
    large: {
        value: {
            offsetX: '0px',
            offsetY: '4px',
            blurRadius: '12px',
            color: '{colors.shadow.primary.value}',
        },
    },
};

const space = {
    zero: { value: '0' },
    xxxs: { value: '0.25rem' },
    xxs: { value: '0.375rem' },
    xs: { value: '0.5rem' },
    small: { value: '0.75rem' },
    medium: { value: '1rem' },
    large: { value: '1.5rem' },
    xl: { value: '2.0rem' },
    xxl: { value: '3.0rem' },
    xxxl: { value: '4.5rem' },
    relative: {
        //creating a second set of sizes using em which will be sized relative to a parent instead of the root
        xxxs: { value: '0.25em' },
        xxs: { value: '0.375em' },
        xs: { value: '0.5em' },
        small: { value: '0.75em' },
        medium: { value: '1em' },
        large: { value: '1.5em' },
        xl: { value: '2.0em' },
        xxl: { value: '3.0em' },
        xxxl: { value: '4.5em' },
        full: { value: '100%' },
    },
};
// I want to be able to pass in a Theme object that has extra tokens
// and it returns that same object type WITH the extra tokens

const time = {
    short: { value: '100ms' },
    medium: { value: '250ms' },
    long: { value: '500ms' },
};

const transforms = {
    // TODO: make this more generic and cross-platform
    slideX: {
        small: { value: 'translateX(0.5em)' },
        medium: { value: 'translateX(1em)' },
        large: { value: 'translateX(2em)' },
    },
};

const tokens = {
    components,
    borderWidths,
    colors,
    fonts,
    fontSizes,
    fontWeights,
    lineHeights,
    opacities,
    outlineOffsets,
    outlineWidths,
    radii,
    shadows,
    space,
    time,
    transforms,
};
const reactNativeTokens = {
    colors,
    borderWidths,
    fontSizes: {
        xxs: fontSizes.xxs,
        xs: fontSizes.xs,
        small: fontSizes.small,
        medium: fontSizes.medium,
        large: fontSizes.large,
        xl: fontSizes.xl,
        xxl: fontSizes.xxl,
        xxxl: fontSizes.xxxl,
    },
    fontWeights,
    opacities,
    // React Native doesn't need the relative space values
    space: {
        // use `space.xxxs` to output a value of `2` and avoid odd space numbers
        xxs: space.xxxs,
        xs: space.xs,
        small: space.small,
        medium: space.medium,
        large: space.large,
        xl: space.xl,
        xxl: space.xxl,
        xxxl: space.xxxl,
    },
    radii,
    time,
};

// Breakpoint unit is in pixels
const breakpoints = {
    values: {
        base: 0,
        small: 480,
        medium: 768,
        large: 992,
        xl: 1280,
        xxl: 1536,
    },
    defaultBreakpoint: 'base',
};

const defaultTheme = {
    tokens,
    breakpoints,
    name: 'default-theme',
};

const CSS_VARIABLE_PREFIX = 'amplify';
/**
 * This will take an object like:
 * {paddingTop:'20px',color:'{colors.font.primary}'}
 * and turn it into a CSS string:
 * `padding-top:20px; color: var(--colors-font-primary);`
 */
function propsToString(props) {
    return Object.entries(props)
        .map(([key, value]) => {
        const _value = isDesignToken(value)
            ? value.toString()
            : // @ts-ignore
                cssValue({ value });
        return `${kebabCase__default["default"](key)}:${_value}; `;
    })
        .join(' ');
}
function cssNameTransform({ path = [] }) {
    return `${kebabCase__default["default"]([CSS_VARIABLE_PREFIX, ...path].join(' '))}`;
}
// Important: these properties should not be altered in
// order to maintain the expected order of the CSS `box-shadow` property
const SHADOW_PROPERTIES = [
    'offsetX',
    'offsetY',
    'blurRadius',
    'spreadRadius',
    'color',
];
/**
 * Will take a design token in a theme and return its value as CSS
 *
 * @param token
 * @returns
 */
function cssValue(token) {
    const { value } = token;
    if (isString(value)) {
        return referenceValue(value);
    }
    if (isShadowTokenObject(value)) {
        return SHADOW_PROPERTIES.map((property) => {
            return referenceValue(
            // lookup property against `token` first for custom non-nested value, then lookup
            // property against `value` for design token value
            isShadowTokenObject(token) ? token[property] : value[property]);
        }).join(' ');
    }
    return value;
}
/**
 * Helper function to test if something is a design token or not.
 * Used in the React component style props.
 *
 * @param value - thing to test if it is a design token or not
 * @returns boolean
 */
function isDesignToken(value) {
    return isObject(value) && has(value, 'value');
}
function isShadowTokenObject(value) {
    return isObject(value) && has(value, 'offsetX');
}
/**
 * Function that sees if a string contains a design token reference
 * and if so will turn that into a CSS variable.
 *
 * @param {string} value
 * @returns string
 */
function referenceValue(value) {
    if (!value)
        return '';
    if (usesReference(value)) {
        const path = value.replace(/\{|\}/g, '').replace('.value', '').split('.');
        return `var(--${cssNameTransform({ path })})`;
    }
    return value;
}
/**
 * This will take a design token and add some data to it for it
 * to be used in JS/CSS. It will create its CSS var name and update
 * the value to use a CSS var if it is a reference. It will also
 * add a `.toString()` method to make it easier to use in JS.
 *
 * We should see if there is a way to share this logic with style dictionary...
 */
const setupToken = ({ token, path }) => {
    const name = `--${cssNameTransform({ path })}`;
    const { value: original } = token;
    const value = cssValue(token);
    return { name, original, path, value, toString: () => `var(${name})` };
};
/**
 * Recursive function that will walk down the token object
 * and perform the setupToken function on each token.
 * Similar to what Style Dictionary does.
 */
function setupTokens({ tokens, path = [], setupToken, }) {
    if (has(tokens, 'value')) {
        return setupToken({ token: tokens, path });
    }
    const output = {};
    for (const name in tokens) {
        if (has(tokens, name)) {
            const value = tokens[name];
            const nextTokens = isObject(value) ? value : { value };
            output[name] = setupTokens({
                tokens: nextTokens,
                path: path.concat(name),
                setupToken,
            });
        }
    }
    return output;
}
// Internal Style Dictionary methods
// copied from amzn/style-dictionary with the owner's permission
/**
 * Takes an plain javascript object and will make a flat array of all the leaf nodes.
 * A leaf node in this context has a 'value' property. Potentially refactor this to
 * be more generic.
 * @private
 * @param  {Object} properties - The plain object you want flattened into an array.
 * @param  {Array} [to_ret=[]] - Properties array. This function is recursive therefore this is what gets passed along.
 * @return {Array}
 */
function flattenProperties(properties, to_ret) {
    to_ret = to_ret || [];
    for (var name in properties) {
        if (has(properties, name)) {
            if (isObject(properties[name]) && 'value' in properties[name]) {
                to_ret.push(properties[name]);
            }
            else if (isObject(properties[name])) {
                flattenProperties(properties[name], to_ret);
            }
        }
    }
    return to_ret;
}
/**
 * Performs an deep extend on the objects, from right to left.
 * @private
 * @param {Object[]} objects - An array of JS objects
 * @param {Function} collision - A function to be called when a merge collision happens.
 * @param {string[]} path - (for internal use) An array of strings which is the current path down the object when this is called recursively.
 * @returns {Object}
 */
function deepExtend(objects, collision, path) {
    if (objects == null)
        return {};
    var src, copyIsArray, copy, name, options, clone, target = objects[0] || {}, i = 1, length = objects.length;
    path = path || [];
    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object') {
        target = {};
    }
    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = objects[i]) != null) {
            // Extend the base object
            for (name in options) {
                if (!has(options, name))
                    continue;
                if (name === '__proto__')
                    continue;
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (copy && (isObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    }
                    else {
                        clone = src && isObject(src) ? src : {};
                    }
                    var nextPath = path.slice(0);
                    nextPath.push(name);
                    // Never move original objects, clone them
                    target[name] = deepExtend([clone, copy], collision, nextPath);
                    // Don't bring in undefined values
                }
                else if (copy !== undefined) {
                    if (src != null && typeof collision == 'function') {
                        collision({ target: target, copy: options, path: path, key: name });
                    }
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}
/**
 * Checks if the value uses a value reference.
 * @param {string} value
 * @returns {boolean} - True, if the value uses a value reference
 */
function usesReference(value) {
    const regex = new RegExp('\\{([^}]+)\\}', 'g');
    if (typeof value === 'string') {
        return regex.test(value);
    }
    if (typeof value === 'object') {
        let hasReference = false;
        // iterate over each property in the object,
        // if any element passes the regex test,
        // the whole thing should be true
        for (const key in value) {
            if (has(value, key)) {
                const element = value[key];
                let reference = usesReference(element);
                if (reference) {
                    hasReference = true;
                    break;
                }
            }
        }
        return hasReference;
    }
    return false;
}

function addVars(selector, vars) {
    if (!vars)
        return '';
    return `${selector} { ${Object.entries(vars)
        .map(([key, value]) => {
        return `--${key}:${value}; `;
    })
        .join(' ')}}\n`;
}
function recursiveComponentCSS(baseSelector, theme) {
    let str = '';
    const { _modifiers = {}, _element = {}, _vars, ...props } = theme;
    // if there are no props, skip
    if (Object.keys(props).length) {
        // separate psuedo/attribute selectors
        const [selectors, other] = splitObject(props, (key) => key.startsWith(':') || key.startsWith('['));
        Object.entries(selectors).forEach(([selector, value]) => {
            // need to remove nested things like vars and elements
            const { _modifiers = {}, _element = {}, _vars, ...props } = value;
            str += `${baseSelector}${selector} { ${propsToString(props)} }\n`;
            str += addVars(`${baseSelector}${selector}`, _vars);
        });
        str += `${baseSelector} { ${propsToString(other)} }\n`;
    }
    str += addVars(baseSelector, _vars);
    Object.entries(_modifiers).forEach(([key, value]) => {
        if (value && Object.keys(value).length) {
            str += recursiveComponentCSS(`${baseSelector}--${key}`, value);
        }
    });
    Object.entries(_element).forEach(([key, value]) => {
        if (value && Object.keys(value).length) {
            str += recursiveComponentCSS(`${baseSelector}__${key}`, value);
        }
    });
    return str;
}
/**
 * This will take a component theme and create the appropriate CSS for it.
 *
 */
function createComponentCSS({ theme, components, }) {
    let cssText = '';
    const { tokens, name: themeName, breakpoints } = theme;
    components.forEach(({ name, theme, overrides }) => {
        const baseComponentClassName = `amplify-${name}`;
        const componentClassName = `[data-amplify-theme="${themeName}"] .${baseComponentClassName}`;
        // unwrap the component theme
        // if it is a function: call it with the defaultTheme to get a static object
        const componentTheme = isFunction(theme)
            ? theme(tokens)
            : theme;
        cssText += recursiveComponentCSS(componentClassName, componentTheme);
        // if the component theme has overrides
        // generate the appropriate CSS for each of them
        if (overrides) {
            overrides.forEach((override) => {
                // unwrap the override component theme just like above
                const componentTheme = isFunction(override.theme)
                    ? override.theme(tokens)
                    : override.theme;
                if ('mediaQuery' in override) {
                    cssText += `@media (${override.mediaQuery}) {\n ${recursiveComponentCSS(componentClassName, componentTheme)} \n}`;
                }
                if ('breakpoint' in override) {
                    const breakpoint = breakpoints.values[override.breakpoint];
                    cssText += `\n@media (min-width: ${breakpoint}px) {\n ${recursiveComponentCSS(componentClassName, componentTheme)} \n}`;
                }
                if ('selector' in override) {
                    cssText += recursiveComponentCSS(`${override.selector} .${baseComponentClassName}`, componentTheme);
                }
                if ('colorMode' in override) {
                    cssText += `\n@media (prefers-color-scheme: ${override.colorMode}) {\n${recursiveComponentCSS(`[data-amplify-theme="${themeName}"][data-amplify-color-mode="system"] .${baseComponentClassName}`, componentTheme)}\n}\n`;
                    cssText += recursiveComponentCSS(`[data-amplify-theme="${themeName}"][data-amplify-color-mode="${override.colorMode}"] .${baseComponentClassName}`, componentTheme);
                }
            });
        }
    });
    return cssText;
}

/**
 * Takes a set of keys and a color name and returns an object of design tokens,
 * used for applying a primary color at the theme level to our tokens.
 *
 * createColorPalette({keys: ['10','20',...], value: 'red'})
 * returns {
 *   10: { value: '{colors.red.10.value}' },
 *   20: { value: '{colors.red.20.value}' },
 *   ...
 * }
 */
function createColorPalette({ keys, value }) {
    return keys.reduce((acc, key) => {
        return {
            ...acc,
            [key]: { value: `{colors.${value}.${key}.value}` },
        };
    }, {});
}

function createAnimationCSS({ animations, tokens, }) {
    let cssText = '';
    Object.entries(animations).forEach(([key, value]) => {
        cssText += `\n  @keyframes ${key} {`;
        Object.entries(value).forEach(([step, properties]) => {
            cssText += `\n    ${step} {\n`;
            const animationProperties = isFunction(properties)
                ? properties(tokens)
                : properties;
            cssText += propsToString(animationProperties);
            cssText += `\n    }`;
        });
        cssText += `\n  }`;
    });
    return cssText;
}

/**
 * This will be used like `const myTheme = createTheme({})`
 * `myTheme` can then be passed to a Provider or the generated CSS
 * can be passed to a stylesheet at build-time or run-time.
 * const myTheme = createTheme({})
 * const myOtherTheme = createTheme({}, myTheme);
 */
function createTheme(theme, DefaultTheme = defaultTheme) {
    // merge theme and DefaultTheme to get a complete theme
    // deepExtend is an internal Style Dictionary method
    // that performs a deep merge on n objects. We could change
    // this to another 3p deep merge solution too.
    const mergedTheme = deepExtend([
        {},
        DefaultTheme,
        {
            ...theme,
            components: {},
        },
    ]);
    const { primaryColor, secondaryColor } = mergedTheme;
    // apply primaryColor and secondaryColor if present
    if (isString(primaryColor)) {
        mergedTheme.tokens.colors.primary = createColorPalette({
            keys: Object.keys(mergedTheme.tokens.colors[primaryColor]),
            value: primaryColor,
        });
    }
    if (isString(secondaryColor)) {
        mergedTheme.tokens.colors.secondary = createColorPalette({
            keys: Object.keys(mergedTheme.tokens.colors[secondaryColor]),
            value: secondaryColor,
        });
    }
    // Setting up the tokens. This is similar to what Style Dictionary
    // does. At the end of this, each token should have:
    // - CSS variable name of itself
    // - its value (reference to another CSS variable or raw value)
    const tokens = setupTokens({
        tokens: mergedTheme.tokens,
        setupToken,
    }); // Setting the type here because setupTokens is recursive
    const { breakpoints, name } = mergedTheme;
    // flattenProperties is another internal Style Dictionary function
    // that creates an array of all tokens.
    let cssText = `[data-amplify-theme="${name}"] {\n` +
        flattenProperties(tokens)
            .map((token) => `${token.name}: ${token.value};`)
            .join('\n') +
        `\n}\n`;
    if (theme?.components) {
        cssText += createComponentCSS({
            theme: {
                ...mergedTheme,
                tokens,
            },
            components: theme.components,
        });
    }
    let overrides = [];
    if (mergedTheme.animations) {
        cssText += createAnimationCSS({
            animations: mergedTheme.animations,
            tokens,
        });
    }
    /**
     * For each override, we setup the tokens and then generate the CSS.
     * This allows us to have one single CSS string for all possible overrides
     * and avoid re-renders in React, but also support other frameworks as well.
     */
    if (mergedTheme.overrides) {
        overrides = mergedTheme.overrides.map((override) => {
            const overrideTokens = setupTokens({
                tokens: override.tokens,
                setupToken,
            });
            const customProperties = flattenProperties(overrideTokens)
                .map((token) => `${token.name}: ${token.value};`)
                .join('\n');
            // Overrides can have a selector, media query, breakpoint, or color mode
            // for creating the selector
            if ('selector' in override) {
                cssText += `\n${override.selector} {\n${customProperties}\n}\n`;
            }
            if ('mediaQuery' in override) {
                cssText += `\n@media (${override.mediaQuery}) {
  [data-amplify-theme="${name}"] {
    ${customProperties}
  }
}\n`;
            }
            if ('breakpoint' in override) {
                const breakpoint = mergedTheme.breakpoints.values[override.breakpoint];
                cssText += `\n@media (min-width: ${breakpoint}px) {
  [data-amplify-theme="${name}"] {
    ${customProperties}
  }
}\n`;
            }
            if ('colorMode' in override) {
                cssText += `\n@media (prefers-color-scheme: ${override.colorMode}) {
          [data-amplify-theme="${name}"][data-amplify-color-mode="system"] {
            ${customProperties}
            color-scheme: ${override.colorMode};
          }
        }\n`;
                cssText += `\n[data-amplify-theme="${name}"][data-amplify-color-mode="${override.colorMode}"] {
          ${customProperties}
          color-scheme: ${override.colorMode};
        }\n`;
            }
            return {
                ...override,
                tokens: overrideTokens,
            };
        });
    }
    return {
        tokens,
        breakpoints,
        name,
        cssText,
        containerProps: ({ colorMode } = {}) => {
            return {
                'data-amplify-theme': name,
                'data-amplify-color-mode': colorMode,
            };
        },
        // keep overrides separate from base theme
        // this allows web platforms to use plain CSS scoped to a
        // selector and only override the CSS vars needed. This
        // means we could generate CSS at build-time in a postcss
        // plugin, or do it at runtime and inject the CSS into a
        // style tag.
        // This also allows RN to dynamically switch themes in a
        // provider.
        overrides,
    };
}

function createComponentClasses({ name, prefix = 'amplify-' }) {
    const className = (props = {}, extraClassnames = []) => {
        const baseComponentClassName = `${prefix}${name}`;
        // get the element if there is one
        // the _element argument can be a string
        // like { _element: 'icon' }
        // or it could be an object where the key is
        // the element name and the value is the modifiers
        // like { _element: { icon: [size] } }
        const element = isString(props._element)
            ? props._element
            : isObject(props._element)
                ? Object.keys(props._element)[0]
                : undefined;
        const className = element
            ? `${baseComponentClassName}__${element}`
            : baseComponentClassName;
        const names = [className];
        if (element) {
            const modifiers = props._element[element];
            names.push(...modifierClassnames({ className, modifiers }));
        }
        else {
            names.push(...modifierClassnames({
                className,
                modifiers: props._modifiers,
            }));
        }
        return classNames([...names, ...extraClassnames]);
    };
    return className;
}
function modifierClassnames({ className, modifiers, }) {
    if (Array.isArray(modifiers)) {
        return modifiers.map((modifier) => {
            if (!modifier || !isString(modifier)) {
                return;
            }
            return `${className}--${modifier}`;
        });
    }
    if (isObject(modifiers)) {
        return Object.entries(modifiers).map(([key, value]) => {
            if (value) {
                return `${className}--${key}`;
            }
        });
    }
    if (isString(modifiers)) {
        return [`${className}--${modifiers}`];
    }
    return [];
}

/**
 * Use this to create the theme of a component. You can use this
 * to both completely customize built-in components and
 * build your own components!
 *
 * @experimental
 *
 * ```ts
 * // built-in component styling
 * const alertTheme = defineComponentTheme({
 *   name: 'alert',
 *   theme: (tokens) => {
 *     return {
 *       padding: tokens.space.large
 *     }
 *   }
 * });
 *
 * // custom component styling
 * const avatarTheme = defineComponentTheme({
 *   name: 'avatar',
 *   theme: (tokens) => {
 *     return {
 *       padding: tokens.space.large
 *     }
 *   }
 * })
 *
 * const theme = createTheme({
 *   name: 'my-theme',
 *   components: [alertTheme, avatarTheme]
 * })
 * ```
 *
 * @param {Object} params
 * @param {string} params.name  - The name of the component. Use a built-in component name like button to theme buttons.
 * @returns
 */
function defineComponentTheme({ name, theme, overrides, }) {
    const prefix = 'amplify-';
    const className = createComponentClasses({
        name,
        prefix,
    });
    const cssText = (props) => {
        return createComponentCSS({
            theme: props.theme,
            components: [{ name, theme }],
        });
    };
    return {
        className,
        theme,
        overrides,
        name,
        cssText,
    };
}

function createGlobalCSS(css) {
    let cssText = ``;
    for (const [selector, styles] of Object.entries(css)) {
        cssText += recursiveComponentCSS(selector, styles);
    }
    return cssText;
}

const darkModeTokens = {
    colors: {
        red: {
            10: tokens.colors.red[100],
            20: tokens.colors.red[90],
            40: tokens.colors.red[80],
            // 60 doesn't change
            80: tokens.colors.red[40],
            90: tokens.colors.red[20],
            100: tokens.colors.red[10],
        },
        orange: {
            10: tokens.colors.orange[100],
            20: tokens.colors.orange[90],
            40: tokens.colors.orange[80],
            // 60 doesn't change
            80: tokens.colors.orange[40],
            90: tokens.colors.orange[20],
            100: tokens.colors.orange[10],
        },
        yellow: {
            10: tokens.colors.yellow[100],
            20: tokens.colors.yellow[90],
            40: tokens.colors.yellow[80],
            // 60 doesn't change
            80: tokens.colors.yellow[40],
            90: tokens.colors.yellow[20],
            100: tokens.colors.yellow[10],
        },
        green: {
            10: tokens.colors.green[100],
            20: tokens.colors.green[90],
            40: tokens.colors.green[80],
            // 60 doesn't change
            80: tokens.colors.green[40],
            90: tokens.colors.green[20],
            100: tokens.colors.green[10],
        },
        teal: {
            10: tokens.colors.teal[100],
            20: tokens.colors.teal[90],
            40: tokens.colors.teal[80],
            // 60 doesn't change
            80: tokens.colors.teal[40],
            90: tokens.colors.teal[20],
            100: tokens.colors.teal[10],
        },
        blue: {
            10: tokens.colors.blue[100],
            20: tokens.colors.blue[90],
            40: tokens.colors.blue[80],
            // 60 doesn't change
            80: tokens.colors.blue[40],
            90: tokens.colors.blue[20],
            100: tokens.colors.blue[10],
        },
        purple: {
            10: tokens.colors.purple[100],
            20: tokens.colors.purple[90],
            40: tokens.colors.purple[80],
            // 60 doesn't change
            80: tokens.colors.purple[40],
            90: tokens.colors.purple[20],
            100: tokens.colors.purple[10],
        },
        pink: {
            10: tokens.colors.pink[100],
            20: tokens.colors.pink[90],
            40: tokens.colors.pink[80],
            // 60 doesn't change
            80: tokens.colors.pink[40],
            90: tokens.colors.pink[20],
            100: tokens.colors.pink[10],
        },
        neutral: {
            10: tokens.colors.neutral[100],
            20: tokens.colors.neutral[90],
            40: tokens.colors.neutral[80],
            // 60 doesn't change
            80: tokens.colors.neutral[40],
            90: tokens.colors.neutral[20],
            100: tokens.colors.neutral[10],
        },
        font: {
            primary: '{colors.white}',
            secondary: '{colors.neutral.100}',
            tertiary: '{colors.neutral.90}',
            inverse: '{colors.neutral.10}',
        },
        background: {
            primary: '{colors.neutral.10}',
            secondary: '{colors.neutral.20}',
            tertiary: '{colors.neutral.40}',
        },
        border: {
            primary: '{colors.neutral.60}',
            secondary: '{colors.neutral.40}',
            tertiary: '{colors.neutral.20}',
        },
        overlay: {
            5: 'hsla(0, 0%, 100%, 0.05)',
            10: 'hsla(0, 0%, 100%, 0.1)',
            20: 'hsla(0, 0%, 100%, 0.2)',
            30: 'hsla(0, 0%, 100%, 0.3)',
            40: 'hsla(0, 0%, 100%, 0.4)',
            50: 'hsla(0, 0%, 100%, 0.5)',
            60: 'hsla(0, 0%, 100%, 0.6)',
            70: 'hsla(0, 0%, 100%, 0.7)',
            80: 'hsla(0, 0%, 100%, 0.8)',
            90: 'hsla(0, 0%, 100%, 0.9)',
        },
    },
};
/**
 * A basic dark mode that just flips the base color
 * palette.
 */
const defaultDarkModeOverride = {
    colorMode: 'dark',
    tokens: darkModeTokens,
};
const reactNativeDarkTokens = {
    ...darkModeTokens,
};

exports.ALLOWED_SPECIAL_CHARACTERS = ALLOWED_SPECIAL_CHARACTERS;
exports.ComponentClassName = ComponentClassName;
exports.DEFAULT_COUNTRY_CODE = DEFAULT_COUNTRY_CODE;
exports.DefaultTexts = DefaultTexts;
exports.LoginMechanismArray = LoginMechanismArray;
exports.NAVIGABLE_ROUTE_EVENT = NAVIGABLE_ROUTE_EVENT;
exports.applyTranslation = applyTranslation;
exports.areEmptyArrays = areEmptyArrays;
exports.areEmptyObjects = areEmptyObjects;
exports.authFieldsWithDefaults = authFieldsWithDefaults;
exports.authenticatorTextUtil = authenticatorTextUtil;
exports.capitalize = capitalize;
exports.censorAllButFirstAndLast = censorAllButFirstAndLast;
exports.censorContactMethod = censorContactMethod;
exports.censorEmail = censorEmail;
exports.censorPhoneNumber = censorPhoneNumber;
exports.changePassword = changePassword;
exports.classNameModifier = classNameModifier;
exports.classNameModifierByFlag = classNameModifierByFlag;
exports.classNames = classNames;
exports.countryDialCodes = countryDialCodes;
exports.createAuthenticatorMachine = createAuthenticatorMachine;
exports.createComponentCSS = createComponentCSS;
exports.createComponentClasses = createComponentClasses;
exports.createGlobalCSS = createGlobalCSS;
exports.createTheme = createTheme;
exports.cssNameTransform = cssNameTransform;
exports.defaultAuthHubHandler = defaultAuthHubHandler;
exports.defaultDarkModeOverride = defaultDarkModeOverride;
exports.defaultFormFieldOptions = defaultFormFieldOptions;
exports.defaultFormFieldsGetters = defaultFormFieldsGetters;
exports.defaultTheme = defaultTheme;
exports.defineComponentTheme = defineComponentTheme;
exports.deleteUser = deleteUser;
exports.emailRegex = emailRegex;
exports.getActorContext = getActorContext$1;
exports.getActorState = getActorState;
exports.getAliasDefaultFormField = getAliasDefaultFormField;
exports.getCustomFormFields = getCustomFormFields;
exports.getDefaultConfirmPasswordValidators = getDefaultConfirmPasswordValidators;
exports.getDefaultFormFields = getDefaultFormFields;
exports.getDefaultPasswordValidators = getDefaultPasswordValidators;
exports.getErrors = getErrors;
exports.getFormDataFromEvent = getFormDataFromEvent;
exports.getFormFields = getFormFields;
exports.getLogger = getLogger;
exports.getNextServiceContextFacade = getNextServiceContextFacade;
exports.getNextServiceFacade = getNextServiceFacade;
exports.getPrimaryAlias = getPrimaryAlias;
exports.getSendEventAliases = getSendEventAliases;
exports.getServiceContextFacade = getServiceContextFacade;
exports.getServiceFacade = getServiceFacade;
exports.getSortedFormFields = getSortedFormFields;
exports.getTotpCodeURL = getTotpCodeURL;
exports.groupLog = groupLog;
exports.has = has;
exports.hasSpecialChars = hasSpecialChars;
exports.hasTranslation = hasTranslation;
exports.humanFileSize = humanFileSize;
exports.isAuthFieldWithDefaults = isAuthFieldWithDefaults;
exports.isAuthFieldsWithDefaults = isAuthFieldsWithDefaults;
exports.isDesignToken = isDesignToken;
exports.isEmpty = isEmpty;
exports.isEmptyObject = isEmptyObject;
exports.isFunction = isFunction;
exports.isMap = isMap;
exports.isNil = isNil;
exports.isObject = isObject;
exports.isSet = isSet;
exports.isString = isString;
exports.isTypedFunction = isTypedFunction;
exports.isUndefined = isUndefined;
exports.isUnverifiedContactMethodType = isUnverifiedContactMethodType;
exports.isValidEmail = isValidEmail;
exports.listenToAuthHub = listenToAuthHub;
exports.noop = noop;
exports.reactNativeDarkTokens = reactNativeDarkTokens;
exports.reactNativeTokens = reactNativeTokens;
exports.removeOrderKeys = removeOrderKeys;
exports.runFieldValidators = runFieldValidators;
exports.sanitizeNamespaceImport = sanitizeNamespaceImport;
exports.setFormOrder = setFormOrder;
exports.setUserAgent = setUserAgent;
exports.setupTokens = setupTokens;
exports.signUpFieldsWithDefault = signUpFieldsWithDefault;
exports.signUpFieldsWithoutDefault = signUpFieldsWithoutDefault;
exports.sortFormFields = sortFormFields;
exports.splitObject = splitObject;
exports.templateJoin = templateJoin;
exports.translate = translate;
exports.translations = translations;
exports.trimValues = trimValues;