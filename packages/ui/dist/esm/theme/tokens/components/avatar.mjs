const avatar = {
    // Default styles
    color: { value: '{colors.font.tertiary.value}' },
    lineHeight: { value: 1 },
    fontWeight: { value: '{fontWeights.semibold.value}' },
    fontSize: { value: '{fontSizes.small.value}' },
    textAlign: { value: 'center' },
    width: { value: '{fontSizes.xxl.value}' },
    height: { value: '{fontSizes.xxl.value}' },
    backgroundColor: { value: '{colors.background.tertiary}' },
    borderRadius: { value: '100%' },
    borderColor: { value: '{colors.border.primary.value}' },
    borderWidth: { value: '{borderWidths.medium.value}' },
    // Color Theme Variations
    info: {
        color: { value: '{colors.font.info.value}' },
        backgroundColor: { value: '{colors.background.info.value}' },
        borderColor: { value: '{colors.border.info.value}' },
    },
    warning: {
        color: { value: '{colors.font.warning.value}' },
        backgroundColor: { value: '{colors.background.warning.value}' },
        borderColor: { value: '{colors.border.warning.value}' },
    },
    success: {
        color: { value: '{colors.font.success.value}' },
        backgroundColor: { value: '{colors.background.success.value}' },
        borderColor: { value: '{colors.border.success.value}' },
    },
    error: {
        color: { value: '{colors.font.error.value}' },
        backgroundColor: { value: '{colors.background.error.value}' },
        borderColor: { value: '{colors.border.error.value}' },
    },
    // Sizes
    small: {
        fontSize: { value: '{fontSizes.xs.value}' },
        width: { value: '{fontSizes.xl.value}' },
        height: { value: '{fontSizes.xl.value}' },
    },
    // medium is the default size
    large: {
        fontSize: { value: '{fontSizes.medium.value}' },
        width: { value: '{fontSizes.xxxl.value}' },
        height: { value: '{fontSizes.xxxl.value}' },
    },
};

export { avatar };