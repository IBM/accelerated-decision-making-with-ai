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
