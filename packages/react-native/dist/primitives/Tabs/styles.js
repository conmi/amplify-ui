import { StyleSheet } from 'react-native';
export const getThemedStyles = (theme, indicatorPosition) => {
    const { components, tokens: { colors, fontSizes, fontWeights, opacities, space, borderWidths }, } = theme;
    const selectedTabBorderStyles = {};
    const tabBorderStyles = {};
    if (indicatorPosition && indicatorPosition === 'top') {
        selectedTabBorderStyles.borderTopColor = colors.primary[80];
        tabBorderStyles.borderTopWidth = borderWidths.medium;
        tabBorderStyles.borderTopColor = colors.border.secondary;
    }
    else {
        selectedTabBorderStyles.borderBottomColor = colors.primary[80];
        tabBorderStyles.borderBottomWidth = borderWidths.medium;
        tabBorderStyles.borderBottomColor = colors.border.secondary;
    }
    return StyleSheet.create({
        readonly: {
            opacity: opacities[100],
            ...components?.tabs?.readonly,
        },
        pressed: {
            opacity: opacities[60],
            ...components?.tabs?.pressed,
        },
        tabList: {
            flexDirection: 'row',
            width: '100%',
            ...components?.tabs?.tabList,
        },
        tab: {
            backgroundColor: colors.transparent,
            borderRadius: 0,
            flexBasis: 0,
            flexGrow: 1,
            paddingVertical: space.small,
            paddingHorizontal: space.medium,
            borderWidth: 0,
            ...tabBorderStyles,
            ...components?.tabs?.tab,
        },
        tabText: {
            color: colors.font.secondary,
            fontSize: fontSizes.medium,
            fontWeight: fontWeights.bold,
            ...components?.tabs?.tabText,
        },
        selected: {
            backgroundColor: colors.background.primary,
            color: colors.primary[80],
            ...selectedTabBorderStyles,
            ...components?.tabs?.selected,
        },
    });
};
