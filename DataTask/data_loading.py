import pandas as pd
import requests, io, os
from zipfile import ZipFile
from io import BytesIO
from urllib.request import urlopen
import wget


def load_territories_dict():
    """Loads a dictinary of US States including their ISO2, ISO3 codes and population

    Returns:
        dictionary: dictinary of US States including their ISO2, ISO3 codes and population
    """

    territories_dict = [
        {
            "admin0_iso_name": "Afghanistan",
            "admin0_iso2": "AF",
            "admin0_iso3": "AFG",
            "Population": 38928341
        },
        {
            "admin0_iso_name": "Angola",
            "admin0_iso2": "AO",
            "admin0_iso3": "AGO",
            "Population": 32866268
        },
        {
            "admin0_iso_name": "Antigua and Barbuda",
            "admin0_iso2": "AG",
            "admin0_iso3": "ATG",
            "Population": 97928
        },
        {
            "admin0_iso_name": "Argentina",
            "admin0_iso2": "AR",
            "admin0_iso3": "ARG",
            "Population": 45195777
        },
        {
            "admin0_iso_name": "Austria",
            "admin0_iso2": "AT",
            "admin0_iso3": "AUT",
            "Population": 9006400
        },
        {
            "admin0_iso_name": "Bahamas",
            "admin0_iso2": "BS",
            "admin0_iso3": "BHS",
            "Population": 393248
        },
        {
            "admin0_iso_name": "Bahrain",
            "admin0_iso2": "BH",
            "admin0_iso3": "BHR",
            "Population": 1701583
        },
        {
            "admin0_iso_name": "Bangladesh",
            "admin0_iso2": "BD",
            "admin0_iso3": "BGD",
            "Population": 164689383
        },
        {
            "admin0_iso_name": "Barbados",
            "admin0_iso2": "BB",
            "admin0_iso3": "BRB",
            "Population": 287371
        },
        {
            "admin0_iso_name": "Belarus",
            "admin0_iso2": "BY",
            "admin0_iso3": "BLR",
            "Population": 9449321
        },
        {
            "admin0_iso_name": "Belgium",
            "admin0_iso2": "BE",
            "admin0_iso3": "BEL",
            "Population": 11589616
        },
        {
            "admin0_iso_name": "Belize",
            "admin0_iso2": "BZ",
            "admin0_iso3": "BLZ",
            "Population": 397621
        },
        {
            "admin0_iso_name": "Benin",
            "admin0_iso2": "BJ",
            "admin0_iso3": "BEN",
            "Population": 12123198
        },
        {
            "admin0_iso_name": "Bolivia",
            "admin0_iso2": "BO",
            "admin0_iso3": "BOL",
            "Population": 11673029
        },
        {
            "admin0_iso_name": "Bosnia and Herzegovina",
            "admin0_iso2": "BA",
            "admin0_iso3": "BIH",
            "Population": 3280815
        },
        {
            "admin0_iso_name": "Botswana",
            "admin0_iso2": "BW",
            "admin0_iso3": "BWA",
            "Population": 2351625
        },
        {
            "admin0_iso_name": "Brazil",
            "admin0_iso2": "BR",
            "admin0_iso3": "BRA",
            "Population": 212559409
        },
        {
            "admin0_iso_name": "Bulgaria",
            "admin0_iso2": "BG",
            "admin0_iso3": "BGR",
            "Population": 6948445
        },
        {
            "admin0_iso_name": "Burkina Faso",
            "admin0_iso2": "BF",
            "admin0_iso3": "BFA",
            "Population": 20903278
        },
        {
            "admin0_iso_name": "Burma",
            "admin0_iso2": "MM",
            "admin0_iso3": "MMR",
            "Population": 54409794
        },
        {
            "admin0_iso_name": "Cabo Verde",
            "admin0_iso2": "CV",
            "admin0_iso3": "CPV",
            "Population": 555988
        },
        {
            "admin0_iso_name": "Cambodia",
            "admin0_iso2": "KH",
            "admin0_iso3": "KHM",
            "Population": 16718971
        },
        {
            "admin0_iso_name": "Cameroon",
            "admin0_iso2": "CM",
            "admin0_iso3": "CMR",
            "Population": 26545864
        },
        {
            "admin0_iso_name": "Chile",
            "admin0_iso2": "CL",
            "admin0_iso3": "CHL",
            "Population": 19116209
        },
        {
            "admin0_iso_name": "Colombia",
            "admin0_iso2": "CO",
            "admin0_iso3": "COL",
            "Population": 50882884
        },
        {
            "admin0_iso_name": "Costa Rica",
            "admin0_iso2": "CR",
            "admin0_iso3": "CRI",
            "Population": 5094114
        },
        {
            "admin0_iso_name": "Cote d'Ivoire",
            "admin0_iso2": "CI",
            "admin0_iso3": "CIV",
            "Population": 26378275
        },
        {
            "admin0_iso_name": "Croatia",
            "admin0_iso2": "HR",
            "admin0_iso3": "HRV",
            "Population": 4105268
        },
        {
            "admin0_iso_name": "Cuba",
            "admin0_iso2": "CU",
            "admin0_iso3": "CUB",
            "Population": 11326616
        },
        {
            "admin0_iso_name": "Cyprus",
            "admin0_iso2": "CY",
            "admin0_iso3": "CYP",
            "Population": 1207361
        },
        {
            "admin0_iso_name": "Czechia",
            "admin0_iso2": "CZ",
            "admin0_iso3": "CZE",
            "Population": 10708982
        },
        {
            "admin0_iso_name": "Denmark",
            "admin0_iso2": "DK",
            "admin0_iso3": "DNK",
            "Population": 5792203
        },
        {
            "admin0_iso_name": "Dominican Republic",
            "admin0_iso2": "DO",
            "admin0_iso3": "DOM",
            "Population": 10847904
        },
        {
            "admin0_iso_name": "Ecuador",
            "admin0_iso2": "EC",
            "admin0_iso3": "ECU",
            "Population": 17643060
        },
        {
            "admin0_iso_name": "Egypt",
            "admin0_iso2": "EG",
            "admin0_iso3": "EGY",
            "Population": 102334403
        },
        {
            "admin0_iso_name": "El Salvador",
            "admin0_iso2": "SV",
            "admin0_iso3": "SLV",
            "Population": 6486201
        },
        {
            "admin0_iso_name": "Eritrea",
            "admin0_iso2": "ER",
            "admin0_iso3": "ERI",
            "Population": 3546427
        },
        {
            "admin0_iso_name": "Finland",
            "admin0_iso2": "FI",
            "admin0_iso3": "FIN",
            "Population": 5540718
        },
        {
            "admin0_iso_name": "France",
            "admin0_iso2": "FR",
            "admin0_iso3": "FRA",
            "Population": 65273512
        },
        {
            "admin0_iso_name": "Gabon",
            "admin0_iso2": "GA",
            "admin0_iso3": "GAB",
            "Population": 2225728
        },
        {
            "admin0_iso_name": "Georgia",
            "admin0_iso2": "GE",
            "admin0_iso3": "GEO",
            "Population": 3989175
        },
        {
            "admin0_iso_name": "Germany",
            "admin0_iso2": "DE",
            "admin0_iso3": "DEU",
            "Population": 83783945
        },
        {
            "admin0_iso_name": "Ghana",
            "admin0_iso2": "GH",
            "admin0_iso3": "GHA",
            "Population": 31072945
        },
        {
            "admin0_iso_name": "Greece",
            "admin0_iso2": "GR",
            "admin0_iso3": "GRC",
            "Population": 10423056
        },
        {
            "admin0_iso_name": "Guatemala",
            "admin0_iso2": "GT",
            "admin0_iso3": "GTM",
            "Population": 17915567
        },
        {
            "admin0_iso_name": "Haiti",
            "admin0_iso2": "HT",
            "admin0_iso3": "HTI",
            "Population": 11402533
        },
        {
            "admin0_iso_name": "Honduras",
            "admin0_iso2": "HN",
            "admin0_iso3": "HND",
            "Population": 9904608
        },
        {
            "admin0_iso_name": "Hungary",
            "admin0_iso2": "HU",
            "admin0_iso3": "HUN",
            "Population": 9660350
        },
        {
            "admin0_iso_name": "India",
            "admin0_iso2": "IN",
            "admin0_iso3": "IND",
            "Population": 1380004385
        },
        {
            "admin0_iso_name": "Indonesia",
            "admin0_iso2": "ID",
            "admin0_iso3": "IDN",
            "Population": 273523621
        },
        {
            "admin0_iso_name": "Iraq",
            "admin0_iso2": "IQ",
            "admin0_iso3": "IRQ",
            "Population": 40222503
        },
        {
            "admin0_iso_name": "Ireland",
            "admin0_iso2": "IE",
            "admin0_iso3": "IRL",
            "Population": 4937796
        },
        {
            "admin0_iso_name": "Israel",
            "admin0_iso2": "IL",
            "admin0_iso3": "ISR",
            "Population": 8655541
        },
        {
            "admin0_iso_name": "Italy",
            "admin0_iso2": "IT",
            "admin0_iso3": "ITA",
            "Population": 60461828
        },
        {
            "admin0_iso_name": "Jamaica",
            "admin0_iso2": "JM",
            "admin0_iso3": "JAM",
            "Population": 2961161
        },
        {
            "admin0_iso_name": "Japan",
            "admin0_iso2": "JP",
            "admin0_iso3": "JPN",
            "Population": 126476458
        },
        {
            "admin0_iso_name": "Jordan",
            "admin0_iso2": "JO",
            "admin0_iso3": "JOR",
            "Population": 10203140
        },
        {
            "admin0_iso_name": "Kazakhstan",
            "admin0_iso2": "KZ",
            "admin0_iso3": "KAZ",
            "Population": 18776707
        },
        {
            "admin0_iso_name": "Kenya",
            "admin0_iso2": "KE",
            "admin0_iso3": "KEN",
            "Population": 53771300
        },
        {
            "admin0_iso_name": "Korea, South",
            "admin0_iso2": "KR",
            "admin0_iso3": "KOR",
            "Population": 51269183
        },
        {
            "admin0_iso_name": "Kuwait",
            "admin0_iso2": "KW",
            "admin0_iso3": "KWT",
            "Population": 4270563
        },
        {
            "admin0_iso_name": "Kyrgyzstan",
            "admin0_iso2": "KG",
            "admin0_iso3": "KGZ",
            "Population": 6524191
        },
        {
            "admin0_iso_name": "Latvia",
            "admin0_iso2": "LV",
            "admin0_iso3": "LVA",
            "Population": 1886202
        },
        {
            "admin0_iso_name": "Lebanon",
            "admin0_iso2": "LB",
            "admin0_iso3": "LBN",
            "Population": 6825442
        },
        {
            "admin0_iso_name": "Libya",
            "admin0_iso2": "LY",
            "admin0_iso3": "LBY",
            "Population": 6871287
        },
        {
            "admin0_iso_name": "Lithuania",
            "admin0_iso2": "LT",
            "admin0_iso3": "LTU",
            "Population": 2722291
        },
        {
            "admin0_iso_name": "Luxembourg",
            "admin0_iso2": "LU",
            "admin0_iso3": "LUX",
            "Population": 625976
        },
        {
            "admin0_iso_name": "Malaysia",
            "admin0_iso2": "MY",
            "admin0_iso3": "MYS",
            "Population": 32365998
        },
        {
            "admin0_iso_name": "Mali",
            "admin0_iso2": "ML",
            "admin0_iso3": "MLI",
            "Population": 20250834
        },
        {
            "admin0_iso_name": "Malta",
            "admin0_iso2": "MT",
            "admin0_iso3": "MLT",
            "Population": 441539
        },
        {
            "admin0_iso_name": "Mauritius",
            "admin0_iso2": "MU",
            "admin0_iso3": "MUS",
            "Population": 1271767
        },
        {
            "admin0_iso_name": "Mexico",
            "admin0_iso2": "MX",
            "admin0_iso3": "MEX",
            "Population": 127792286
        },
        {
            "admin0_iso_name": "Moldova",
            "admin0_iso2": "MD",
            "admin0_iso3": "MDA",
            "Population": 4033963
        },
        {
            "admin0_iso_name": "Morocco",
            "admin0_iso2": "MA",
            "admin0_iso3": "MAR",
            "Population": 36910558
        },
        {
            "admin0_iso_name": "Mozambique",
            "admin0_iso2": "MZ",
            "admin0_iso3": "MOZ",
            "Population": 31255435
        },
        {
            "admin0_iso_name": "Nepal",
            "admin0_iso2": "NP",
            "admin0_iso3": "NPL",
            "Population": 29136808
        },
        {
            "admin0_iso_name": "Netherlands",
            "admin0_iso2": "NL",
            "admin0_iso3": "NLD",
            "Population": 17134873
        },
        {
            "admin0_iso_name": "Aruba, Netherlands",
            "admin0_iso2": "AW",
            "admin0_iso3": "ABW",
            "Population": 106766
        },
        {
            "admin0_iso_name": "New Zealand",
            "admin0_iso2": "NZ",
            "admin0_iso3": "NZL",
            "Population": 4822233
        },
        {
            "admin0_iso_name": "Niger",
            "admin0_iso2": "NE",
            "admin0_iso3": "NER",
            "Population": 24206636
        },
        {
            "admin0_iso_name": "Nigeria",
            "admin0_iso2": "NG",
            "admin0_iso3": "NGA",
            "Population": 206139587
        },
        {
            "admin0_iso_name": "North Macedonia",
            "admin0_iso2": "MK",
            "admin0_iso3": "MKD",
            "Population": 2083380
        },
        {
            "admin0_iso_name": "Norway",
            "admin0_iso2": "NO",
            "admin0_iso3": "NOR",
            "Population": 5421242
        },
        {
            "admin0_iso_name": "Oman",
            "admin0_iso2": "OM",
            "admin0_iso3": "OMN",
            "Population": 5106622
        },
        {
            "admin0_iso_name": "Pakistan",
            "admin0_iso2": "PK",
            "admin0_iso3": "PAK",
            "Population": 220892331
        },
        {
            "admin0_iso_name": "Panama",
            "admin0_iso2": "PA",
            "admin0_iso3": "PAN",
            "Population": 4314768
        },
        {
            "admin0_iso_name": "Paraguay",
            "admin0_iso2": "PY",
            "admin0_iso3": "PRY",
            "Population": 7132530
        },
        {
            "admin0_iso_name": "Peru",
            "admin0_iso2": "PE",
            "admin0_iso3": "PER",
            "Population": 32971846
        },
        {
            "admin0_iso_name": "Philippines",
            "admin0_iso2": "PH",
            "admin0_iso3": "PHL",
            "Population": 109581085
        },
        {
            "admin0_iso_name": "Poland",
            "admin0_iso2": "PL",
            "admin0_iso3": "POL",
            "Population": 37846605
        },
        {
            "admin0_iso_name": "Portugal",
            "admin0_iso2": "PT",
            "admin0_iso3": "PRT",
            "Population": 10196707
        },
        {
            "admin0_iso_name": "Qatar",
            "admin0_iso2": "QA",
            "admin0_iso3": "QAT",
            "Population": 2881060
        },
        {
            "admin0_iso_name": "Romania",
            "admin0_iso2": "RO",
            "admin0_iso3": "ROU",
            "Population": 19237682
        },
        {
            "admin0_iso_name": "Russia",
            "admin0_iso2": "RU",
            "admin0_iso3": "RUS",
            "Population": 145934460
        },
        {
            "admin0_iso_name": "Rwanda",
            "admin0_iso2": "RW",
            "admin0_iso3": "RWA",
            "Population": 12952209
        },
        {
            "admin0_iso_name": "Saudi Arabia",
            "admin0_iso2": "SA",
            "admin0_iso3": "SAU",
            "Population": 34813867
        },
        {
            "admin0_iso_name": "Senegal",
            "admin0_iso2": "SN",
            "admin0_iso3": "SEN",
            "Population": 16743930
        },
        {
            "admin0_iso_name": "Serbia",
            "admin0_iso2": "RS",
            "admin0_iso3": "SRB",
            "Population": 8737370
        },
        {
            "admin0_iso_name": "Singapore",
            "admin0_iso2": "SG",
            "admin0_iso3": "SGP",
            "Population": 5850343
        },
        {
            "admin0_iso_name": "Slovakia",
            "admin0_iso2": "SK",
            "admin0_iso3": "SVK",
            "Population": 5459643
        },
        {
            "admin0_iso_name": "Slovenia",
            "admin0_iso2": "SI",
            "admin0_iso3": "SVN",
            "Population": 2078932
        },
        {
            "admin0_iso_name": "South Africa",
            "admin0_iso2": "ZA",
            "admin0_iso3": "ZAF",
            "Population": 59308690
        },
        {
            "admin0_iso_name": "Spain",
            "admin0_iso2": "ES",
            "admin0_iso3": "ESP",
            "Population": 46754783
        },
        {
            "admin0_iso_name": "Sri Lanka",
            "admin0_iso2": "LK",
            "admin0_iso3": "LKA",
            "Population": 21413250
        },
        {
            "admin0_iso_name": "Sweden",
            "admin0_iso2": "SE",
            "admin0_iso3": "SWE",
            "Population": 10099270
        },
        {
            "admin0_iso_name": "Switzerland",
            "admin0_iso2": "CH",
            "admin0_iso3": "CHE",
            "Population": 8654618
        },
        {
            "admin0_iso_name": "Tanzania",
            "admin0_iso2": "TZ",
            "admin0_iso3": "TZA",
            "Population": 59734213
        },
        {
            "admin0_iso_name": "Thailand",
            "admin0_iso2": "TH",
            "admin0_iso3": "THA",
            "Population": 69799978
        },
        {
            "admin0_iso_name": "Togo",
            "admin0_iso2": "TG",
            "admin0_iso3": "TGO",
            "Population": 8278737
        },
        {
            "admin0_iso_name": "Trinidad and Tobago",
            "admin0_iso2": "TT",
            "admin0_iso3": "TTO",
            "Population": 1399491
        },
        {
            "admin0_iso_name": "Turkey",
            "admin0_iso2": "TR",
            "admin0_iso3": "TUR",
            "Population": 84339067
        },
        {
            "admin0_iso_name": "Uganda",
            "admin0_iso2": "UG",
            "admin0_iso3": "UGA",
            "Population": 45741000
        },
        {
            "admin0_iso_name": "Ukraine",
            "admin0_iso2": "UA",
            "admin0_iso3": "UKR",
            "Population": 43733759
        },
        {
            "admin0_iso_name": "United Arab Emirates",
            "admin0_iso2": "AE",
            "admin0_iso3": "ARE",
            "Population": 9890400
        },
        {
            "admin0_iso_name": "United Kingdom",
            "admin0_iso2": "GB",
            "admin0_iso3": "GBR",
            "Population": 67886004
        },
        {
            "admin0_iso_name": "Uruguay",
            "admin0_iso2": "UY",
            "admin0_iso3": "URY",
            "Population": 3473727
        },
        {
            "admin0_iso_name": "Venezuela",
            "admin0_iso2": "VE",
            "admin0_iso3": "VEN",
            "Population": 28435943
        },
        {
            "admin0_iso_name": "Vietnam",
            "admin0_iso2": "VN",
            "admin0_iso3": "VNM",
            "Population": 97338583
        },
        {
            "admin0_iso_name": "Zambia",
            "admin0_iso2": "ZM",
            "admin0_iso3": "ZMB",
            "Population": 18383956
        },
        {
            "admin0_iso_name": "Australia",
            "admin0_iso2": "AU",
            "admin0_iso3": "AUS",
            "Population": 25459700
        },
        {
            "admin0_iso_name": "Canada",
            "admin0_iso2": "CA",
            "admin0_iso3": "CAN",
            "Population": 37855702
        },
        {
            "admin0_iso_name": "US",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "Population": 329466283
        },
        {
            "admin0_iso_name": "Puerto Rico, US",
            "admin0_iso2": "PR",
            "admin0_iso3": "PRI",
            "Population": 2933408
        }
    ]

    return territories_dict


