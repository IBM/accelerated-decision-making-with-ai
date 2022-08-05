import pandas as pd
import numpy as np
import copy
from datetime import datetime, timedelta

from switcher import *


def compute_wntrac_npi_index_for_a_territory(
    target,
    mobility_data_df,
    who_outcome_df,
    si_adherence_ratio="0.5/0.5",
    oxcgrt_df=None,
    wntrac_events_df=None,
    wntrac_evidences_df=None,
    wntrac_npi_types_dict=None,
    wntrac_si_map=None,
):
    """The purpose of this function is to get all the inputs for wntrac npi index computation and call the relevant methods
    and return the index results to the consumer. The inputs to this function are as below:
       Args:
           target (obj): an object containing all identity info for the target location:
                         a. admin0_iso_name: ISO name for the country
                         b. admin0_iso2: ISO 2 code for the country
                         c. admin0_iso3: ISO 3 code for the country
                         d. admin1_iso_name: ISO name for the state
                         e. admin1_iso2: ISO 2 code for the state
                         g. admin1_iso3: ISO 3 code for the state
           mobility_data_df (pd.DataFrame): google mobility data
           who_outcome_df (pd.DataFrame): who outcome data for either the world countries or us states
           si_adherence_ratio (float, optional): _description_. Defaults to "0.5/0.5".
           oxcgrt_df (pd.DataFrame , optional): OxCGRT SI data for either the world countries or us states. Defaults to None.
           wntrac_events_df (pd.DataFrame, optional): WNTRAC events data. Defaults to None.
           wntrac_evidences_df (pd.DataFrame, optional): WNTRAC evidences data. Defaults to None.
           wntrac_npi_types_dict (dict(), optional): wntrac npi types dictionary. Defaults to None.
           wntrac_si_map (dict(), optional): wntrac customised mapping of the WNTRAC NPIs to the Stringency Index formulation
                         NB: a. if param 4 is provided 5, 6, 7 & 8 are not required and OxCGRT SI will be used
                             b. if params 5, 6, 7 & 8 are provided and 4 is not provided, WNTRAC SI will be used
                             c. if all params 4, 5, 6, 7, & 8 are provided OxCGRT SI will be used
                             d. if param 4 and all 5, 6, 7, & 8 are not provided the function will not compute the index. Defaults to None.

       Returns:
           wntrac_npi_index: WNTRAC NPI Index
    """
    if oxcgrt_df is not None:
        si_df = load_oxcgrt_si_data(
            oxcgrt_df, target["admin0_iso3"], target["admin1_iso2"]
        )
    elif (
        (wntrac_events_df is not None)
        & (wntrac_evidences_df is not None)
        & (wntrac_npi_types_dict is not None)
        & (wntrac_si_map is not None)
    ):
        this_wntrac_events_evidences_df = load_wntrac_events_evidences(
            wntrac_events_df,
            wntrac_evidences_df,
            wntrac_npi_types_dict,
            target["admin0_iso3"],
            target["admin1_iso3"],
        )
        si_df = map_wntrac_npis_timeseries_events_evidences(
            this_wntrac_events_evidences_df, wntrac_si_map, target
        )
    elif (target is None or mobility_data_df is None) or (who_outcome_df is None):
        print("missing required input data!!!")
        return pd.DataFrame()
    else:
        print("missing npi data!!!")
        return pd.DataFrame()
    this_mobility_df = load_google_mobility_data(
        mobility_data_df,
        target["mob_type"],
        target["admin0_iso2"],
        target["admin1_iso_name"],
    )
    this_outcome_df = load_who_outcome_data(
        who_outcome_df, target["admin0_iso2"], target["admin1_iso2"]
    )
    wntrac_npi_index = compute_npi_index(
        si_df, this_mobility_df, this_outcome_df, si_adherence_ratio
    )
    return wntrac_npi_index


