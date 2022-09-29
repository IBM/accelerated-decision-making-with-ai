#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd 
import json
import time
import pycountry
import glob
import math
import os
import sys
from zipfile import ZipFile
from datetime import datetime
root = os.getcwd()


# ## Outome data

# In[ ]:


def isNaN(string):
    return string != string


# In[ ]:


def get_base_epoch(df):
    index = df['confirmed_cases'].ne(0).idxmax()
    value = df['dt'].loc[index]
    if isNaN(value):
        value = '2020-01-22'
    date = time.mktime(datetime.strptime(value, "%Y-%m-%d").timetuple())*1000
    return date


# In[ ]:


def get_epoch(date):
    date_entry = date.strip()
    date = time.strptime(date_entry, '%Y-%m-%d')  # e.g. 2020-01-22
    return date


# ### Global countries 

# In[ ]:


# dictionary
dictionary_data = {}
stats = {}
with open(root+'/verbose_dictionary.json') as json_file:
    dictionary_data = json.load(json_file)
with open(root+'/stats.json') as json_file:
    stats = json.load(json_file)


# In[ ]:


# CEPD Data
# making data frame
filename = '/wntrac_COS_data.csv'
    # with open(root+"/data"+filename, 'wb') as temp_file:
    #     temp_file.write(cos_data)

    # making data frame
data_frame = pd.read_csv(root+"/data"+filename)

required_column_list = ('confirmed_cases','stringency index_wntrac_workplaces','compliance score_wntrac_workplaces','npi-index_wntrac_workplaces','stringency index_oxcgrt_workplaces','compliance score_oxcgrt_workplaces','npi-index_oxcgrt_workplaces','stringency index_wntrac_retail_and_recreation','compliance score_wntrac_retail_and_recreation','npi-index_wntrac_retail_and_recreation','stringency index_oxcgrt_retail_and_recreation','compliance score_oxcgrt_retail_and_recreation','npi-index_oxcgrt_retail_and_recreation','stringency index_wntrac_grocery_and_pharmacy','compliance score_wntrac_grocery_and_pharmacy','npi-index_wntrac_grocery_and_pharmacy','stringency index_oxcgrt_grocery_and_pharmacy','compliance score_oxcgrt_grocery_and_pharmacy','npi-index_oxcgrt_grocery_and_pharmacy','stringency index_wntrac_parks','compliance score_wntrac_parks','npi-index_wntrac_parks','stringency index_oxcgrt_parks','compliance score_oxcgrt_parks','npi-index_oxcgrt_parks','stringency index_wntrac_transit_stations','compliance score_wntrac_transit_stations','npi-index_wntrac_transit_stations','stringency index_oxcgrt_transit_stations','compliance score_oxcgrt_transit_stations','npi-index_oxcgrt_transit_stations','stringency index_wntrac_residential','compliance score_wntrac_residential','npi-index_wntrac_residential','stringency index_oxcgrt_residential','compliance score_oxcgrt_residential','npi-index_oxcgrt_residential')
extra_column_list = ('population', 'deaths', 'admin', 'admin1_iso2', 'admin1_name', 'admin0_iso2', 'admin0_name', 'date')  
code_list = [data_frame['admin0_iso2'].values]

for column in data_frame:
    if column not in required_column_list and column not in extra_column_list: 
        data_frame.drop(column, axis=1, inplace=True)


# In[ ]:


# add month-year column
data_frame['dt'] = pd.to_datetime(data_frame['date'])
data_frame['month_year'] = data_frame['dt'].dt.strftime('%b-%Y')
data_frame['dt'] = data_frame['dt'].dt.strftime('%Y-%m-%d')
data_frame = data_frame.loc[data_frame['admin0_iso2'] != 'AS']