def load_wntrac_npi_types_dict():
    """Loads a dictionary of the WNTRAC NPIs

    Returns:
        dictionary: dictionary with the WNTRAC NPI types.
    """
    wntrac_npi_types_dict = {
        "economic impact": "L3",
        "school closure": "A1",
        "entertainment/cultural sector closure": "A3",
        "state of emergency (legal impact)": "L1",
        "public transportation": "I2",
        "public services closure": "A2",
        "mass gatherings": "I1",
        "introduction of travel quarantine policies": "I8",
        "work restrictions": "I6",
        "changes in prison-related policies": "I9",
        "confinement": "I7",
        "mask wearing": "H1",
        "freedom of movement (nationality dependent)": "I5",
        "contact tracing": "L2",
        "domestic flight restriction": "I4",
        "international flight restrictions": "I3",
        "other": "other",
    }

    return wntrac_npi_types_dict


def load_wntrac_si_map():
    """Loads a customised mapping of the WNTRAC NPIs to the Stringency Index formulation defined in https://www.bsg.ox.ac.uk/sites/default/files/2020-09/BSG-WP-2020-032-v7.0.pdf

    Returns:
        pd.DataFrame: Dataframe with customised mapping of the WNTRAC NPIs to the Stringency Index formulation
    """
    wntrac_si_map_dict = [
        {"indicator": "I1", "max_value": 4, "flag": 1},
        {"indicator": "I2", "max_value": 2, "flag": 1},
        {"indicator": "I3", "max_value": 2, "flag": 0},
        {"indicator": "I4", "max_value": 2, "flag": 1},
        {"indicator": "I5", "max_value": 2, "flag": 0},
        {"indicator": "I6", "max_value": 2, "flag": 1},
        {"indicator": "I7", "max_value": 2, "flag": 1},
        {"indicator": "I8", "max_value": 2, "flag": 0},
        {"indicator": "A1", "max_value": 2, "flag": 1},
        {"indicator": "A2", "max_value": 2, "flag": 1},
        {"indicator": "A3", "max_value": 2, "flag": 1},
        {"indicator": "H1", "max_value": 4, "flag": 1},
    ]

    return pd.DataFrame(data=wntrac_si_map_dict)