def load_google_mobility_data(
    google_mobility_raw_df: pd.DataFrame,
    mob_type,
    admin0_iso2_code: str,
    admin1_iso_name: str = None,
):
    """The purpose of the function load_google_mobility_data is to extract mobility data from the Google Mobility Dataset specific to some country/state after simplifying names of some columns.

    Args:
        google_mobility_raw_df (pd.DataFrame): google mobility data frame
        mob_type (_type_):  _description_
        admin0_iso2_code (str): ISO2 code of the country (Ex: 'US')
        admin1_iso_name (str, optional): ISO name of the state/province i.e. admin1 (Ex: 'New York'). Defaults to None.

    Returns:
        pd.DataFrame:  mobility dataframe for the country/state passed in as input
    """
    google_mobility_raw_df["date"] = pd.to_datetime(
        google_mobility_raw_df["date"]
    )  # convert data from string to datetime
    google_mobility_df = google_mobility_raw_df.dropna(
        thresh=2
    )  # if 2 columns contains nan's then drop row

    # Fetch data for the selected state
    if admin1_iso_name is not None:
        google_data_mask = (
            google_mobility_df["country_region_code"] == admin0_iso2_code
        ) & (google_mobility_df["sub_region_1"] == admin1_iso_name)
        google_mobility_admin_df = google_mobility_df.loc[google_data_mask]
    else:
        google_data_mask = (
            google_mobility_df["country_region_code"] == admin0_iso2_code
        ) & (google_mobility_df["sub_region_1"].isnull())
        google_mobility_admin_df = google_mobility_df.loc[google_data_mask]
    google_mobility_admin_mean_df = (
        google_mobility_admin_df.groupby("date").mean().reset_index()
    )

    # Smoothen the workplace data as it is used in the NPI_Index computation
    if google_mobility_admin_mean_df.empty:
        google_mobility_admin_mean_df["workplaces_30"] = google_mobility_admin_mean_df[
            mob_type
        ]
    else:
        google_mobility_admin_mean_df["workplaces_30"] = google_mobility_admin_mean_df[
            mob_type
        ].transform(lambda x: x.ewm(span=30).mean())
        google_mobility_admin_mean_df["workplaces_30"] = google_mobility_admin_mean_df[
            "workplaces_30"
        ].clip(upper=0)
    return google_mobility_admin_mean_df


def load_who_outcome_data(
    who_outcome_df: pd.DataFrame,
    admin0_ISO2_code: pd.DataFrame,
    admin1_ISO2_code: str = None,
):
    """The purpose of the function is to filter all the who outcome data and return the data specific to a state.

    Args:
        who_outcome_df (pd.DataFrame): outcome data from who 2
        admin0_ISO2_code (pd.DataFrame): ISO3 code of the country ( Ex: 'US')
        admin1_ISO2_code (str, optional): SO3 code of the country ( Ex: 'US'). Defaults to None.

    Returns:
        pd.DataFrame : Outcome data for the country/state passed in as input
    """
    if admin1_ISO2_code is not None:
        admin_outcome = who_outcome_df.loc[
            (who_outcome_df["country_id"] == admin0_ISO2_code)
            & (who_outcome_df["province_id"] == admin1_ISO2_code)
        ]
    else:
        admin_outcome = who_outcome_df.loc[
            who_outcome_df["country_id"] == admin0_ISO2_code
        ]
    admin_outcome.rename(columns={"dt": "date"}, inplace=True)
    admin_outcome["date"] = pd.to_datetime(admin_outcome["date"])
    admin_outcome = admin_outcome[["date", "deaths", "confirmed_cases"]]
    return admin_outcome


