const sliderfield = {
    paddingBlock: { value: '{space.xs.value}' },
    // The track is the thin background of the slider
    track: {
        backgroundColor: { value: '{colors.background.quaternary.value}' },
        borderRadius: { value: '9999px' },
        height: { value: '0.375rem' },
        minWidth: { value: '10rem' },
    },
    // The range is the filled part of the track
    range: {
        backgroundColor: { value: '{colors.primary.80.value}' },
        borderRadius: { value: '9999px' },
        _disabled: {
            backgroundColor: { value: '{colors.background.disabled.value}' },
        },
    },
    // The thumb is the circle above the track that the user drags
    thumb: {
        width: { value: '1.25rem' },
        height: { value: '1.25rem' },
        backgroundColor: { value: '{colors.background.primary.value}' },
        boxShadow: { value: '{shadows.small.value}' },
        borderRadius: { value: '50%' },
        borderWidth: { value: '{borderWidths.medium.value}' },
        borderColor: { value: '{colors.border.primary.value}' },
        borderStyle: { value: 'solid' },
        _disabled: {
            backgroundColor: { value: '{colors.background.disabled.value}' },
            borderColor: { value: 'transparent' },
            boxShadow: { value: 'none' },
        },
        _hover: {
            backgroundColor: { value: '{colors.background.primary.value}' },
            borderColor: { value: '{colors.border.focus.value}' },
        },
        _focus: {
            borderColor: { value: '{colors.border.focus.value}' },
            boxShadow: { value: '{components.fieldcontrol._focus.boxShadow.value}' },
        },
    },
    small: {
        track: {
            height: { value: '0.25rem' },
        },
        thumb: {
            width: { value: '1rem' },
            height: { value: '1rem' },
        },
    },
    large: {
        track: {
            height: { value: '0.625rem' },
        },
        thumb: {
            width: { value: '1.5rem' },
            height: { value: '1.5rem' },
        },
    },
};

export { sliderfield };
