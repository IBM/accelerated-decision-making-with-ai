import pytest, os


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
