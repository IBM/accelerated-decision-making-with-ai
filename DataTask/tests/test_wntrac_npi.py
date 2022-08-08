from wntrac_npi import create_wntrac_npi_regions

import pandas as pd


def test_create_wntrac_npi_regions(ratios_name):

    # Call the function to generate and save the csv file
    df = create_wntrac_npi_regions(ratios_name)

    assert (
        isinstance(df, pd.DataFrame)
        and df.shape != (0, 0)
        and set(["date", "deaths", "confirmed_cases"]).issubset(df.columns)
    )
