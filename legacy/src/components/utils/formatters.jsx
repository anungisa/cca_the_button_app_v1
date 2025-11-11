/**
 * Safely formats an enum-style string (e.g., 'hello_world') into a title-case string ('Hello World').
 * Handles null, undefined, or non-string inputs gracefully.
 * @param {string | null | undefined} str The string to format.
 * @param {string} [fallback='N/A'] The fallback string to return if the input is invalid.
 * @returns {string} The formatted string, or the fallback value.
 */
export const formatEnumString = (str, fallback = 'N/A') => {
    if (!str || typeof str !== 'string') {
        return fallback;
    }
    return str
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};