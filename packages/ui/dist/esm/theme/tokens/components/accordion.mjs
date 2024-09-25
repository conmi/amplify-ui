const accordion = {
    backgroundColor: { value: '{colors.background.primary.value}' },
    item: {
        borderColor: { value: '{colors.border.secondary.value}' },
        borderWidth: { value: '{borderWidths.small.value}' },
        borderStyle: { value: 'solid' },
        borderRadius: { value: '{radii.small.value}' },
        trigger: {
            alignItems: { value: 'center' },
            backgroundColor: { value: '{colors.background.primary.value}' },
            color: { value: 'inherit' },
            gap: { value: '{space.small.value}' },
            justifyContent: { value: 'space-between' },
            paddingBlock: { value: '{space.xs.value}' },
            paddingInline: { value: '{space.small.value}' },
            _hover: {
                color: { value: 'inherit' },
                backgroundColor: { value: '{colors.overlay.5.value}' },
            },
            _focus: {
                borderColor: { value: '{colors.border.focus.value}' },
                boxShadow: {
                    value: {
                        offsetX: '0',
                        offsetY: '0',
                        blurRadius: '0',
                        spreadRadius: '2px',
                        color: '{colors.border.focus.value}',
                    },
                },
            },
        },
        content: {
            color: { value: 'inherit' },
            paddingInline: { value: '{space.small.value}' },
            paddingBlockEnd: { value: '{space.small.value}' },
            paddingBlockStart: { value: '{space.xxxs.value}' },
        },
        icon: {
            color: { value: '{colors.font.tertiary.value}' },
            transitionDuration: { value: '{time.medium.value}' },
            transitionTimingFunction: { value: 'cubic-bezier(0.87, 0, 0.13, 1)' },
        },
    },
};

export { accordion };
