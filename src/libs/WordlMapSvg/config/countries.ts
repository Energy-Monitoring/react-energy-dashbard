export type TypeCountry = {
    code: string;
    name: string;
};

export const countries: TypeCountry[] = [
    { code: "eu",  name: "Europäische Union" },
    { code: "all", name: "Europa" },

    { code: "de",  name: "Deutschland" },
    { code: "at",  name: "Österreich" },
    { code: "ch",  name: "Schweiz" },

    { code: "al",  name: "Albanien" },
    { code: "am",  name: "Armenien" },
    { code: "az",  name: "Aserbaidschan" },
    { code: "be",  name: "Belgien" },
    { code: "ba",  name: "Bosnien-Herzegowina" },
    { code: "bg",  name: "Bulgarien" },
    { code: "dk",  name: "Dänemark" },
    { code: "ee",  name: "Estland" },
    { code: "fi",  name: "Finnland" },
    { code: "fr",  name: "Frankreich" },
    { code: "ge",  name: "Georgien" },
    { code: "gr",  name: "Griechenland" },
    { code: "ie",  name: "Irland" },
    { code: "is",  name: "Island" },
    { code: "it",  name: "Italien" },
    { code: "xk",  name: "Kosovo" },
    { code: "hr",  name: "Kroatien" },
    { code: "lv",  name: "Lettland" },
    { code: "li",  name: "Lichtenstein" },
    { code: "lt",  name: "Litauen" },
    { code: "lu",  name: "Luxemburg" },
    { code: "mt",  name: "Malta" },
    { code: "md",  name: "Moldawien" },
    { code: "me",  name: "Montenegro" },
    { code: "nl",  name: "Niederlande" },
    { code: "nie", name: "Nordirland" },
    { code: "mk",  name: "Nordmazedonien" },
    { code: "no",  name: "Norwegen" },
    { code: "pl",  name: "Polen" },
    { code: "pt",  name: "Portugal" },
    { code: "ro",  name: "Rumänien" },
    { code: "ru",  name: "Russland" },
    { code: "se",  name: "Schweden" },
    { code: "rs",  name: "Serbien" },
    { code: "sk",  name: "Slowakische Republik" },
    { code: "sl",  name: "Slowenien" },
    { code: "es",  name: "Spanien" },
    { code: "cz",  name: "Tschechische Republik" },
    { code: "tr",  name: "Türkei" },
    { code: "ua",  name: "Ukraine" },
    { code: "hu",  name: "Ungarn" },
    { code: "gb",  name: "Vereinigtes Königreich" },
    { code: "by",  name: "Weißrussland" },
    { code: "cy",  name: "Zypern" },
];

export const countryMap: {[key: string]: TypeCountry} = countries.reduce((map, country) => {
    map[country.code] = country;
    return map;
}, {} as { [key: string]: TypeCountry });
