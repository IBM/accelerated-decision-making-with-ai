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

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {
  OverviewControlPanelParameters,
  Location,
  DataRepositoryConfiguration,
  Policy,
  Executor,
  Experiments,
  Task, User, UsersResponseWrap, MetadataDetails, ResultsRequest, Feedback, Algorithms
} from '../../models';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';

export const API_URL = `api`;
export const FEEDBACK_API = `${API_URL}/feedback`;
export const ADMIN1_GEOJSON_API = `assets/data/geojson/`;
export const WORLD_GEOJSON_API = `assets/data/geojson/world.json`;
export const GLOBAL_MAP_DATA_API = `assets/data/outcome/map.json`;
export const HOSPITALISATION_DATA_API = `assets/data/outcome/ug_facilities.json`;
export const ALL_MODELS_DATA_API = `assets/data/demo/all_models.json`;
export const ALL_REWARD_FUNCTION_DATA_API = `assets/data/demo/all_reward_functions.json`;
export const ALL_LOCATIONS_DATA_API = `assets/data/demo/all_locations.json`;
export const ALL_EXPERIMENTS_DATA_API = `assets/data/demo/all_experiments.json`;
export const ALL_RESULTS_DATA_API = `assets/data/demo/all_favorites.json`;
export const MUSPH_UGANDA_RESULTS_NEW_DATA_API = `assets/data/demo/musph_uganda.json`;
export const ALL_RESULTS_NEW_DATA_API = `assets/data/demo/all_results_new.json`;
export const GET_EXECUTOR_TYPE = `${API_URL}/executor/executorType?executorType=`;
export const POST_EXECUTOR_TYPE = `${API_URL}/executor?executorType=`;
export const UPDATE_EXECUTOR_TYPE = `${API_URL}/executor/`;
export const POST_LOCATION_API = `${API_URL}/location`;
export const UPDATE_LOCATION_API = `${API_URL}/location/`;
export const LOCATIONS_API = `${API_URL}/location`;
export const LOCATIONS_DATA_API = `${API_URL}/locationData/`;
export const LOCATIONS_ADMIN_LEVEL_API = `${API_URL}/location/`;
export const POST_LOCATION_DATA_API = `${API_URL}/locationData/`;
export const GET_EXPERIMENTS_DATA_API = `${API_URL}/experiments`;
export const POST_TASK_API = `${API_URL}/task`;
export const POST_EXPERIMENT_API = `${API_URL}/experiments/`;
export const USERS_API = `assets/data/demo/users.json`;
export const GET_METADATA_DETAILS = `${API_URL}/metadataDetails/`;
export const MONTHLY_DATA = `assets/data/outcome/monthly/`;
export const STATS_API = `assets/data/outcome/monthly/stats.json`;
export const POST_RESULTS_REQUEST = `${API_URL}/resultsrequest`;
export const GET_RESULTS_REQUEST_STATUS = `${API_URL}/resultsrequest/status/`;
export const ALGORITHMS = `${API_URL}/algorithms`;

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  headers = new HttpHeaders()
    .set('Accept', 'application/json');
  private DOMAIN: string;

  constructor(private httpClient: HttpClient) {}

  setDomain(domain: string) {
    this.DOMAIN = domain;
  }

  postFeedback(feedback: Feedback) {
    return this.httpClient.post(`${FEEDBACK_API}`, feedback,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  public loadSelectedCountryAdminxGeoJson(admin, ocp?: OverviewControlPanelParameters) {
    if (environment.AVAILABLE_ADMIN1_GEOJSON.includes(ocp.admin0)) {
      const fileName = ocp.admin0.toLowerCase() + '_admin' + '' + ocp.adminLevel;
      const parent = 'ADMIN' + '' + (ocp.adminLevel - 1);
      return this.httpClient.get(`${ADMIN1_GEOJSON_API}${fileName}.json`, {headers: this.headers})
        .pipe(map((response => {
          response['features'] = response['features'].filter(feature => feature.properties[parent] === admin);
          return response;
        })));
    } else {
      return of(null);
    }
  }

  public loadSelectedCountryAdmin1GeoJson(ocp) {
    if (environment.AVAILABLE_ADMIN1_ISO2_GEOJSON.includes(ocp.admin0)) {
      const fileName = ocp.admin0.toLowerCase() + '_admin' + '' + ocp.adminLevel;
      return this.httpClient.get(`${ADMIN1_GEOJSON_API}${fileName}.json`, {headers: this.headers})
        .pipe(map((response => {
          return response;
        })));
    } else {
      return of(null);
    }
  }

  public loadWorldGeoJson() {
    return this.httpClient.get(`${WORLD_GEOJSON_API}`, {headers: this.headers})
      .pipe(map((response => {
        return response;
      })));
  }

  public loadGlobalMapData() {
    return this.httpClient.get(`${GLOBAL_MAP_DATA_API}`, {headers: this.headers})
      .pipe(map((response => {
        return response;
      })));
  }

  public loadFacilitiesData() {
    return this.httpClient.get(`${HOSPITALISATION_DATA_API}`, {headers: this.headers})
      .pipe(map((response => {
        return response;
      })));
  }

  getAllModels(exempt?: boolean): Observable<Executor[]> {
    return this.httpClient.get<Executor[]>(`${GET_EXECUTOR_TYPE}WHITE_BOX_MODEL`, {headers: this.headers})
      .pipe(map((response => {
        if (!isNotNullOrUndefined(response) || !isNotNullOrUndefined(response['entity'])) { return []; }
        return response['entity'];
      })));
  }

  getAllAlgorithms(): Observable<Algorithms[]> {
    return this.httpClient.get<Algorithms[]>(`${ALGORITHMS}`, {headers: this.headers})
      .pipe(map((response => {
        if (!isNotNullOrUndefined(response) || !isNotNullOrUndefined(response['entity'])) { return []; }
        return response['entity'];
      })));
  }

  postAlgorithm(algorithm: Algorithms) {
    return this.httpClient.post(`${ALGORITHMS}`, algorithm,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  updateAlgorithm(id: string, algorithm: Algorithms) {
    return this.httpClient.put(`${ALGORITHMS}` + `/` + id, algorithm,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  getLocationData(adminlevel: string, executorId: string, country: string, levelname: string): Observable<Location[]> {
    return this.httpClient.get<Location[]>(`${LOCATIONS_DATA_API}` + adminlevel + '/' + executorId + '/' + country + '/' + levelname,
      {headers: this.headers})
      .pipe(map((response => {
        if (!isNotNullOrUndefined(response) || !isNotNullOrUndefined(response['entity'])) { return []; }
        return response['entity'].map(locationData => {
          const loc: Location = locationData.location;
          loc.locationDataId = locationData.id;
          return loc;
        });
      })));
  }

  getLocationsGivenAdminLevel(adminlevel: string, country: string, levelname: string): Observable<Location[]> {
    return this.httpClient.get<Location[]>(`${LOCATIONS_ADMIN_LEVEL_API}` + adminlevel + '/' + country + '/' + levelname,
      {headers: this.headers})
      .pipe(map((response => {
        if (!isNotNullOrUndefined(response) || !isNotNullOrUndefined(response['entity'])) { return []; }
        return response['entity'];
      })));
  }

  postModel(model: Executor) {
    return this.httpClient.post(`${POST_EXECUTOR_TYPE}WHITE_BOX_MODEL`, model,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  updateModel(id: string, model: Executor) {
    return this.httpClient.put(`${UPDATE_EXECUTOR_TYPE}` + id + '?executorType=WHITE_BOX_MODEL', model,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  postRewardFunction(rewardFunction: Executor) {
    return this.httpClient.post(`${POST_EXECUTOR_TYPE}ENVIRONMENT`, rewardFunction,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  updateRewardFunction(id: string, rewardFunction: Executor) {
    return this.httpClient.put(`${UPDATE_EXECUTOR_TYPE}` + id + '?executorType=ENVIRONMENT', rewardFunction,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  postLocation(location: Location) {
    return this.httpClient.post(`${POST_LOCATION_API}`, location,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  updateLocation(id: string, location: Location) {
    return this.httpClient.put(`${UPDATE_LOCATION_API}` + id, location,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  verifyAndUploadLocationData(locationId: string, modelId: string, iso2code: string) {
    return this.httpClient.get(`${POST_LOCATION_DATA_API}` + locationId + '/' + modelId + '/' + iso2code, {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  getAllExperiments(): Observable<Experiments[]> {
    return this.httpClient.get<Experiments[]>(`${GET_EXPERIMENTS_DATA_API}`, {headers: this.headers})
      .pipe(map((response => {
        if (!isNotNullOrUndefined(response) || !isNotNullOrUndefined(response['entity'])) { return []; }
        return response['entity'];
      })));
  }

  getAllFavoriteResults(): Observable<Policy[]> {
    return this.httpClient.get<Policy[]>(`${ALL_RESULTS_DATA_API}`, {headers: this.headers})
      .pipe(map((response => {
        return response;
      })));
  }

  getAllResultsNew(modelName: string, locationName: string): Observable<any> {
    if (modelName === 'MUSPH Model' && locationName === 'Uganda') {
      return this.httpClient.get(`${MUSPH_UGANDA_RESULTS_NEW_DATA_API}`, {headers: this.headers})
        .pipe(map((response => {
          return response;
        })));
    } else {
      return this.httpClient.get(`${ALL_RESULTS_NEW_DATA_API}`, {headers: this.headers})
        .pipe(map((response => {
          return response;
        })));
    }
  }

  postTask(task: Task) {
    return this.httpClient.post(`${POST_TASK_API}`, task,
      {headers: this.headers})
      .pipe(map(response => {
        return response['entity'];
      }));
  }

  postExperiment(experiment: Experiments, returnDuplicates: boolean) {
    return this.httpClient.post(`${POST_EXPERIMENT_API}` + returnDuplicates, experiment,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<UsersResponseWrap>(`${USERS_API}`,
      {headers: this.headers})
      .pipe(map((response => {
        return response.data;
      })));
  }

  getAllLocations(): Observable<Location[]> {
    return this.httpClient.get<Location[]>(`${LOCATIONS_API}`, {headers: this.headers})
      .pipe(map((response => {
        if (!isNotNullOrUndefined(response) || !isNotNullOrUndefined(response['entity'])) { return []; }
        return response['entity'];
      })));
  }

  getMetadataDetails(locationId: string, executorId: string): Observable<MetadataDetails[]> {
    return this.httpClient.get<MetadataDetails[]>(`${GET_METADATA_DETAILS}` + locationId + '/' + executorId, {headers: this.headers})
      .pipe(map(response => {
        if (!isNotNullOrUndefined(response) || !isNotNullOrUndefined(response['entity'])) { return {}; }
        return response['entity'];
      }));
  }

  getLearningResults(algorithms: Executor[], modelEnvironment: Executor, location: Location) {
    return of([]);
  }

  postResultRequest(resultsRequest: ResultsRequest) {
    return this.httpClient.post(`${POST_RESULTS_REQUEST}`, resultsRequest,
      {headers: this.headers})
      .pipe(map(response => {
        return response['entity'];
      }));
  }

  findResultsRequestById(id: string) {
    return this.httpClient.get<ResultsRequest>(`${GET_RESULTS_REQUEST_STATUS}` + id,
      {headers: this.headers})
      .pipe(map(response => {
        return response['entity'];
      }));
  }

  getThisMonthData(month: string, thisGeo: string, dataType: string) {
    const thisHeader = this.headers;
    const url = !isNotNullOrUndefined(thisGeo)
      ? `${MONTHLY_DATA}` + dataType.toLowerCase() + `/` + month + `.json`
      : `${MONTHLY_DATA}` + dataType.toLowerCase() + `/` + thisGeo.toLowerCase() + `/` + month + `.json`;
    return this.httpClient
      .get<any>(url, {headers: thisHeader})
      .pipe(
        map(response => response),
        catchError(error => of({}))
      );
  }

  getMonthlyIndicesData(thisGeo: string, selectedMonths: string[]) {
    if (thisGeo !== 'Global') {
      if (!isNotNullOrUndefined(thisGeo)) {
        thisGeo = '';
      }

      if (!environment.AVAILABLE_ADMIN1_ISO2_GEOJSON.includes(thisGeo)) {
        return of(null);
      }
    }

    return forkJoin(selectedMonths
      .map((month) => this.getThisMonthData(month, thisGeo, 'indices')))
      .pipe(
        map(data => {
          let monthlyData = {};
          if (!isNotNullOrUndefined(data)) {
            return monthlyData;
          }

          for (const thisMonth of data) {
            if (Object.keys(monthlyData).length === 0) {
              monthlyData = thisMonth;
              continue;
            }
            Object.keys(thisMonth).forEach(country => {
              const countryData = thisMonth[country];
              if (!monthlyData.hasOwnProperty(country)) { monthlyData[country] = countryData; } else {
                monthlyData[country] = Object.assign({}, monthlyData[country], countryData);
              }
            });
          }
          return monthlyData;
        })
      );
  }

  getCovid19StatsMetadata() {
    return this.httpClient.get<any>(`${STATS_API}`,
      {headers: this.headers})
      .pipe(map(response => {
        return response;
      }));
  }
}