def load_us_states_dict():
    us_states_dict = [
        {
            "admin1_iso2": "US-AL",
            "admin1_iso_name": "Alabama",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-AL",
            "Population": 4864680,
        },
        {
            "admin1_iso2": "US-AK",
            "admin1_iso_name": "Alaska",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-AK",
            "Population": 738516,
        },
        {
            "admin1_iso2": "US-AZ",
            "admin1_iso_name": "Arizona",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-AZ",
            "Population": 6946685,
        },
        {
            "admin1_iso2": "US-AR",
            "admin1_iso_name": "Arkansas",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-AR",
            "Population": 2990671,
        },
        {
            "admin1_iso2": "US-CA",
            "admin1_iso_name": "California",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-CA",
            "Population": 39148760,
        },
        {
            "admin1_iso2": "US-CO",
            "admin1_iso_name": "Colorado",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-CO",
            "Population": 5531141,
        },
        {
            "admin1_iso2": "US-CT",
            "admin1_iso_name": "Connecticut",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-CT",
            "Population": 3581504,
        },
        {
            "admin1_iso2": "US-DE",
            "admin1_iso_name": "Delaware",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-DE",
            "Population": 949495,
        },
        {
            "admin1_iso2": "US-DC",
            "admin1_iso_name": "District of Columbia",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-DC",
            "Population": 684498,
        },
        {
            "admin1_iso2": "US-FL",
            "admin1_iso_name": "Florida",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-FL",
            "Population": 20598139,
        },
        {
            "admin1_iso2": "US-GA",
            "admin1_iso_name": "Georgia",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-GA",
            "Population": 10297484,
        },
        {
            "admin1_iso2": "US-HI",
            "admin1_iso_name": "Hawaii",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-HI",
            "Population": 1422029,
        },
        {
            "admin1_iso2": "US-ID",
            "admin1_iso_name": "Idaho",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-ID",
            "Population": 1687809,
        },
        {
            "admin1_iso2": "US-IL",
            "admin1_iso_name": "Illinois",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-IL",
            "Population": 12821497,
        },
        {
            "admin1_iso2": "US-IN",
            "admin1_iso_name": "Indiana",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-IN",
            "Population": 6637426,
        },
        {
            "admin1_iso2": "US-IA",
            "admin1_iso_name": "Iowa",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-IA",
            "Population": 3132499,
        },
        {
            "admin1_iso2": "US-KS",
            "admin1_iso_name": "Kansas",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-KS",
            "Population": 2908776,
        },
        {
            "admin1_iso2": "US-KY",
            "admin1_iso_name": "Kentucky",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-KY",
            "Population": 4440204,
        },
        {
            "admin1_iso2": "US-LA",
            "admin1_iso_name": "Louisiana",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-LA",
            "Population": 4663616,
        },
        {
            "admin1_iso2": "US-ME",
            "admin1_iso_name": "Maine",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-ME",
            "Population": 1332813,
        },
        {
            "admin1_iso2": "US-MD",
            "admin1_iso_name": "Maryland",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-MD",
            "Population": 6003435,
        },
        {
            "admin1_iso2": "US-MA",
            "admin1_iso_name": "Massachusetts",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-MA",
            "Population": 6830193,
        },
        {
            "admin1_iso2": "US-MI",
            "admin1_iso_name": "Michigan",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-MI",
            "Population": 9957488,
        },
        {
            "admin1_iso2": "US-MN",
            "admin1_iso_name": "Minnesota",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-MN",
            "Population": 5527358,
        },
        {
            "admin1_iso2": "US-MS",
            "admin1_iso_name": "Mississippi",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-MS",
            "Population": 2988762,
        },
        {
            "admin1_iso2": "US-MO",
            "admin1_iso_name": "Missouri",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-MO",
            "Population": 6090062,
        },
        {
            "admin1_iso2": "US-MT",
            "admin1_iso_name": "Montana",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-MT",
            "Population": 1041732,
        },
        {
            "admin1_iso2": "US-NE",
            "admin1_iso_name": "Nebraska",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-NE",
            "Population": 1904760,
        },
        {
            "admin1_iso2": "US-NV",
            "admin1_iso_name": "Nevada",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-NV",
            "Population": 2922849,
        },
        {
            "admin1_iso2": "US-NH",
            "admin1_iso_name": "New Hampshire",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-NH",
            "Population": 1343622,
        },
        {
            "admin1_iso2": "US-NJ",
            "admin1_iso_name": "New Jersey",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-NJ",
            "Population": 8881845,
        },
        {
            "admin1_iso2": "US-NM",
            "admin1_iso_name": "New Mexico",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-NM",
            "Population": 2092434,
        },
        {
            "admin1_iso2": "US-NY",
            "admin1_iso_name": "New York",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-NY",
            "Population": 19618453,
        },
        {
            "admin1_iso2": "US-NC",
            "admin1_iso_name": "North Carolina",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-NC",
            "Population": 10155624,
        },
        {
            "admin1_iso2": "US-ND",
            "admin1_iso_name": "North Dakota",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-ND",
            "Population": 752201,
        },
        {
            "admin1_iso2": "US-OH",
            "admin1_iso_name": "Ohio",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-OH",
            "Population": 11641879,
        },
        {
            "admin1_iso2": "US-OK",
            "admin1_iso_name": "Oklahoma",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-OK",
            "Population": 3918137,
        },
        {
            "admin1_iso2": "US-OR",
            "admin1_iso_name": "Oregon",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-OR",
            "Population": 4081943,
        },
        {
            "admin1_iso2": "US-PA",
            "admin1_iso_name": "Pennsylvania",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-PA",
            "Population": 12791181,
        },
        {
            "admin1_iso2": "US-RI",
            "admin1_iso_name": "Rhode Island",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-RI",
            "Population": 1056611,
        },
        {
            "admin1_iso2": "US-SC",
            "admin1_iso_name": "South Carolina",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-SC",
            "Population": 4955925,
        },
        {
            "admin1_iso2": "US-SD",
            "admin1_iso_name": "South Dakota",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-SD",
            "Population": 864289,
        },
        {
            "admin1_iso2": "US-TN",
            "admin1_iso_name": "Tennessee",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-TN",
            "Population": 6651089,
        },
        {
            "admin1_iso2": "US-TX",
            "admin1_iso_name": "Texas",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-TX",
            "Population": 27885195,
        },
        {
            "admin1_iso2": "US-UT",
            "admin1_iso_name": "Utah",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-UT",
            "Population": 3045350,
        },
        {
            "admin1_iso2": "US-VT",
            "admin1_iso_name": "Vermont",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-VT",
            "Population": 624977,
        },
        {
            "admin1_iso2": "US-VA",
            "admin1_iso_name": "Virginia",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-VA",
            "Population": 8413774,
        },
        {
            "admin1_iso2": "US-WA",
            "admin1_iso_name": "Washington",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-WA",
            "Population": 7294336,
        },
        {
            "admin1_iso2": "US-WV",
            "admin1_iso_name": "West Virginia",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-WV",
            "Population": 1829054,
        },
        {
            "admin1_iso2": "US-WI",
            "admin1_iso_name": "Wisconsin",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-WI",
            "Population": 5778394,
        },
        {
            "admin1_iso2": "US-WY",
            "admin1_iso_name": "Wyoming",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-WY",
            "Population": 581836,
        },
        {
            "admin1_iso2": "US-PR",
            "admin1_iso_name": "Puerto Rico",
            "admin0_iso_name": "United States",
            "admin0_iso2": "US",
            "admin0_iso3": "USA",
            "admin1_iso3": "USA-PR",
            "Population": 3386941,
        },
    ]

    return us_states_dict


