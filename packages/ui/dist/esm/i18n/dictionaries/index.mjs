import { deDict as deDict$1 } from './authenticator/de.mjs';
import { enDict as enDict$1 } from './authenticator/en.mjs';
import { esDict as esDict$1 } from './authenticator/es.mjs';
import { frDict as frDict$1 } from './authenticator/fr.mjs';
import { itDict as itDict$1 } from './authenticator/it.mjs';
import { jaDict as jaDict$1 } from './authenticator/ja.mjs';
import { krDict as krDict$1 } from './authenticator/kr.mjs';
import { nbDict as nbDict$1 } from './authenticator/nb.mjs';
import { nlDict as nlDict$1 } from './authenticator/nl.mjs';
import { plDict as plDict$1 } from './authenticator/pl.mjs';
import { ptDict as ptDict$1 } from './authenticator/pt.mjs';
import { zhDict as zhDict$1 } from './authenticator/zh.mjs';
import { svDict as svDict$1 } from './authenticator/sv.mjs';
import { idDict as idDict$1 } from './authenticator/id.mjs';
import { trDict as trDict$1 } from './authenticator/tr.mjs';
import { ruDict as ruDict$1 } from './authenticator/ru.mjs';
import { heDict as heDict$1 } from './authenticator/he.mjs';
import { uaDict as uaDict$1 } from './authenticator/ua.mjs';
import { thDict as thDict$1 } from './authenticator/th.mjs';
import { defaultTexts as defaultTexts$1 } from './authenticator/defaultTexts.mjs';

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

export { deDict, defaultTexts, enDict, esDict, frDict, heDict, idDict, itDict, jaDict, krDict, nbDict, nlDict, plDict, ptDict, ruDict, svDict, thDict, trDict, uaDict, zhDict };
