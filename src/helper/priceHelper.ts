/**
 * Formats the given price to German format.
 */
export const priceToGerman = (value: number, precision: number = 2): string => {
    return value.toFixed(precision).replace('.', ',');
}

/**
 * Formats the given price energy quantity to German format.
 */
export const priceEnergyFormatter = (
    priceEnergy: number,
    withPricePerEnergy: boolean = true,
    priceUnit: string = 'Cent',
    energyUnit: string = 'kWh'
): string => {
    let priceEnergyFormatted = priceToGerman(priceEnergy, 2);

    if (withPricePerEnergy) {
        priceEnergyFormatted += ` ${priceUnit}/${energyUnit}`;
    }

    return  priceEnergyFormatted;
};