def load_mobility_data():
    """Downloads and saves the latest mobility dataset from Google that can be downloaded from https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv

    Returns:
        pd.DataFrame: latest mobility dataset
    """
    try:
        mobility_data_df = pd.read_csv("./data/mobility_trends.csv")
    except FileNotFoundError:
        print(
            "Missing mobility data. Downloading google mobility data from https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv and saving it as mobility_trends.csv"
        )
        google_data_url = (
            "https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv"
        )
        wget.download(google_data_url, "./data/mobility_trends.csv")
        mobility_data_df = pd.read_csv("./data/mobility_trends.csv")
    mobility_data_df.rename(
        columns={
            "workplaces_percent_change_from_baseline": "workplaces",
            "retail_and_recreation_percent_change_from_baseline": "retail_and_recreation",
            "grocery_and_pharmacy_percent_change_from_baseline": "grocery_and_pharmacy",
            "parks_percent_change_from_baseline": "parks",
            "transit_stations_percent_change_from_baseline": "transit_stations",
            "residential_percent_change_from_baseline": "residential",
        },
        inplace=True,
    )

    return mobility_data_df


def load_wntrac_npi_data():
    """Download and save WNTRAC NPIs events data. Update this with the latest data from https://github.com/IBM/wntrac/blob/master/data/README.md

    Returns:
        pd.DataFrame: dataframe with WNTRAC NPIs events data
        pd.DataFrame: dataframe with WNTRAC NPIs evidences data
    """
    # WNTRAC NPI data
    zipurl = "https://github.com/IBM/wntrac/raw/master/data/ibm-wntrac-2021-06-03.zip"
    with urlopen(zipurl) as zipresp:
        with ZipFile(BytesIO(zipresp.read())) as zip_file:
            wntrac_events_df = pd.read_csv(
                zip_file.open("ibm-wntrac-2021-06-03-events.csv")
            )
            save_csv_file(wntrac_events_df, "./data/ibm_wntrac_events.csv")
            wntrac_evidences_df = pd.read_csv(
                zip_file.open("ibm-wntrac-2021-06-03-evidences.csv")
            )

            save_csv_file(wntrac_evidences_df, "./data/ibm_wntrac_evidences.csv")

    return wntrac_evidences_df, wntrac_events_df


