from conftest import territories_dict
import pytest
from data_transformation import *
from data_loading import *

from conftest import *


def test_compute_wntrac_npi_index_for_a_territory(
    territories_dict,
    mobility_data,
    world_who_data,
    si_adherence_ratio="0.5/0.5",
    oxcgrt_df=None,
    wntrac_events_df=None,
    wntrac_evidences_df=None,
    wntrac_npis_types=None,
    wntrac_si_map_dict=None,
):

    # tests all the other functions in data_sdormation. Writing the tests as a end-to-end test to test all the functions below:
    # load_wntrac_events_evidences
    # map_wntrac_npis_timeseries_events_evidences
    # load_who_outcome_data
    # load_google_mobility_data
    # compute_npi_index
    # load_oxcgrt_si_data

    # Re-using this functions with the assumption that the individual tests for loading data run successfully.

    wntrac_evidences_df, wntrac_events_df = load_wntrac_npi_data()

    df = compute_wntrac_npi_index_for_a_territory(
        territories_dict,
        mobility_data,
        world_who_data,
        "0.5/0.5",
        oxcgrt_df,
        wntrac_events_df,
        wntrac_evidences_df,
        wntrac_npis_types,
        wntrac_si_map_dict,
    )

    assert isinstance(df, pd.DataFrame) and df.shape != (0, 0)
