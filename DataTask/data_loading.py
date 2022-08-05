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

    path = "./data/mobility_trends.csv"
    try:
        mobility_data_df = pd.read_csv("./data/mobility_trends.csv")
    except FileNotFoundError:
        print(
            "Missing mobility data. Downloading google mobility data from https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv and saving it as mobility_trends.csv"
        )
        google_data_url = (
            "https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv"
        )

        wget.download(google_data_url, path)
        mobility_data_df = pd.read_csv(path)
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

    # save_csv_file(mobility_data_df, "./data/mobility_trends.csv")
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
        us_states_oxcgrt_df = pd.read_csv(us_oxcgrt_data_url, low_memory=False)
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

        df = pd.read_csv(
            io.StringIO(r.content.decode("utf-8")), na_filter=False, low_memory=False
        )
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