def load_us_states_who_outcome_df():
    """Download and save the CDC COVID-19 cases data for US States that can be downloaded from https://data.cdc.gov/api/views/9mfq-cb36/rows.csv?accessType=DOWNLOAD

    Returns:
        pd.DataFrame: dataframe of CDC Covid-19 cases for US States
    """
    try:
        us_states_who_outcome_df = pd.read_csv("./data/us_states_outcome.csv")
    except FileNotFoundError:
        print(
            "Missing US States outcome data. Downloading data from https://data.cdc.gov/api/views/9mfq-cb36/rows.csv?accessType=DOWNLOAD and saving it as us_states_outcome.csv"
        )
        cdc_data_url = (
            "https://data.cdc.gov/api/views/9mfq-cb36/rows.csv?accessType=DOWNLOAD"
        )

        us_states_who_outcome_df = download_csv_data_file(cdc_data_url)

        us_states_who_outcome_df.rename(
            columns={
                "submission_date": "dt",
                "state": "province_id",
                "tot_cases": "confirmed_cases",
                "tot_death": "deaths",
                "new_case": "confirmed_cases_delta",
                "new_death": "deaths_delta",
                "created_at": "collected",
            },
            inplace=True,
        )
        us_states_who_outcome_df["province_id"] = (
            "US-" + us_states_who_outcome_df["province_id"]
        )
        outliers = ["US-AS", "US-VI", "US-PW", "US-MP", "US-GU"]
        us_states_who_outcome_df = us_states_who_outcome_df[
            (us_states_who_outcome_df["province_id"].map(len) == 5)
            & ~(us_states_who_outcome_df["province_id"].isin(outliers))
        ]
        us_states_who_outcome_df["country_id"] = "US"
        us_states_dict = load_us_states_dict()
        us_states_dict = {td["admin1_iso2"]: td for td in us_states_dict}
        us_states_who_outcome_df["province_name"] = [
            us_states_dict[prov_id]["admin1_iso_name"]
            for prov_id in us_states_who_outcome_df["province_id"]
        ]
        us_states_who_outcome_df = us_states_who_outcome_df[
            [
                "province_id",
                "confirmed_cases",
                "deaths",
                "confirmed_cases_delta",
                "deaths_delta",
                "dt",
                "collected",
                "country_id",
                "province_name",
            ]
        ]

        save_csv_file(us_states_who_outcome_df, "./data/us_states_outcome.csv")

    return us_states_who_outcome_df