def compute_npi_index(
    this_state_si_df: pd.DataFrame,
    this_state_mob_df: pd.DataFrame,
    this_state_outcome_df: pd.DataFrame,
    si_adherence_ratio: float,
):
    """NPI Index computation

    Args:
        this_state_si_df (pd.DataFrame): WNTRAC/OxCGRT stringency index dataframe
        this_state_mob_df (pd.DataFrame): google mobility data as provided by Google and filtered for the selected location
        this_state_outcome_df (pd.DataFrame): who state outcome dataframe
        si_adherence_ratio (float): _description_

    Returns:
        pd.DataFrame: NPI_Index with the SI and Adherence components in a dataframe
    """
    min_dates = []
    max_dates = []

    # Curate stringency data
    this_state_si_df.rename(columns={"Date": "date"}, inplace=True)
    this_state_si_df.rename(columns={"StringencyIndex": "si"}, inplace=True)
    this_state_si_df = this_state_si_df[["date", "si"]]
    this_state_si_df = this_state_si_df[this_state_si_df["si"].notna()]
    this_state_si_df = this_state_si_df[this_state_si_df["si"] != 0]
    this_state_si_df["date"] = pd.to_datetime(this_state_si_df["date"])
    this_state_si_df = this_state_si_df.sort_values(by="date")
    if this_state_si_df.empty:
        print("missing stringency data!!!")
    #         return pd.DataFrame()
    else:
        min_dates.append(this_state_si_df["date"].iloc[0])
        max_dates.append(this_state_si_df["date"].iloc[-1])

    # Curate mobility data
    this_state_mob_df.rename(
        columns={"workplaces_30": "observed_mobility"}, inplace=True
    )
    this_state_mob_df = this_state_mob_df[["date", "observed_mobility"]]
    this_state_mob_df = this_state_mob_df[
        this_state_mob_df["observed_mobility"].notna()
    ]
    this_state_mob_df["date"] = pd.to_datetime(this_state_mob_df["date"])
    this_state_mob_df = this_state_mob_df.sort_values(by="date")
    if this_state_mob_df.empty:
        print("missing mobility data!!!")
    #         return pd.DataFrame()
    else:
        min_dates.append(this_state_mob_df["date"].iloc[0])
        max_dates.append(this_state_mob_df["date"].iloc[-1])

    # Curate outcome data
    if this_state_outcome_df.empty:
        print("missing outcome data!!!")
    #         return pd.DataFrame()
    this_state_outcome_df["date"] = pd.to_datetime(this_state_outcome_df["date"])

    outcome_mob_df = pd.merge(
        this_state_outcome_df, this_state_mob_df, on=["date"], how="left"
    )
    outcome_mob_si_df = pd.merge(
        outcome_mob_df, this_state_si_df, on=["date"], how="left"
    )

    outcome_mob_si_mask = (outcome_mob_si_df["date"] >= max(min_dates)) & (
        outcome_mob_si_df["date"] <= min(max_dates)
    )
    outcome_mob_si_df = outcome_mob_si_df.loc[outcome_mob_si_mask]

    if (not "observed_mobility" in outcome_mob_si_df.columns) or (
        not "si" in outcome_mob_si_df.columns
    ):
        return outcome_mob_si_df

    mobility_obs = outcome_mob_si_df["observed_mobility"].tolist()
    si_val = outcome_mob_si_df["si"].tolist()
    np.vstack(si_val)
    H = np.c_[si_val, np.ones(len(si_val))]
    try:
        params = ((np.linalg.inv(H.T @ H)) @ H.T) @ np.vstack(mobility_obs)
    except np.linalg.LinAlgError as err:
        print(err)
        return pd.DataFrame()
    outcome_mob_si_df["anticipated_mobility"] = (
        params[0][0] * outcome_mob_si_df["si"]
    ) + params[1][0]
    outcome_mob_si_df["mobility_ratio"] = (
        outcome_mob_si_df["anticipated_mobility"]
        - outcome_mob_si_df["observed_mobility"]
    ) / abs(outcome_mob_si_df["anticipated_mobility"])

    # outcome_mob_si_df['mobility_ratio'] = outcome_mob_si_df['mobility_ratio'].apply(lambda x: 0 if ((x > 0) or (x < -1)) else x)
    outcome_mob_si_df["mobility_ratio"] = np.clip(
        outcome_mob_si_df["mobility_ratio"], -1, 0
    )

    outcome_mob_si_df["adherence"] = np.clip(
        (np.exp(outcome_mob_si_df["mobility_ratio"]) - np.exp(-1)) / (1 - np.exp(-1)),
        0,
        1,
    )
    # outcome_mob_si_df['adherence'] = ((outcome_mob_si_df['compliance']-0.5379)/(1-0.5379))
    si_adherence_ratio_array = si_adherence_ratio.split("/")
    outcome_mob_si_df["npi_index"] = (
        float(si_adherence_ratio_array[0]) * outcome_mob_si_df["si"]
    ) + (float(si_adherence_ratio_array[1]) * outcome_mob_si_df["adherence"] * 100)
    return outcome_mob_si_df


