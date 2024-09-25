import { sanitizeNamespaceImport, isFunction, classNames, ComponentClassName, classNameModifier, classNameModifierByFlag } from '@aws-amplify/ui';
import * as RadixSlider from '@radix-ui/react-slider';
import * as React from 'react';
import '../Field/FieldClearButton.mjs';
import { FieldDescription } from '../Field/FieldDescription.mjs';
import { FieldErrorMessage } from '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { FieldGroup } from '../FieldGroup/FieldGroup.mjs';
import { Flex } from '../Flex/Flex.mjs';
import { Label } from '../Label/Label.mjs';
import { splitPrimitiveProps } from '../utils/splitPrimitiveProps.mjs';
import { View } from '../View/View.mjs';
import { useStableId } from '../utils/useStableId.mjs';
import { useFieldset } from '../Fieldset/useFieldset.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { createSpaceSeparatedIds } from '../utils/createSpaceSeparatedIds.mjs';
import { DESCRIPTION_SUFFIX, ERROR_SUFFIX } from '../../helpers/constants.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';

// Radix packages don't support ESM in Node, in some scenarios(e.g. SSR)
// We have to use namespace import and sanitize it to ensure the interoperablity between ESM and CJS
const { Range, Root, Thumb, Track } = sanitizeNamespaceImport(RadixSlider);
const SLIDER_LABEL_TEST_ID = 'slider-label';
const SLIDER_ROOT_TEST_ID = 'slider-root';
const SLIDER_TRACK_TEST_ID = 'slider-track';
const SLIDER_RANGE_TEST_ID = 'slider-range';
const SliderFieldPrimitive = ({ ariaValuetext, className, defaultValue = 0, descriptiveText, emptyTrackColor, errorMessage, filledTrackColor, formatValue, hasError = false, id, isDisabled, isValueHidden = false, label, labelHidden = false, onChange, orientation = 'horizontal', outerEndComponent, outerStartComponent, testId, thumbColor, trackSize, value, size, ..._rest }, ref) => {
    const { isFieldsetDisabled } = useFieldset();
    const fieldId = useStableId(id);
    const stableId = useStableId();
    const descriptionId = descriptiveText
        ? getUniqueComponentId(stableId, DESCRIPTION_SUFFIX)
        : undefined;
    const errorId = hasError
        ? getUniqueComponentId(stableId, ERROR_SUFFIX)
        : undefined;
    const ariaDescribedBy = createSpaceSeparatedIds([errorId, descriptionId]);
    const disabled = isFieldsetDisabled ? isFieldsetDisabled : isDisabled;
    const { styleProps, rest } = splitPrimitiveProps(_rest);
    const isControlled = value !== undefined;
    const [currentValue, setCurrentValue] = React.useState(isControlled ? value : defaultValue);
    const values = isControlled ? [value] : undefined;
    const defaultValues = !isControlled ? [defaultValue] : undefined;
    const onValueChange = React.useCallback((value) => {
        setCurrentValue(value[0]);
        if (isFunction(onChange)) {
            // Do not have multiple thumbs support yet
            onChange(value[0]);
        }
    }, [onChange]);
    const renderedValue = React.useMemo(() => {
        const formattedValue = isFunction(formatValue)
            ? formatValue(currentValue)
            : currentValue;
        return typeof formatValue === 'string' ? (React.createElement(View, { as: "span" }, formattedValue)) : (formattedValue);
    }, [currentValue, formatValue]);
    const isVertical = orientation === 'vertical';
    const componentClasses = classNames(ComponentClassName.SliderFieldTrack, classNameModifier(ComponentClassName.SliderFieldTrack, orientation), classNameModifier(ComponentClassName.SliderFieldTrack, size));
    const rootComponentClasses = classNames(ComponentClassName.SliderFieldRoot, classNameModifier(ComponentClassName.SliderFieldRoot, orientation), classNameModifier(ComponentClassName.SliderFieldRoot, size), classNameModifierByFlag(ComponentClassName.SliderFieldRoot, 'disabled', disabled), className);
    return (React.createElement(Flex
    // Custom classnames will be added to Root below
    , { 
        // Custom classnames will be added to Root below
        className: classNames(ComponentClassName.Field, classNameModifier(ComponentClassName.Field, size), ComponentClassName.SliderField), testId: testId, ...styleProps },
        React.createElement(Label, { className: ComponentClassName.SliderFieldLabel, id: stableId, testId: SLIDER_LABEL_TEST_ID, visuallyHidden: labelHidden },
            React.createElement(View, { as: "span" }, label),
            !isValueHidden ? renderedValue : null),
        React.createElement(FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React.createElement(FieldGroup, { className: ComponentClassName.SliderFieldGroup, id: fieldId, orientation: orientation, outerStartComponent: outerStartComponent, outerEndComponent: outerEndComponent },
            React.createElement(Root, { className: rootComponentClasses, "data-testid": SLIDER_ROOT_TEST_ID, disabled: disabled, defaultValue: defaultValues, onValueChange: onValueChange, orientation: orientation, ref: ref, value: values, ...rest },
                React.createElement(Track, { className: componentClasses, "data-testid": SLIDER_TRACK_TEST_ID, style: {
                        backgroundColor: String(emptyTrackColor),
                        [`${isVertical ? 'width' : 'height'}`]: trackSize,
                    } },
                    React.createElement(Range, { className: classNames(ComponentClassName.SliderFieldRange, classNameModifier(ComponentClassName.SliderFieldRange, orientation), classNameModifierByFlag(ComponentClassName.SliderFieldRange, 'disabled', disabled)), "data-testid": SLIDER_RANGE_TEST_ID, style: { backgroundColor: String(filledTrackColor) } })),
                React.createElement(Thumb, { "aria-describedby": ariaDescribedBy, "aria-labelledby": stableId, "aria-valuetext": ariaValuetext, className: classNames(ComponentClassName.SliderFieldThumb, classNameModifier(ComponentClassName.SliderFieldThumb, size), classNameModifierByFlag(ComponentClassName.SliderFieldThumb, 'disabled', disabled)), style: { backgroundColor: String(thumbColor) } }))),
        React.createElement(FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/sliderfield)
 */
const SliderField = primitiveWithForwardRef(SliderFieldPrimitive);
SliderField.displayName = 'SliderField';

export { SLIDER_LABEL_TEST_ID, SLIDER_RANGE_TEST_ID, SLIDER_ROOT_TEST_ID, SLIDER_TRACK_TEST_ID, SliderField };
