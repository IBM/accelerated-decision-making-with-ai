#!/usr/bin/env python
# coding: utf-8

import pandas as pd
from datetime import datetime
from datetime import timedelta
import numpy as np
import plotly.graph_objects as go
import requests, io
import warnings
import sys
import wget
import os
from zipfile import ZipFile
from io import BytesIO
from urllib.request import urlopen

from switcher import Switcher
from data_transformation import *
from data_loading import (
    load_mobility_data,
    load_wntrac_npi_data,
    load_us_states_who_outcome_df,
    load_world_who_outcome_df,
    load_us_states_oxcgrt_df,
    load_world_states_oxxgrt_df,
)

warnings.filterwarnings("ignore")

if not os.path.exists("data"):
    os.makedirs("data")

# Refactor this into functions later after testing the other functions

# Dictionaries
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
wntrac_si_map = pd.DataFrame(data=wntrac_si_map_dict)

# Rewrote data loading into a function: data_loading.py

# Mobility data
mobility_data_df = load_mobility_data()

# WNTRAC NPI data
wntrac_evidences_df, wntrac_events_df = load_wntrac_npi_data()

# US States COVID-19 outcome data
us_states_who_outcome_df = load_us_states_who_outcome_df()

# World countries COVID-19 outcome data
world_who_outcome_df = load_world_who_outcome_df()

# OxCGRT NPI data
us_states_oxcgrt_df = load_us_states_oxcgrt_df()
world_oxcgrt_data_df = load_world_states_oxxgrt_df()

# Removed function definitions and put them in a different file: data_transformations.py
# Iterate through all the territories and for each territory compute a wntrac npi_index given 1. wntrac npis datasource and 2. oxcgrt npis datasource


ratios = "0.5/0.5"  # 0.0/1.0 #0.25/0.75 #0.5/0.5 #0.75/0.25 #1.0/0.0
ratios_name = ""  # _0_100 #_25_75 #_50_50 #_75_25 #_100_0
si_sources = ["wntrac", "oxcgrt"]
mob_types = [
    "workplaces",
    "retail_and_recreation",
    "grocery_and_pharmacy",
    "parks",
    "transit_stations",
    "residential",
]
frames = []
for target in territories_dict:
    mob_types_df = pd.DataFrame()
    admin1 = "admin1_iso_name" in target
    name = ""
    iso = ""
    for ss in si_sources:
        for mt in mob_types:
            target["mob_type"] = mt
            if admin1:
                print(target["admin1_iso_name"] + " => " + ss + " " + mt)
                name = target["admin1_iso_name"]
                iso = target["admin1_iso2"]
                if ss == "wntrac":
                    wntrac_npi_index = compute_wntrac_npi_index_for_a_territory(
                        target,
                        mobility_data_df,
                        us_states_who_outcome_df,
                        ratios,
                        None,
                        wntrac_events_df,
                        wntrac_evidences_df,
                        wntrac_npi_types_dict,
                        wntrac_si_map,
                    )
                else:
                    wntrac_npi_index = compute_wntrac_npi_index_for_a_territory(
                        target,
                        mobility_data_df,
                        us_states_who_outcome_df,
                        ratios,
                        us_states_oxcgrt_df,
                    )
            else:
                print(target["admin0_iso_name"] + " => " + ss + " " + mt)
                name = target["admin0_iso_name"]
                iso = target["admin0_iso2"]
                target["admin1_iso_name"] = None
                target["admin1_iso2"] = None
                target["admin1_iso3"] = None
                if ss == "wntrac":
                    wntrac_npi_index = compute_wntrac_npi_index_for_a_territory(
                        target,
                        mobility_data_df,
                        world_who_outcome_df,
                        ratios,
                        None,
                        wntrac_events_df,
                        wntrac_evidences_df,
                        wntrac_npi_types_dict,
                        wntrac_si_map,
                    )
                else:
                    wntrac_npi_index = compute_wntrac_npi_index_for_a_territory(
                        target,
                        mobility_data_df,
                        world_who_outcome_df,
                        ratios,
                        world_oxcgrt_data_df,
                    )
            if wntrac_npi_index.empty:
                continue
            if "observed_mobility" in wntrac_npi_index.columns:
                wntrac_npi_index.rename(
                    columns={"observed_mobility": "om_" + ss + "_" + mt}, inplace=True
                )
            if "si" in wntrac_npi_index.columns:
                wntrac_npi_index.rename(
                    columns={"si": "si_" + ss + "_" + mt}, inplace=True
                )
            if "mobility_ratio" in wntrac_npi_index.columns:
                wntrac_npi_index.rename(
                    columns={"mobility_ratio": "c_" + ss + "_" + mt}, inplace=True
                )
            if "adherence" in wntrac_npi_index.columns:
                wntrac_npi_index.rename(
                    columns={"adherence": "cs_" + ss + "_" + mt}, inplace=True
                )
            if "npi_index" in wntrac_npi_index.columns:
                wntrac_npi_index.rename(
                    columns={"npi_index": "ni_" + ss + "_" + mt}, inplace=True
                )
            if "anticipated_mobility" in wntrac_npi_index.columns:
                wntrac_npi_index.rename(
                    columns={"anticipated_mobility": "am_" + ss + "_" + mt},
                    inplace=True,
                )
            if mob_types_df.empty:
                mob_types_df = wntrac_npi_index
            else:
                mob_types_df = pd.merge(
                    mob_types_df,
                    wntrac_npi_index,
                    on=["date", "deaths", "confirmed_cases"],
                    how="outer",
                )
        if mob_types_df.empty:
            print(name + ": Insufficient data to compute index!")
            continue
    if not mob_types_df.empty:
        mob_types_df["admin0_name"] = target["admin0_iso_name"]
        mob_types_df["admin0_iso2"] = target["admin0_iso2"]
        mob_types_df["admin1_name"] = target["admin1_iso_name"]
        mob_types_df["admin1_iso2"] = target["admin1_iso2"]
        mob_types_df["admin"] = name + "(" + iso + ")"
        mob_types_df["population"] = target["Population"]
        frames.append(mob_types_df)
aggeregate_npi_index_df = pd.concat(frames)
aggeregate_npi_index_df["date"] = pd.to_datetime(aggeregate_npi_index_df["date"])
aggeregate_npi_index_df = aggeregate_npi_index_df.sort_values(by="date", ascending=True)
aggeregate_npi_index_df.to_csv(
    "./data/wntrac_npi_index" + ratios_name + ".csv", index=False
)