# loop through each month and create a json
months = list(data_frame.month_year.unique())
latest_epoch = 0
monthly_data = {}
for month in months:
    mask_month = (data_frame['month_year'] == month)
    this_month_df = data_frame.loc[mask_month]

    # json
    cedp_json_cases = {}
    
    def package(df_row):
        country = df_row["admin0_iso2"]

        if country not in cedp_json_cases:
            cedp_json_cases[country] = {}
            
            # Get base epoch
            mask_base_epoch = (data_frame['admin0_iso2'] == country)
            base_epoch_df = data_frame.loc[mask_base_epoch]
            base_epoch = get_base_epoch(base_epoch_df)

        # date
        date = get_epoch(df_row["dt"])
        epoch = time.mktime(date) * 1000

        # data
        cedp_json_cases[country][epoch] = [
                    df_row["confirmed_cases"],df_row["stringency index_wntrac_workplaces"],df_row["compliance score_wntrac_workplaces"],
                    df_row["npi-index_wntrac_workplaces"],df_row["stringency index_oxcgrt_workplaces"],df_row["compliance score_oxcgrt_workplaces"],
                    df_row["npi-index_oxcgrt_workplaces"],df_row["stringency index_wntrac_retail_and_recreation"],df_row["compliance score_wntrac_retail_and_recreation"],
                    df_row["npi-index_wntrac_retail_and_recreation"],df_row["stringency index_oxcgrt_retail_and_recreation"],
                    df_row["compliance score_oxcgrt_retail_and_recreation"],df_row["npi-index_oxcgrt_retail_and_recreation"],
                    df_row["stringency index_wntrac_grocery_and_pharmacy"],df_row["compliance score_wntrac_grocery_and_pharmacy"],
                    df_row["npi-index_wntrac_grocery_and_pharmacy"],df_row["stringency index_oxcgrt_grocery_and_pharmacy"],
                    df_row["compliance score_oxcgrt_grocery_and_pharmacy"],df_row["npi-index_oxcgrt_grocery_and_pharmacy"],
                    df_row["stringency index_wntrac_parks"],df_row["compliance score_wntrac_parks"],df_row["npi-index_wntrac_parks"],
                    df_row["stringency index_oxcgrt_parks"],df_row ["compliance score_oxcgrt_parks"],df_row["npi-index_oxcgrt_parks"],
                    df_row["stringency index_wntrac_transit_stations"],df_row["compliance score_wntrac_transit_stations"],df_row["npi-index_wntrac_transit_stations"],
                    df_row["stringency index_oxcgrt_transit_stations"],df_row["compliance score_oxcgrt_transit_stations"],df_row["npi-index_oxcgrt_transit_stations"],
                    df_row["stringency index_wntrac_residential"],df_row["compliance score_wntrac_residential"],df_row["npi-index_wntrac_residential"],
                    df_row["stringency index_oxcgrt_residential"],df_row["compliance score_oxcgrt_residential"],df_row["npi-index_oxcgrt_residential"]]
        
        return epoch
    
    
    countries_found = {}
    country_dictionary = {}
    for index, row in this_month_df.iterrows():
        if len(dictionary_data[row["admin0_iso2"]]) == 2:
            country_info = {
                "name": dictionary_data[row["admin0_iso2"]][1][0][0],
                "iso2": row["admin0_iso2"],
                "other": dictionary_data[row["admin0_iso2"]][1][0][1]
            }
            country_dictionary[row["admin0_iso2"]] = country_info
        else:
            country_info = {
                "name": dictionary_data[row["admin0_iso2"]][0][0][0],
                "iso2": row["admin0_iso2"],
                "other": dictionary_data[row["admin0_iso2"]][0][0][2]
            }
            country_dictionary[row["admin0_iso2"]] = country_info

        if row["admin0_iso2"] not in countries_found:

            try:
                # details = pycountry.countries.search_fuzzy(row["admin0_name"])
                details = pycountry.countries.get(alpha_2=row["admin0_iso2"])
                countries_found[row["admin0_iso2"]] = details
            except Exception:
                print("Missing "+row["admin0_name"])
        details = countries_found[row["admin0_iso2"]]
        epoch = package(row)
        
        # latest time
        if epoch > latest_epoch:
            latest_epoch = epoch
        
        
    cedp_json = cedp_json_cases
    

    # write to file
    with open(root+'/data/global-'+month+'.json', 'w') as outfile:
        json_string=json.dumps(cedp_json).replace("NaN", "0.0")
        json.dump(json.loads(json_string), outfile)
  
        
stats["latest_epoch"] = latest_epoch
stats["months"] = months
with open(root+'/data/stats8.json', 'w') as outfile:
    json.dump(stats, outfile)