def load_oxcgrt_si_data(
    oxcgrt_df: pd.DataFrame, admin0_ISO3_code: str, admin1_ISO2_code: str = None
):
    """The purpose of this function is to filter OxCGRT SI data for a given territory.

    Args:
        oxcgrt_df (pd.DataFrame): contains all the SI data
        admin0_ISO3_code (str): ISO3 code of the country (Ex: 'USA')
        admin1_ISO2_code (str, optional): ISO2 code of the state/province i.e. admin1 (Ex: 'US_NY'). Defaults to None.

    Returns:
        pd.DataFrame: OxCGRT SI data for the country/state passed in as input
    """
    oxcgrt_df = oxcgrt_df.fillna(0)
    if admin1_ISO2_code is not None:
        modified_code = admin1_ISO2_code.replace("-", "_")
        admin_npis = oxcgrt_df.loc[
            (oxcgrt_df["CountryCode"] == admin0_ISO3_code)
            & (oxcgrt_df["RegionCode"] == modified_code)
        ]
    else:
        admin_npis = oxcgrt_df.loc[
            (oxcgrt_df["CountryCode"] == admin0_ISO3_code)
            & (oxcgrt_df["RegionCode"] == 0)
        ]
    admin_npis["Date"] = pd.to_datetime(admin_npis["Date"])
    admin_npis = admin_npis[["Date", "StringencyIndex"]]
    return admin_npis


def load_wntrac_events_evidences(
    wntrac_events_df: pd.DataFrame,
    wntrac_evidences_df: pd.DataFrame,
    wntrac_npi_types_dict: dict(),
    admin0_ISO3_code: str,
    admin1_ISO3_code: str = None,
):
    """The purpose of the function load_wntrac_events_evidences is to merge the WNTRAC events and evidences and filter
    them for a given location.

    Args:
        wntrac_events_df (pd.DataFrame): wntrac events data frame
        wntrac_evidences_df (pd.DataFrame): wntrac evidences data frame
        wntrac_npi_types_dict (dict): wntrac npi types dictionary
        admin0_ISO3_code (str): admin0_ISO3_code: ISO3 code of the country (Ex: 'USA')
        admin1_ISO3_code (_type_, optional): ISO3 code of the state/province i.e. admin1 (Ex: 'USA-NY'). Defaults to None:str.

    Returns:
        pd.DataFrame: NPIs events & evidences for the country/state passed in as input
    """
    evidences_df = wntrac_evidences_df[["even_id", "text", "fine_grained_location"]]
    evidences_df["fine_grained_location"] = evidences_df[
        "fine_grained_location"
    ].astype(str)
    evidences_grouped_df = (
        evidences_df.groupby(["even_id"])["text", "fine_grained_location"]
        .agg("|".join)
        .reset_index()
    )
    npis_events_evidences_df = pd.merge(
        wntrac_events_df, evidences_grouped_df, on=["even_id"]
    )

    admin_npis = npis_events_evidences_df.loc[
        npis_events_evidences_df["country"] == admin0_ISO3_code
    ]
    if admin1_ISO3_code is not None:
        admin_npis = admin_npis[admin_npis["state/province"].notna()]
        admin_npis = admin_npis.loc[admin_npis["state/province"] == admin1_ISO3_code]
    else:
        admin_npis = admin_npis.loc[admin_npis["state/province"].isnull()]
    admin_npis["date"] = pd.to_datetime(admin_npis["date"])
    admin_npis["id"] = [wntrac_npi_types_dict[item] for item in admin_npis["type"]]
    return admin_npis


