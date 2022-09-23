import pandas as pd
import warnings
import os

from data_transformation import *
from data_loading import *

warnings.filterwarnings("ignore")


def create_wntrac_npi_regions(ratios_name=""):

    # create data path if does not exist
    if not os.path.exists("data"):
        os.makedirs("data")

    # Load the dictionaries with constant variables to be used.

    territories_dict = load_territories_dict()
    us_states_dict = load_us_states_dict()
    wntrac_npi_types_dict = load_wntrac_npi_types_dict()
    wntrac_si_map = load_wntrac_si_map()

    # Download the required datasets

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
                        columns={"observed_mobility": "om_" + ss + "_" + mt},
                        inplace=True,
                    )
                if "si" in wntrac_npi_index.columns:
                    wntrac_npi_index.rename(
                        columns={"si": "stringency index_" + ss + "_" + mt}, inplace=True
                    )
                if "mobility_ratio" in wntrac_npi_index.columns:
                    wntrac_npi_index.rename(
                        columns={"mobility_ratio": "c_" + ss + "_" + mt}, inplace=True
                    )
                if "adherence" in wntrac_npi_index.columns:
                    wntrac_npi_index.rename(
                        columns={"adherence": "compliance score_" + ss + "_" + mt}, inplace=True
                    )
                if "npi_index" in wntrac_npi_index.columns:
                    wntrac_npi_index.rename(
                        columns={"npi_index": "npi-index_" + ss + "_" + mt}, inplace=True
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
    aggeregate_npi_index_df = aggeregate_npi_index_df.sort_values(
        by="date", ascending=True
    )
    aggeregate_npi_index_df.to_csv(
        "./data/wntrac_npi_index" + ratios_name + ".csv", index=False
    )
    return aggeregate_npi_index_df


if __name__ == "__main__":
    create_wntrac_npi_regions()
