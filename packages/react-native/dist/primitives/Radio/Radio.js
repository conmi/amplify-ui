import React, { useCallback, useMemo } from 'react';
import { Pressable, View, } from 'react-native';
import { useTheme } from '../../theme';
import { Label } from '../Label';
import { getFlexDirectionFromLabelPosition } from '../Label/utils';
import { usePressableContainerStyles } from '../../hooks';
import { getThemedStyles } from './styles';
import { getRadioDimensions } from './getRadioDimensions';
export const CONTAINER_TEST_ID = 'amplify__radio-button__container';
export const DOT_TEST_ID = 'amplify__radio-button__dot';
export default function Radio({ accessibilityRole = 'radio', disabled, label, labelPosition = 'end', labelStyle, onChange, onPress, radioContainerStyle, radioDotStyle, selected, size = 'medium', style, value, ...rest }) {
    const theme = useTheme();
    const themedStyle = getThemedStyles(theme);
    const handleOnChange = useCallback((event) => {
        if (!disabled) {
            onChange?.(value);
            onPress?.(event);
        }
    }, [disabled, onChange, onPress, value]);
    const containerStyle = useMemo(() => ({
        ...themedStyle.container,
        flexDirection: getFlexDirectionFromLabelPosition(labelPosition),
        ...(disabled && themedStyle.disabled),
    }), [disabled, labelPosition, themedStyle]);
    const pressableStyle = usePressableContainerStyles({
        overrideStyle: style,
        containerStyle,
        pressedStyle: themedStyle.pressed,
    });
    const { radioContainerDimensions, radioDotDimensions } = useMemo(() => getRadioDimensions(size, themedStyle), [size, themedStyle]);
    return (<Pressable {...rest} accessibilityRole={accessibilityRole} onPress={handleOnChange} style={pressableStyle}>
      <View style={[
            themedStyle.radioContainer,
            radioContainerDimensions,
            radioContainerStyle,
        ]} testID={CONTAINER_TEST_ID}>
        {selected ? (<View style={[themedStyle.radioDot, radioDotDimensions, radioDotStyle]} testID={DOT_TEST_ID}/>) : null}
      </View>
      {label ? <Label style={labelStyle}>{label}</Label> : null}
    </Pressable>);
}
