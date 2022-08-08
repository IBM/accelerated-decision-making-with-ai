from data_loading import *
import pytest, os, wget
import pandas as pd


# Clean up function to remove files created during tests
def delete_if_exists(file_list):
    for f in file_list:
        if os.path.isfile(f):
            os.remove(f)


@pytest.fixture(autouse=True)
def run_before_and_after_tests():
    """Fixture to execute code before and after a test is run"""
    file_list = [
        "data/global_who.csv",
        "data/ibm_wntrac_events.csv",
        "data/ibm_wntrac_evidences.csv",
        "data/mobility_trends.csv",
        "data/us_states_outcome.csv",
        "data/us_states_oxcgrt.csv",
        "data/world_oxcgrt.csv",
        "data/wntrac_npi_index.csv",
    ]
    # Before test - If files exist, delete
    delete_if_exists(file_list)
    yield  # this is where the actual testing happens
    # After test - If files exist, delete
    delete_if_exists(file_list)


@pytest.fixture
def value() -> int:
    return 100000


@pytest.fixture
def value_2() -> str:
    return "all"


@pytest.fixture
def ident() -> str:
    return "Ident"


@pytest.fixture
def territories_dict() -> list:
    return [
        {
            "admin0_iso_name": "Uganda",
            "admin0_iso2": "UG",
            "admin0_iso3": "UGA",
            "Population": 45741000,
        },
        {
            "admin0_iso_name": "Congo (Kinshasa)",
            "admin0_iso2": "CD",
            "admin0_iso3": "COD",
            "Population": 89561404,
        },
        {
            "admin0_iso_name": "Senegal",
            "admin0_iso2": "SN",
            "admin0_iso3": "SEN",
            "Population": 16743930,
        },
        {
            "admin0_iso_name": "Nigeria",
            "admin0_iso2": "NG",
            "admin0_iso3": "NGA",
            "Population": 206139587,
        },
    ]


@pytest.fixture
def wntrac_npis_types() -> dict:
    return {
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


@pytest.fixture
def wntrac_si_map_dict() -> list:
    return [
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


@pytest.fixture
def us_states_dict() -> list:
    return [
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


@pytest.fixture
def si_adherence_ratio() -> str:
    return "0.5/0.5"


@pytest.fixture
def mobility_data() -> pd.DataFrame:
    return load_mobility_data()


@pytest.fixture
def world_who_data() -> pd.DataFrame:
    return load_world_who_outcome_df()


@pytest.fixture
def ratios_name() -> str:
    return ""
