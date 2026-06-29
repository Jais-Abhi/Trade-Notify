export const deepMerge = (source = {}, override = {}) => {
    if (typeof source !== 'object' || source === null || Array.isArray(source)) {
        return override;
    }
    if (typeof override !== 'object' || override === null || Array.isArray(override)) {
        return override;
    }

    const result = { ...source };

    Object.keys(override).forEach((key) => {
        const sourceValue = source[key];
        const overrideValue = override[key];

        if (
            sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            overrideValue &&
            typeof overrideValue === 'object' &&
            !Array.isArray(overrideValue)
        ) {
            result[key] = deepMerge(sourceValue, overrideValue);
        } else {
            result[key] = overrideValue;
        }
    });

    return result;
};
