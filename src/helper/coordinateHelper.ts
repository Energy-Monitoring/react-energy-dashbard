import {positions} from "../data/countries";

/**
 * Returns the coordinate from the given country code.
 */
export const getCoordinateCountry = (selectedCountry: string): {latitude: number, longitude: number, name: string, distance: number} => {
    /* Return the selected country if available. */
    if (positions.hasOwnProperty(selectedCountry)) {
        return positions[selectedCountry];
    }

    /* Default country. */
    return positions['de'];
}