def map_wntrac_npis_timeseries_events_evidences(
    state_npis: pd.DataFrame, wntrac_si_map: dict(), target_admin: dict()
):
    """The purpose of this function is to map the input WNTRAC events and evidences csvs in to a continuous timeseries
    events with each day's stringency index computed.

       Args:
           state_npis (pd.DataFrame): wntrac events and evidences csv data
           wntrac_si_map (dict): wntrac customised mapping of the WNTRAC NPIs to the Stringency Index formulation
           target_admin (dict): targeted regions details, see example section for details

       Returns:
           pd.DataFrame : csvs in to a continuous timeseries events with each day's stringency index computed.
    """
    types = list(wntrac_si_map.indicator.unique())
    switch = Switcher()
    data_list = []
    start_date = datetime.strptime("2020-01-01", "%Y-%m-%d")
    end_date = datetime.strptime(datetime.now().strftime("%Y-%m-%d"), "%Y-%m-%d")
    delta = timedelta(days=1)
    new_state = True
    while start_date <= end_date:
        date_mask = state_npis["date"] == start_date
        date_npis = state_npis.loc[date_mask]
        if date_npis.empty and new_state == False:
            row = copy.deepcopy(data_list[-1])
            row["Date"] = start_date
        elif date_npis.empty and new_state == True:
            row = {
                "Date": start_date,
                "CountryName": target_admin["admin0_iso_name"],
                "CountryCode": target_admin["admin0_iso3"],
                "RegionName": target_admin["admin1_iso_name"],
                "RegionCode": target_admin["admin1_iso2"],
            }
            for tp in types:
                row[tp] = 0
                row[tp + "_Flag"] = 0
                row[tp + "_Notes"] = ""
        elif not date_npis.empty:
            row = {
                "Date": start_date,
                "CountryName": target_admin["admin0_iso_name"],
                "CountryCode": target_admin["admin0_iso3"],
                "RegionName": target_admin["admin1_iso_name"],
                "RegionCode": target_admin["admin1_iso2"],
            }
            for tp in types:
                type_mask = date_npis["id"] == tp
                type_npis = date_npis.loc[type_mask]
                if type_npis.empty:
                    if new_state:
                        row[tp] = 0
                        row[tp + "_Flag"] = 0
                        row[tp + "_Notes"] = ""
                    else:
                        last_row = copy.deepcopy(data_list[-1])
                        row[tp] = int(last_row[tp])
                        row[tp + "_Flag"] = int(last_row[tp + "_Flag"])
                        row[tp + "_Notes"] = str(last_row[tp + "_Notes"])
                else:
                    if int(type_npis.iloc[0]["restriction"]) == 1:
                        row[tp] = switch.indirect(tp, type_npis.iloc[0]["value"])
                        row[tp + "_Flag"] = switch.indirect(
                            "targeted", type_npis.iloc[0]["fine_grained_location"]
                        )
                        row[tp + "_Notes"] = type_npis.iloc[0]["text"]
                    else:
                        row[tp] = 0
                        row[tp + "_Flag"] = 0
                        row[tp + "_Notes"] = ""
        data_list.append(row)
        start_date += delta
        new_state = False
    new_df = pd.DataFrame(data=data_list)
    si_df = generic_compute_stringency_index(new_df, wntrac_si_map, len(types))
    si_df.rename(columns={"si": "StringencyIndex"}, inplace=True)
    si_df["Date"] = pd.to_datetime(si_df["Date"])
    return si_df


def generic_compute_stringency_index(
    npis_df: pd.DataFrame,
    si_map: dict(),
    N: int,
):
    """The purpose of this function is to compute the stringency index as defined by oxford paper
    https://www.bsg.ox.ac.uk/sites/default/files/2020-09/BSG-WP-2020-032-v7.0.pdf

        Args:
            npis_df (pd.DataFrame): timeseries npis data from wntrac or oxford
            si_map (dict): a map of the different NPIs considered in the computation of the si index including the scoring
            N (int): Number of NPIs considered in the computation of the SI index

        Returns:
            pd.DataFrame: DataFrame with Stringency Index as defined by oxford paper
    """

    types = list(si_map.indicator.unique())
    for index, tp in enumerate(types):
        filter_col = [col for col in npis_df if col.startswith(tp)]
        map_mask = si_map["indicator"] == tp
        this_map = si_map.loc[map_mask]
        if this_map.iloc[0]["flag"] == 1:
            score = 100 * (
                (
                    npis_df[filter_col[0]]
                    - (0.5 * (this_map.iloc[0]["flag"] - npis_df[filter_col[1]]))
                )
                / (this_map.iloc[0]["max_value"])
            )
        else:
            score = 100 * ((npis_df[filter_col[0]]) / (this_map.iloc[0]["max_value"]))
        score = score.mask(score.lt(0), 0)
        if index == 0:
            npis_df["si"] = score
        else:
            npis_df["si"] = npis_df["si"] + score
    npis_df["si"] = npis_df["si"] / N
    return npis_df
