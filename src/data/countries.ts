type TypeCountrySelection = {
    enabled: boolean;
    code: string;
    name: string;
    priority: number;
};

type TypeCountryPositions = {
    latitude: number;
    longitude: number;
    name: string;
    distance: number;
};

type TypeCountryDayAheadPrice = {
    code: string;
    name: string;
};

export const countrySelections: TypeCountrySelection[] = [
    { enabled: true,  priority: 2, code: "eu",  name: "Europäische Union" },
    { enabled: true,  priority: 2, code: "all", name: "Europa" },

    { enabled: true,  priority: 1, code: "de",  name: "Deutschland" },
    { enabled: true,  priority: 1, code: "at",  name: "Österreich" },
    { enabled: true,  priority: 1, code: "ch",  name: "Schweiz" },

    { enabled: false, priority: 0, code: "al",  name: "Albanien" },
    { enabled: false, priority: 0, code: "am",  name: "Armenien" },
    { enabled: false, priority: 0, code: "az",  name: "Aserbaidschan" },
    { enabled: true,  priority: 0, code: "be",  name: "Belgien" },
    { enabled: false, priority: 0, code: "ba",  name: "Bosnien-Herzegowina" },
    { enabled: true,  priority: 0, code: "bg",  name: "Bulgarien" },
    { enabled: true,  priority: 0, code: "dk",  name: "Dänemark" },
    { enabled: true,  priority: 0, code: "ee",  name: "Estland" },
    { enabled: true,  priority: 0, code: "fi",  name: "Finnland" },
    { enabled: true,  priority: 0, code: "fr",  name: "Frankreich" },
    { enabled: true,  priority: 0, code: "ge",  name: "Georgien" },
    { enabled: true,  priority: 0, code: "gr",  name: "Griechenland" },
    { enabled: true,  priority: 0, code: "ie",  name: "Irland" },
    { enabled: false, priority: 0, code: "is",  name: "Island" },
    { enabled: false, priority: 0, code: "it",  name: "Italien" },
    { enabled: true,  priority: 0, code: "xk",  name: "Kosovo" },
    { enabled: true,  priority: 0, code: "hr",  name: "Kroatien" },
    { enabled: true,  priority: 0, code: "lv",  name: "Lettland" },
    { enabled: false, priority: 0, code: "li",  name: "Lichtenstein" },
    { enabled: true,  priority: 0, code: "lt",  name: "Litauen" },
    { enabled: true,  priority: 0, code: "lu",  name: "Luxemburg" },
    { enabled: false, priority: 0, code: "mt",  name: "Malta" },
    { enabled: false, priority: 0, code: "md",  name: "Moldawien" },
    { enabled: true,  priority: 0, code: "me",  name: "Montenegro" },
    { enabled: true,  priority: 0, code: "nl",  name: "Niederlande" },
    { enabled: false, priority: 0, code: "nie", name: "Nordirland" },
    { enabled: true,  priority: 0, code: "mk",  name: "Nordmazedonien" },
    { enabled: true,  priority: 0, code: "no",  name: "Norwegen" },
    { enabled: true,  priority: 0, code: "pl",  name: "Polen" },
    { enabled: true,  priority: 0, code: "pt",  name: "Portugal" },
    { enabled: true,  priority: 0, code: "ro",  name: "Rumänien" },
    { enabled: false, priority: 0, code: "ru",  name: "Russland" },
    { enabled: true,  priority: 0, code: "se",  name: "Schweden" },
    { enabled: true,  priority: 0, code: "rs",  name: "Serbien" },
    { enabled: true,  priority: 0, code: "sk",  name: "Slowakische Republik" },
    { enabled: false, priority: 0, code: "sl",  name: "Slowenien" },
    { enabled: true,  priority: 0, code: "es",  name: "Spanien" },
    { enabled: true,  priority: 0, code: "cz",  name: "Tschechische Republik" },
    { enabled: false, priority: 0, code: "tr",  name: "Türkei" },
    { enabled: false, priority: 0, code: "ua",  name: "Ukraine" },
    { enabled: true,  priority: 0, code: "hu",  name: "Ungarn" },
    { enabled: false, priority: 0, code: "gb",  name: "Vereinigtes Königreich" },
    { enabled: false, priority: 0, code: "by",  name: "Weißrussland" },
    { enabled: false, priority: 0, code: "cy",  name: "Zypern" },
];

