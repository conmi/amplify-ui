const tabs = {
    backgroundColor: { value: 'transparent' },
    borderColor: { value: '{colors.border.secondary.value}' },
    borderStyle: { value: 'solid' },
    borderWidth: { value: '{borderWidths.medium.value}' },
    gap: { value: '0' },
    item: {
        backgroundColor: { value: 'transparent' },
        borderColor: { value: '{colors.border.secondary.value}' },
        borderStyle: { value: 'solid' },
        borderWidth: { value: '{borderWidths.medium.value}' },
        color: { value: '{colors.font.secondary.value}' },
        fontSize: { value: '{fontSizes.medium.value}' },
        fontWeight: { value: '{fontWeights.bold.value}' },
        paddingVertical: { value: '{space.small.value}' },
        paddingHorizontal: { value: '{space.medium.value}' },
        textAlign: { value: 'center' },
        transitionDuration: { value: '{time.medium.value}' },
        _hover: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: { value: 'none' },
            color: { value: '{colors.font.hover.value}' },
        },
        _focus: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: {
                value: {
                    offsetX: '0px',
                    offsetY: '0px',
                    blurRadius: '0px',
                    spreadRadius: '{borderWidths.medium}',
                    color: '{colors.border.focus.value}',
                },
            },
            color: { value: '{colors.font.focus.value}' },
        },
        _active: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.font.interactive.value}' },
            boxShadow: { value: 'none' },
            color: { value: '{colors.font.interactive.value}' },
        },
        _disabled: {
            backgroundColor: { value: 'transparent' },
            borderColor: { value: '{colors.border.tertiary.value}' },
            boxShadow: { value: 'none' },
            color: { value: '{colors.font.disabled.value}' },
        },
    },
    panel: {
        backgroundColor: { value: 'transparent' },
        paddingInline: { value: '0' },
        paddingBlock: { value: '{space.small.value}' },
    },
};

export { tabs };
