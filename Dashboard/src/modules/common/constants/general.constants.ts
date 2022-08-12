/*
 * Copyright 2022 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const SESSION_LENGTH = 36000000;
export const SESSION_LENGTH_IN_HOURS = 0.10;
export const SHORT_SESSION_LENGTH_IN_HOURS = 0.01;
export const LONG_SESSION_LENGTH_IN_HOURS = 24;
export const SNACK_BAR_DURATION = 3500;
export const SNACK_BAR_LONG_DURATION = 30000;

export const GENERIC_ERROR_MESSAGE = 'An error occurred while processing your request';
export const LOADING_ERROR_MESSAGE = 'An error occurred while updating ';
export const ERROR = 'error';
export const WARNING = 'warning';
export const KEY_TOKEN = 'token';
export const KEY_USER = 'user';

export const DROPDOWN_ITEMS_X_AXIS = [
  'Date',
  'Days Since ...'
];

export const DROPDOWN_ITEMS_X_AXIS_EXTENDED = [
  {name: 'Date', disabled: false},
  {name: 'Days Since ...', disabled: true},
];

export const DROPDOWN_ITEMS_Y_AXIS = [
  'Parasite Rate (pf)',
  'Parasite Rate (pv)',
  'Incidence Rate (pf)',
  'Incidence Rate (pv)',
  'Mortality Rate (pf)',
  'Facilities'
];

export const DROPDOWN_ITEMS_Y_AXIS_EXTENDED = [
  {name: 'Parasite Rate (pf)', disabled: false},
  {name: 'Parasite Rate (pv)', disabled: false},
  {name: 'Incidence Rate (pf)', disabled: false},
  {name: 'Incidence Rate (pv)', disabled: false},
  {name: 'Mortality Rate (pf)', disabled: false},
  {name: 'Facilities', disabled: true}
];

export const USER_ROLES = {
  admai_admin: 'Admin',
  admai_ds: 'Data Scientist',
  admai_ms: 'Modelling Scientist',
  admai_dm: 'Decision Maker',
};

export const MAP_DATA = {
  'Parasite Rate (pf)': 'PfPR_rmean',
  'Parasite Rate (pv)': 'PvPR_rmean',
  'Incidence Rate (pf)': 'pf_incidence_rate_rmean',
  'Incidence Rate (pv)': 'pv_incidence_rate_rmean',
  'Mortality Rate (pf)': 'pf_mortality_rate_rmean',
  Facilities: 'facilities',
};

export const DROPDOWN_ITEMS_Y_SCALE = [
  'Linear Scale',
  'Log Scale'
];

export const DROPDOWN_ITEMS_Y_SCALE_EXTENDED = [
  {name: 'Linear Scale', disabled: false},
  {name: 'Log Scale', disabled: true},
];

export const DROPDOWN_ITEMS_GEO = [
  'null',
  'Admin 1',
  'Admin 2'
];

export const MEASURES_DATA_POP_SIZE = [
  'None',
  'Per 100k'
];

export const MEASURES_DATA_POP_SIZE_EXTENDED = [
  {name: 'None', disabled: false},
  {name: 'Per 100k', disabled: true},
];

export const IMPORTANT_DATES = {
  start: new Date(2000, 5),
  current: new Date(2017, 5)
};

export const ZOOM_LEVELS_FOR_ADMINS_NEEDING_SPECIAL_HANDLING_OF_ZOOM = {
  SM: 10,
  YT: 10,
  GF: 7,
  FR: 5,
  US: 4,
  CN: 4,
  CA: 3,
};

export const ADMIN_0 = [
  {code: 'UGA', name: 'Uganda'},
  {code: 'TZA', name: 'Tanzania'},
  {code: 'KEN', name: 'Kenya'},
];

export const ADMIN_0_OBJECT = {
  UGA: 'Uganda',
  TZA: 'Tanzania',
  KEN: 'Kenya'
};

export const DROPDOWN_ITEMS_INDEX = [$localize`:NPI-Index|NPI-Index drop down@@npiIndexDropDown:NPI-Index`, $localize`:Compliance Score|Compliance Score drop down@@complianceScoreDropDown:Compliance Score`, $localize`:Stringency Index|Stringency Index drop down@@stringencyIndexDropDown:Stringency Index`];

export const DROPDOWN_ITEMS_MOBILITY_TYPE = [$localize`:Transit stations|Transit stations drop down@@transitStationsDropDown:Transit_stations`, $localize`:Retail and recreation|Retail and recreation drop down@@retailAndRecreationDropDown:Retail_and_recreation`, $localize`:Grocery and pharmacy|Grocery and pharmacy drop down@@groceryAndPharmacyDropDown:Grocery_and_pharmacy`,$localize`:Parks|Parks drop down@@parksDropDown:Parks`,
$localize`:Workplaces|Workplaces drop down@@workplacesDropDown:Workplaces`, $localize`:Residential|Residential drop down@@residentialDropDown:Residential`];

export const DROPDOWN_ITEMS_NPI_DATASET = ['WNTRAC', 'OxCGRT'];

export const DROPDOWN_ITEMS_GLOBAL_US = [
  'Global',
  'US'
];

export const HEADER = {
  STRINGENCY_INDEX_WNTRAC: $localize`:@@stringency.index.wntrac:stringency index_wntrac_`,
  COMPLIANCE_SCORE_WNTRAC: $localize`:@@compliance.score.wntrac:compliance score_wntrac_`,
  NPI_INDEX_WNTRAC: $localize`:@@npi.index.wntrac:npi-index_wntrac_`,
  STRINGENCY_INDEX_OXCGRT: $localize`:@@stringency.index.oxcgrt_:stringency index_oxcgrt_`,
  COMPLIANCE_SCORE_OXCGRT: $localize`:@@compliance.score.oxcgrt:compliance score_oxcgrt_`,
  NPI_INDEX_OXCGRT: $localize`:@@npi.index.oxcgrt.:npi-index_oxcgrt_`,
};

export const INDEX_DATA_KEYS = {
  confirmed_cases: 0,
  'stringency index_wntrac_workplaces': 1,
  'compliance score_wntrac_workplaces': 2,
  'npi-index_wntrac_workplaces': 3,
  'stringency index_oxcgrt_workplaces': 4,
  'compliance score_oxcgrt_workplaces': 5,
  'npi-index_oxcgrt_workplaces': 6,
  'stringency index_wntrac_retail_and_recreation': 7,
  'compliance score_wntrac_retail_and_recreation': 8,
  'npi-index_wntrac_retail_and_recreation': 9,
  'stringency index_oxcgrt_retail_and_recreation': 10,
  'compliance score_oxcgrt_retail_and_recreation': 11,
  'npi-index_oxcgrt_retail_and_recreation': 12,
  'stringency index_wntrac_grocery_and_pharmacy': 13,
  'compliance score_wntrac_grocery_and_pharmacy': 14,
  'npi-index_wntrac_grocery_and_pharmacy': 15,
  'stringency index_oxcgrt_grocery_and_pharmacy': 16,
  'compliance score_oxcgrt_grocery_and_pharmacy': 17,
  'npi-index_oxcgrt_grocery_and_pharmacy': 18,
  'stringency index_wntrac_parks': 19,
  'compliance score_wntrac_parks': 20,
  'npi-index_wntrac_parks': 21,
  'stringency index_oxcgrt_parks': 22,
  'compliance score_oxcgrt_parks': 23,
  'npi-index_oxcgrt_parks': 24,
  'stringency index_wntrac_transit_stations': 25,
  'compliance score_wntrac_transit_stations': 26,
  'npi-index_wntrac_transit_stations': 27,
  'stringency index_oxcgrt_transit_stations': 28,
  'compliance score_oxcgrt_transit_stations': 29,
  'npi-index_oxcgrt_transit_stations': 30,
  'stringency index_wntrac_residential': 31,
  'compliance score_wntrac_residential': 32,
  'npi-index_wntrac_residential': 33,
  'stringency index_oxcgrt_residential': 34,
  'compliance score_oxcgrt_residential': 35,
  'npi-index_oxcgrt_residential': 36,
};


export const APP_CONSTANTS = {
  OVERVIEW: $localize`:Overview|Overview@@overview:Overview`,
  ALGORITHMS: $localize`:Algorithms|Algorithms@@algorithms:Algorithms`,
  MODELS: $localize`:Models|Models@@models:Models`,
  EXPERIMENTS: $localize`:Experiments|Experiments@@experiments:Experiments`,
  RESULTS: $localize`:Results|Results@@results:Results`,
  APIS: $localize`:Apis|Apis@@apis:APIs`,
  HOW_TO: $localize`:How to|How to@@how_to:How to`,
  FEEDBACK: $localize`:Feedback|Feedback@@feedback:Feedback`,
};

export const FEEDBACK_CONSTANTS = {
  FEEDBACK_SUBMITTED: $localize`:@@feedback_submitted:Feedback submitted`,
  FEEDBACK_SUBMISSION_FAILED: $localize`:@@feedback_submission_failed:Feedback submission failed! Please try again.`,
};

export const LOGIN_CONSTANTS = {
  USER_ROLE_MISSING: $localize`:@@user_role_missing:User Role Missing! Contact the system admin at charles.wachira1@ibm.com.`,
  CLOSE:$localize`:@@close:Close`,
};

export const MAP_CONSTANTS = {
  NO_DATA_AVAILABLE: $localize`:@@no_data_available:No data available`,
};


