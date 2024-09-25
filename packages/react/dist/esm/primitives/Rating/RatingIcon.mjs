import * as React from 'react';
import { ComponentClassName, classNames } from '@aws-amplify/ui';
import { View } from '../View/View.mjs';

const RatingIcon = ({ icon, fill, className, }) => {
    return (React.createElement(View, { as: "span", className: ComponentClassName.RatingItem, "aria-hidden": "true" },
        React.createElement(View, { as: "span", className: classNames(ComponentClassName.RatingIcon, className), color: fill }, icon)));
};
RatingIcon.displayName = 'RatingIcon';

export { RatingIcon };
