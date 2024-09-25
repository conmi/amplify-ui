import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { usePressableContainerStyles } from '../../hooks';
import { getThemedStyles } from './styles';
import { Icon, iconSizes } from '../Icon';
export default function IconButton({ accessibilityRole = 'button', color, disabled, iconStyle, size = iconSizes.medium, source, style, ...rest }) {
    const theme = useTheme();
    const themedStyle = getThemedStyles(theme);
    const containerStyle = useMemo(() => ({
        ...themedStyle.container,
        ...(disabled && themedStyle.disabled),
    }), [disabled, themedStyle]);
    const pressableStyle = usePressableContainerStyles({
        overrideStyle: style,
        containerStyle,
        pressedStyle: themedStyle.pressed,
    });
    return (<Pressable {...rest} accessibilityRole={accessibilityRole} disabled={disabled} style={pressableStyle}>
      <Icon color={color} size={size} source={source} style={iconStyle}/>
    </Pressable>);
}