def load_world_who_outcome_df():
    """Function to download and save the WHO COVID-19 cases data for world countries that can be downloaded from https://covid19.who.int/WHO-COVID-19-global-data.csv

    Returns:
        pd.DataFrame: WHO cases data
    """
    try:
        world_who_outcome_df = pd.read_csv("./data/global_who.csv")
    except FileNotFoundError:
        print(
            "Missing WHO case data for countries. Downloading from https://covid19.who.int/WHO-COVID-19-global-data.csv"
        )
        # World countries COVID-19 outcome data
        csv_url = "https://covid19.who.int/WHO-COVID-19-global-data.csv"
        world_who_outcome_df = download_csv_data_file(csv_url)

        world_who_outcome_df.columns = [
            i.strip().lower() for i in world_who_outcome_df.columns
        ]
        world_who_outcome_df["country_code"] = world_who_outcome_df.apply(
            lambda row: row.country_code if row.country != "Other" else "Other", axis=1
        )

        world_who_outcome_df.rename(
            columns={
                "date_reported": "dt",
                "country_code": "country_id",
                "cumulative_cases": "confirmed_cases",
                "cumulative_deaths": "deaths",
                "new_cases": "confirmed_cases_delta",
                "new_deaths": "deaths_delta",
            },
            inplace=True,
        )

        save_csv_file(world_who_outcome_df, "./data/global_who.csv", index=False)

    return world_who_outcome_df


