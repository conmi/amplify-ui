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

export { fieldset };