export const positions: {[key: string]: TypeCountryPositions} = {
    de:  { latitude: 51.1333, longitude: 10.4167, distance: 15, name: "Deutschland"     },
    ch:  { latitude: 46.8000, longitude:  8.2,    distance: 60, name: "Schweiz"         },
    eu:  { latitude: 54.8985, longitude: 25.3015, distance: 60, name: "Europa"          },
    all: { latitude: 47.2000, longitude: 13.2,    distance: 60, name: "Europa"          },
    at:  { latitude: 47.2000, longitude: 13.2,    distance: 15, name: "Österreich"      },
    be:  { latitude: 50.6403, longitude:  4.6667, distance: 60, name: "Belgien"         },
    bg:  { latitude: 42.7833, longitude: 25.2333, distance: 60, name: "Bulgarien"       },
    cz:  { latitude: 49.7395, longitude: 15.3381, distance: 60, name: "Tschechien"      },
    dk:  { latitude: 55.4840, longitude: 11.5780, distance: 60, name: "Dänemark"        },
    ee:  { latitude: 58.5953, longitude: 25.0136, distance: 60, name: "Estland"         },
    es:  { latitude: 40.4637, longitude: -3.7492, distance: 15, name: "Spanien"         },
    fi:  { latitude: 61.9241, longitude: 25.7482, distance: 60, name: "Finnland"        },
    fr:  { latitude: 46.6034, longitude:  1.8883, distance: 60, name: "Frankreich"      },
    ge:  { latitude: 42.3154, longitude: 43.3569, distance: 60, name: "Georgien"        },
    gr:  { latitude: 39.0742, longitude: 21.8243, distance: 60, name: "Griechenland"    },
    hr:  { latitude: 45.1000, longitude: 15.2000, distance: 15, name: "Kroatien"        },
    hu:  { latitude: 47.1625, longitude: 19.5033, distance: 15, name: "Ungarn"          },
    ie:  { latitude: 53.1424, longitude: -7.6921, distance: 60, name: "Irland"          },
    lu:  { latitude: 49.8153, longitude:  6.1296, distance: 15, name: "Luxemburg"       },
    lv:  { latitude: 56.8796, longitude: 24.6032, distance: 60, name: "Lettland"        },
    me:  { latitude: 42.7087, longitude: 19.3744, distance: 60, name: "Montenegro"      },
    mk:  { latitude: 41.6086, longitude: 21.7453, distance: 60, name: "Nordmazedonien"  },
    nl:  { latitude: 52.1326, longitude:  5.2913, distance: 15, name: "Niederlande"     },
    no:  { latitude: 60.4720, longitude:  8.4689, distance: 60, name: "Norwegen"        },
    pl:  { latitude: 51.9194, longitude: 19.1451, distance: 60, name: "Polen"           },
    pt:  { latitude: 39.3999, longitude: -8.2245, distance: 60, name: "Portugal"        },
    ro:  { latitude: 45.9432, longitude: 24.9668, distance: 15, name: "Rumänien"        },
    rs:  { latitude: 44.0165, longitude: 21.0059, distance: 60, name: "Serbien"         },
    se:  { latitude: 60.1282, longitude: 18.6435, distance: 60, name: "Schweden"        },
    sk:  { latitude: 48.6690, longitude: 19.6990, distance: 60, name: "Slowakei"        },
    xk:  { latitude: 42.6026, longitude: 20.9020, distance: 60, name: "Kosovo"          }
};

export const countryDayAheadPrices: TypeCountryDayAheadPrice[] = [
    { code: "BE",              name: "Belgium"                      },
    { code: "BG",              name: "Bulgaria"                     },
    { code: "CH",              name: "Switzerland"                  },
    { code: "CZ",              name: "Czech Republic"               },
    { code: "DE-LU",           name: "Germany, Luxembourg"          },
    { code: "DE-AT-LU",        name: "Germany, Austria, Luxembourg" },
    { code: "DK1",             name: "Denmark 1"                    },
    { code: "DK2",             name: "Denmark 2"                    },
    { code: "EE",              name: "Estonia"                      },
    { code: "ES",              name: "Spain"                        },
    { code: "FI",              name: "Finland"                      },
    { code: "FR",              name: "France"                       },
    { code: "GR",              name: "Greece"                       },
    { code: "HR",              name: "Croatia"                      },
    { code: "HU",              name: "Hungary"                      },
    { code: "IT-Calabria",     name: "Italy Calabria"               },
    { code: "IT-Centre-North", name: "Italy Centre North"           },
    { code: "IT-Centre-South", name: "Italy Centre South"           },
    { code: "IT-North",        name: "Italy North"                  },
    { code: "IT-SACOAC",       name: "Italy Sardinia Corsica AC"    },
    { code: "IT-SACODC",       name: "Italy Sardinia Corsica DC"    },
    { code: "IT-Sardinia",     name: "Italy Sardinia"               },
    { code: "IT-Sicily",       name: "Italy Sicily"                 },
    { code: "IT-South",        name: "Italy South"                  },
    { code: "LT",              name: "Lithuania"                    },
    { code: "LV",              name: "Latvia"                       },
    { code: "ME",              name: "Montenegro"                   },
    { code: "NL",              name: "Netherlands"                  },
    { code: "NO1",             name: "Norway 1"                     },
    { code: "NO2",             name: "Norway 2"                     },
    { code: "NO2NSL",          name: "Norway North Sea Link"        },
    { code: "NO3",             name: "Norway 3"                     },
    { code: "NO4",             name: "Norway 4"                     },
    { code: "NO5",             name: "Norway 5"                     },
    { code: "PL",              name: "Poland"                       },
    { code: "PT",              name: "Portugal"                     },
    { code: "RO",              name: "Romania"                      },
    { code: "RS",              name: "Serbia"                       },
    { code: "SE1",             name: "Sweden 1"                     },
    { code: "SE2",             name: "Sweden 2"                     },
    { code: "SE3",             name: "Sweden 3"                     },
    { code: "SE4",             name: "Sweden 4"                     },
    { code: "SI",              name: "Slovenia"                     },
    { code: "SK",              name: "Slovakia"                     },
];
