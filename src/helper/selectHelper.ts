/**
 * Returns the colors for the global country selector.
 */
export const getSelectCountryOptionColor = (priority: number): string => {
    switch (priority) {
        case 2:
            return '#000080';
        case 1:
            return '#008000';
        case 0:
            return '#202020';
        default:
            return '#000000';
    }
};