def load_us_states_oxcgrt_df():
    """Downloads and saves the OxCGRT NPIs Stringency Index data for US States that can be downloaded from https://raw.githubusercontent.com/OxCGRT/USA-covid-policy/main/data/OxCGRT_US_latest.csv

    Returns:
        pd.DataFrame: dataframe with the OxCGRT NPIs Stringency Index data for US States
    """
    try:
        us_states_oxcgrt_df = pd.read_csv("./data/us_states_oxcgrt.csv")
    except FileNotFoundError:
        print(
            "Missing OxCGRT US States data. Downloading from https://raw.githubusercontent.com/OxCGRT/USA-covid-policy/main/data/OxCGRT_US_latest.csv"
        )
        us_oxcgrt_data_url = "https://raw.githubusercontent.com/OxCGRT/USA-covid-policy/main/data/OxCGRT_US_latest.csv"
        us_states_oxcgrt_df = pd.read_csv(us_oxcgrt_data_url)
        us_states_oxcgrt_df = us_states_oxcgrt_df[
            us_states_oxcgrt_df["RegionCode"].notna()
        ]
        us_states_oxcgrt_df["Date"] = pd.to_datetime(
            us_states_oxcgrt_df["Date"], format="%Y%m%d", errors="coerce"
        )
        save_csv_file(us_states_oxcgrt_df, "./data/us_states_oxcgrt.csv", False)

    return us_states_oxcgrt_df


