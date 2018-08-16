export const createErrorMessage = (prefix, keyValue, message) => {
    const key = prefix && prefix !== '' ? `${prefix}.${keyValue}` : keyValue;
    return {
        key,
        message
    };
};
