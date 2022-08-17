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
export const NO_DATA = $localize`:no data|no data@@constants.no.data:No data`;

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

const CONFIRMED_CASES = $localize`:data indices|data indices@@confirmed.cases:confirmed_cases`;
const STRINGENCY_INDEX_WNTRAC_WORKPLACES = $localize`:data indices|data indices@@constants.stringency.index.wntrac.workplaces:stringency index_wntrac_workplaces`;
const COMPLIANCE_SCORE_WNTRAC_WORKPLACES = $localize`:data indices|data indices@@constants.compliance.score.wntrac.workplaces:compliance score_wntrac_workplaces`;
const NPI_INDEX_WNTRAC_WORKPLACES = $localize`:@@constants.npi.index.wntrac.workplaces:npi-index_wntrac_workplaces`;
const STRINGENCY_INDEX_OXCGRT_WORKPLACES = $localize`:data indices|data indices@@constants.stringency.index.oxcgrt.workplaces:stringency index_oxcgrt_workplaces`;
const COMPLIANCE_SCORE_OXCGRT_WORKPLACES = $localize`:data indices|data indices@@constants.compliance.score.oxcgrt.workplaces:compliance score_oxcgrt_workplaces`;
const NPI_INDEX_OXCGRT_WORKPLACES = $localize`:data indices|data indices@@constants.npi.index.oxcgrt.workplaces:npi-index_oxcgrt_workplaces`;
const STRINGENCY_INDEX_WNTRAC_RETAIL_AND_RECREATION = $localize`:data indices|data indices@@constants.stringency.index.wntrac.retail.and.recreation:stringency index_wntrac_retail_and_recreation`;
const COMPLIANCE_SCORE_WNTRAC_RETAIL_AND_RECREATION = $localize`:data indices|data indices@@constants.compliance.score.wntrac.retail.and.recreation:compliance score_wntrac_retail_and_recreation`;
const NPI_INDEX_WNTRAC_RETAIL_AND_RECREATION = $localize`:@@constants.npi.index.wntrac.retail.and.recreation:npi-index_wntrac_retail_and_recreation`;
const STRINGENCY_INDEX_OXCGRT_RETAIL_AND_RECREATION = $localize`:data indices|data indices@@constants.stringency.index.oxcgrt.retail.and.recreation:stringency index_oxcgrt_retail_and_recreation`;
const COMPLIANCE_SCORE_OXCGRT_RETAIL_AND_RECREATION = $localize`:data indices|data indices@@constants.compliance.score.oxcgrt.retail.and.recreation:compliance score_oxcgrt_retail_and_recreation`;
const NPI_INDEX_OXCGRT_RETAIL_AND_RECREATION = $localize`:data indices|data indices@@constants.npi.index.oxcgrt.retail.and.recreation:npi-index_oxcgrt_retail_and_recreation`;
const STRINGENCY_INDEX_WNTRAC_GROCERY_AND_PHARMACY = $localize`:data indices|data indices@@constants.stringency.index.wntrac.grocery.and.pharmacy:stringency index_wntrac_grocery_and_pharmacy`;
const COMPLIANCE_SCORE_WNTRAC_GROCERY_AND_PHARMACY = $localize`:data indices|data indices@@constants.compliance.score.wntrac.grocery.and.pharmacy:compliance score_wntrac_grocery_and_pharmacy`;
const NPI_INDEX_WNTRAC_GROCERY_AND_PHARMACY = $localize`:data indices|data indices@@constants.npi.index.wntrac.grocery.and.pharmacy:npi-index_wntrac_grocery_and_pharmacy`;
const STRINGENCY_INDEX_OXCGRT_GROCERY_AND_PHARMACY = $localize`:data indices|data indices@@constants.stringency.index.oxcgrt.grocery.and.pharmacy:stringency index_oxcgrt_grocery_and_pharmacy`;
const COMPLIANCE_SCORE_OXCGRT_GROCERY_AND_PHARMACY = $localize`:data indices|data indices@@constants.compliance.score.oxcgrt.grocery.and.pharmacy:compliance score_oxcgrt_grocery_and_pharmacy`;
const NPI_INDEX_OXCGRT_GROCERY_AND_PHARMACY = $localize`:data indices|data indices@@constants.npi.index.oxcgrt.grocery.and.pharmacy:npi-index_oxcgrt_grocery_and_pharmacy`;
const STRINGENCY_INDEX_WNTRAC_PARKS = $localize`:data indices|data indices@@constants.stringency.index.wntrac.parks:stringency index_wntrac_parks`;
const COMPLIANCE_SCORE_WNTRAC_PARKS = $localize`:data indices|data indices@@constants.compliance.score.wntrac.parks:compliance score_wntrac_parks`;
const NPI_INDEX_WNTRAC_PARKS = $localize`:data indices|data indices@@constants.npi.index.wntrac.parks:npi-index_wntrac_parks`;
const STRINGENCY_INDEX_OXCGRT_PARKS = $localize`:data indices|data indices@@constants.stringency.index.oxcgrt.parks:stringency index_oxcgrt_parks`;
const COMPLIANCE_SCORE_OXCGRT_PARKS = $localize`:data indices|data indices@@constants.compliance.score.oxcgrt.parks:compliance score_oxcgrt_parks`;
const NPI_INDEX_OXCGRT_PARKS = $localize`:data indices|data indices@@constants.npi.index.oxcgrt.parks:npi-index_oxcgrt_parks`;
const STRINGENCY_INDEX_WNTRAC_TRANSIT_STATIONS = $localize`:data indices|data indices@@constants.stringency.index.wntrac.transit.stations:stringency index_wntrac_transit_stations`;
const COMPLIANCE_SCORE_WNTRAC_TRANSIT_STATIONS = $localize`:data indices|data indices@@constants.compliance.score.wntrac.transit.stations:compliance score_wntrac_transit_stations`;
const NPI_INDEX_WNTRAC_TRANSIT_STATIONS = $localize`:data indices|data indices@@constants.npi.index.wntrac.transit.stations:npi-index_wntrac_transit_stations`;
const STRINGENCY_INDEX_OXCGRT_TRANSIT_STATIONS = $localize`:data indices|data indices@@constants.stringency.index.oxcgrt.transit.stations:stringency index_oxcgrt_transit_stations`;
const COMPLIANCE_SCORE_OXCGRT_TRANSIT_STATIONS = $localize`:data indices|data indices@@constants.compliance.score.oxcgrt.transit.stations:compliance score_oxcgrt_transit_stations`;
const NPI_INDEX_OXCGRT_TRANSIT_STATIONS = $localize`:data indices|data indices@@constants.npi.index.oxcgrt.transit.stations:npi-index_oxcgrt_transit_stations`;
const STRINGENCY_INDEX_WNTRAC_RESIDENTIAL = $localize`:data indices|data indices@@constants.stringency.index.wntrac.residential:stringency index_wntrac_residential`;
const COMPLIANCE_SCORE_WNTRAC_RESIDENTIAL = $localize`:data indices|data indices@@constants.compliance.score.wntrac.residential:compliance score_wntrac_residential`;
const NPI_INDEX_WNTRAC_RESIDENTIAL = $localize`:data indices|data indices@@constants.npi.index.wntrac.residential:npi-index_wntrac_residential`;
const STRINGENCY_INDEX_OXCGRT_RESIDENTIAL = $localize`:data indices|data indices@@constants.stringency.index.oxcgrt.residential:stringency index_oxcgrt_residential`;
const COMPLIANCE_SCORE_OXCGRT_RESIDENTIAL = $localize`:data indices|data indices@@constants.compliance.score.oxcgrt.residential:compliance score_oxcgrt_residential`;
const NPI_INDEX_OXCGRT_RESIDENTIAL = $localize`:data indices|data indices@@constants.npi.index.oxcgrt.residential:npi-index_oxcgrt_residential`;