def load_world_states_oxxgrt_df():
    """Downloads and saves the OxCGRT NPIs Stringency Index data for world countries that can be downloaded from https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/main/data/OxCGRT_latest.csv

    Returns:
        pd.DataFrame: dataframe with the xCGRT NPIs Stringency Index data for world countries
    """

    try:
        world_oxcgrt_data_df = pd.read_csv("./data/world_oxcgrt.csv")
    except FileNotFoundError:
        print(
            "Missing OxCGRT countries data. Downloading from https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/main/data/OxCGRT_latest.csv"
        )
        world_oxcgrt_data_url = "https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/main/data/OxCGRT_latest.csv"
        world_oxcgrt_data_df = pd.read_csv(world_oxcgrt_data_url)
        world_oxcgrt_data_df["Date"] = pd.to_datetime(
            world_oxcgrt_data_df["Date"], format="%Y%m%d", errors="coerce"
        )

        save_csv_file(world_oxcgrt_data_df, "./data/world_oxcgrt.csv")

    return world_oxcgrt_data_df


def download_csv_data_file(url: str):
    """Function to download data from a url

    Args:
        url (str): the url location; where to download the data

    Returns:
        pd.DataFrame: dataframe of the downloaded csv
    """
    r = requests.get(url)

    if r.status_code != 200:
        print("Download error, code = {}".format(r.status_code))
        return
    else:

        df = pd.read_csv(io.StringIO(r.content.decode("utf-8")), na_filter=False)
        return df


def save_csv_file(file: pd.DataFrame, path: str, index=False):
    """Saves a csv file, creates directory if doesn't exist yet

    Args:
        file (pd.DataFrame): dataframe to be saved as a csv
        path (str): path for the path to be saved.
        index (bool, optional): Argument to save the index column or not. Defaults to False.
    """

    if os.path.dirname(path) != "" and not os.path.exists(os.path.dirname(path)):
        os.makedirs(os.path.dirname(path))

    file.to_csv(path, index=index)
