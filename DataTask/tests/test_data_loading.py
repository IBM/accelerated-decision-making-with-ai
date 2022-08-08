from conftest import *
import pytest

from data_loading import *


def test_load_territories_dict():
    d = load_territories_dict()
    assert isinstance(d, list) and bool(d)


def test_load_wntrac_npi_types_dict():
    d = load_wntrac_npi_types_dict()
    assert isinstance(d, dict) and bool(d)


def test_load_wntrac_si_map():
    d = load_wntrac_si_map()
    assert isinstance(d, pd.DataFrame)


def test_load_us_states_dict():
    d = load_us_states_dict()
    assert isinstance(d, list) and bool(d)


def test_load_mobility_data():

    df = load_mobility_data()

    assert isinstance(df, pd.DataFrame) and df.shape != (0, 0)


def test_load_wntrac_events_and_evidences_df():
    df1 = load_us_states_oxcgrt_df()
    df2 = load_world_states_oxxgrt_df()

    assert (
        isinstance(df1, pd.DataFrame)
        and df1.shape != (0, 0)
        and isinstance(df2, pd.DataFrame)
        and df2.shape != (0, 0)
    )


def test_load_us_states_who_outcome_df():
    df = load_us_states_oxcgrt_df()

    assert isinstance(df, pd.DataFrame) and df.shape != (0, 0)


def test_load_world_who_outcome_df():

    df = load_world_who_outcome_df()

    assert isinstance(df, pd.DataFrame) and df.shape != (0, 0)


def test_load_us_states_oxcgrt_df():
    df = load_us_states_oxcgrt_df()

    assert isinstance(df, pd.DataFrame) and df.shape != (0, 0)


def test_load_world_states_oxxgrt_df():
    df = load_world_states_oxxgrt_df()

    assert isinstance(df, pd.DataFrame) and df.shape != (0, 0)