export const INDEX_DATA_KEYS = {};
INDEX_DATA_KEYS[CONFIRMED_CASES] = 0;
INDEX_DATA_KEYS[STRINGENCY_INDEX_WNTRAC_WORKPLACES] = 1;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_WNTRAC_WORKPLACES] = 2;
INDEX_DATA_KEYS[NPI_INDEX_WNTRAC_WORKPLACES] = 3;
INDEX_DATA_KEYS[STRINGENCY_INDEX_OXCGRT_WORKPLACES] = 4;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_OXCGRT_WORKPLACES] = 5;
INDEX_DATA_KEYS[NPI_INDEX_OXCGRT_WORKPLACES] = 6;
INDEX_DATA_KEYS[STRINGENCY_INDEX_WNTRAC_RETAIL_AND_RECREATION] = 7;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_WNTRAC_RETAIL_AND_RECREATION] = 8;
INDEX_DATA_KEYS[NPI_INDEX_WNTRAC_RETAIL_AND_RECREATION] = 9;
INDEX_DATA_KEYS[STRINGENCY_INDEX_OXCGRT_RETAIL_AND_RECREATION] = 10;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_OXCGRT_RETAIL_AND_RECREATION] = 11;
INDEX_DATA_KEYS[NPI_INDEX_OXCGRT_RETAIL_AND_RECREATION] = 12;
INDEX_DATA_KEYS[STRINGENCY_INDEX_WNTRAC_GROCERY_AND_PHARMACY] = 13;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_WNTRAC_GROCERY_AND_PHARMACY] = 14;
INDEX_DATA_KEYS[NPI_INDEX_WNTRAC_GROCERY_AND_PHARMACY] = 15;
INDEX_DATA_KEYS[STRINGENCY_INDEX_OXCGRT_GROCERY_AND_PHARMACY] = 16;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_OXCGRT_GROCERY_AND_PHARMACY] = 17;
INDEX_DATA_KEYS[NPI_INDEX_OXCGRT_GROCERY_AND_PHARMACY] = 18;
INDEX_DATA_KEYS[STRINGENCY_INDEX_WNTRAC_PARKS] = 19;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_WNTRAC_PARKS] = 20;
INDEX_DATA_KEYS[NPI_INDEX_WNTRAC_PARKS] = 21;
INDEX_DATA_KEYS[STRINGENCY_INDEX_OXCGRT_PARKS] = 22;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_OXCGRT_PARKS] = 23;
INDEX_DATA_KEYS[NPI_INDEX_OXCGRT_PARKS] = 24;
INDEX_DATA_KEYS[STRINGENCY_INDEX_WNTRAC_TRANSIT_STATIONS] = 25;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_WNTRAC_TRANSIT_STATIONS] = 26;
INDEX_DATA_KEYS[NPI_INDEX_WNTRAC_TRANSIT_STATIONS] = 27;
INDEX_DATA_KEYS[STRINGENCY_INDEX_OXCGRT_TRANSIT_STATIONS] = 28;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_OXCGRT_TRANSIT_STATIONS] = 29;
INDEX_DATA_KEYS[NPI_INDEX_OXCGRT_TRANSIT_STATIONS] = 30;
INDEX_DATA_KEYS[STRINGENCY_INDEX_WNTRAC_RESIDENTIAL] = 31;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_WNTRAC_RESIDENTIAL] = 32;
INDEX_DATA_KEYS[NPI_INDEX_WNTRAC_RESIDENTIAL] = 33;
INDEX_DATA_KEYS[STRINGENCY_INDEX_OXCGRT_RESIDENTIAL] = 34;
INDEX_DATA_KEYS[COMPLIANCE_SCORE_OXCGRT_RESIDENTIAL] = 35;
INDEX_DATA_KEYS[NPI_INDEX_OXCGRT_RESIDENTIAL] = 36;


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


