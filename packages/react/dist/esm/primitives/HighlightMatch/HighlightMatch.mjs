import { classNames, ComponentClassName } from '@aws-amplify/ui';
import * as React from 'react';
import { View } from '../View/View.mjs';
import { strHasLength } from '../shared/utils.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

const HighlightMatchPrimitive = ({ children, className, query, testId, ...rest }, ref) => {
    const matchTestId = getUniqueComponentId(testId, 'match');
    const startIndex = children
        ?.toLocaleLowerCase()
        .indexOf(query?.toLocaleLowerCase());
    if (strHasLength(query) && startIndex !== -1) {
        const match = children.substring(startIndex, startIndex + query.length);
        return (React.createElement(View, { as: "span", className: classNames(className, ComponentClassName.HighlightMatch), testId: testId, ref: ref, ...rest },
            children.substring(0, startIndex),
            React.createElement(View, { as: "strong", className: ComponentClassName.HighlightMatchHighlighted, testId: matchTestId }, match),
            children.substring(startIndex + query.length)));
    }
    return (React.createElement(View, { as: "span", testId: testId }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/highlightmatch)
 */
const HighlightMatch = primitiveWithForwardRef(HighlightMatchPrimitive);
HighlightMatch.displayName = 'HighlightMatch';

export { HighlightMatch, HighlightMatchPrimitive };