/**
 * Formats the given number to German format.
 */
export const unitNumberToGerman = (value: number, precision: number = 2): string => {
    return value.toFixed(precision).replace('.', ',');
}

/**
 * Formats the given unit value to German format.
 */
export const unitEnergyFormatter = (
    energy: number,
    withEnergyUnit: boolean = true,
    energyUnit: string = 'kW'
): string => {
    let priceEnergyFormatted = unitNumberToGerman(energy, 2);

    if (withEnergyUnit) {
        priceEnergyFormatted += ` ${energyUnit}`;
    }

    return  priceEnergyFormatted;
};

/**
 * Formats the given unit value to German format.
 */
export const unitEnergyFormatterWithPrice = (
    energy: number,
    withEnergyUnit: boolean = true,
    energyUnit: string = 'kW'
): string => {
    let priceEnergyFormatted = unitNumberToGerman(energy, 2);

    if (withEnergyUnit) {
        priceEnergyFormatted += ` ${energyUnit}`;
    }

    return  priceEnergyFormatted;
};
