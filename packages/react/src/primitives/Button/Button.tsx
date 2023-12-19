import * as React from 'react';
import { classNames } from '@aws-amplify/ui';

import { ComponentClassName } from '@aws-amplify/ui';

import { classNameModifier, classNameModifierByFlag } from '../shared/utils';
import {
  BaseButtonProps,
  ButtonProps,
  ForwardRefPrimitive,
  Primitive,
} from '../types';

import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef';

import { useFieldset } from '../Fieldset/useFieldset';
import { Flex } from '../Flex';
import { Loader } from '../Loader';
import { View } from '../View';
import { Badge } from '../Badge';

// These variations support colorThemes. 'undefined' accounts for our
// 'default' variation which is not named.
const supportedVariations = ['link', 'primary', undefined];

const ButtonPrimitive: Primitive<ButtonProps, 'button'> = (
  {
    className,
    children,
    colorTheme,
    isFullWidth = false,
    isDisabled,
    isLoading,
    loadingText = '',
    size,
    type = 'button',
    variation,
    // Badge props
    hasBadge = false,
    badgeContent = '',
    badgePosition = 'top-right',
    badgeVariation,
    ...rest
  },
  ref
) => {
  // Creates our colorTheme modifier string based on if the variation
  // supports colorThemes and a colorTheme is used.
  const colorThemeModifier =
    supportedVariations.includes(variation) && colorTheme
      ? `${variation ?? 'outlined'}--${colorTheme}`
      : undefined;

  const { isFieldsetDisabled } = useFieldset();
  const shouldBeDisabled = isFieldsetDisabled
    ? isFieldsetDisabled
    : isDisabled ?? isLoading ?? rest['disabled'];

  const componentClasses = classNames(
    ComponentClassName.Button,
    ComponentClassName.FieldGroupControl,
    classNameModifier(ComponentClassName.Button, variation),
    classNameModifier(ComponentClassName.Button, colorThemeModifier),
    classNameModifier(ComponentClassName.Button, size),
    classNameModifierByFlag(
      ComponentClassName.Button,
      'disabled',
      shouldBeDisabled
    ),
    classNameModifierByFlag(ComponentClassName.Button, 'loading', isLoading),
    classNameModifierByFlag(
      ComponentClassName.Button,
      'fullwidth',
      isFullWidth
    ),
    className
  );

  const badgeClasses = classNames(
    ComponentClassName.ButtonBadge,
    classNameModifier(ComponentClassName.ButtonBadge, badgePosition),
    // Add padding to the badge if the button is not a link
    classNameModifier(
      ComponentClassName.ButtonBadge,
      variation === 'link' ? badgePosition : `${badgePosition}--padding`
    )
  );

  return (
    <View
      ref={ref}
      as="button"
      className={componentClasses}
      isDisabled={shouldBeDisabled}
      type={type}
      {...rest}
    >
      {hasBadge ? (
        <Badge className={badgeClasses} variation={badgeVariation}>
          {badgeContent}
        </Badge>
      ) : null}

      {isLoading ? (
        <Flex as="span" className={ComponentClassName.ButtonLoaderWrapper}>
          <Loader size={size} />
          {loadingText ? loadingText : null}
        </Flex>
      ) : (
        children
      )}
    </View>
  );
};

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/button)
 */
export const Button: ForwardRefPrimitive<BaseButtonProps, 'button'> =
  primitiveWithForwardRef(ButtonPrimitive);

Button.displayName = 'Button';
