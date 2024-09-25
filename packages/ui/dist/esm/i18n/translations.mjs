import { I18n } from 'aws-amplify/utils';
import { defaultTexts, deDict, enDict, esDict, frDict, idDict, itDict, jaDict, krDict, nbDict, nlDict, plDict, ptDict, zhDict, svDict, trDict, ruDict, heDict, uaDict, thDict } from './dictionaries/index.mjs';

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
    return I18n.get(phrase);
}
/**
 * Whether I18n has a translation entry for given phrase
 */
function hasTranslation(phrase) {
    return I18n.get(phrase) !== phrase;
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

export { DefaultTexts, hasTranslation, translate, translations };
