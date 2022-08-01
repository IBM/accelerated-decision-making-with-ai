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

/**
 * State class for storing current user details
 */
import {Policy, ResultsRequest} from './task';
import {
  STORE_KEY_ALGORITHM_STATS,
  STORE_KEY_FAVORITE_POLICIES,
  STORE_KEY_LAST_UPDATE_ALGORITHM_STATS,
  STORE_KEY_LAST_UPDATE_FAVORITE_POLICIES,
  STORE_KEY_LAST_UPDATE_LOCATION_STATS,
  STORE_KEY_LAST_UPDATE_MODEL_STATS,
  STORE_KEY_LAST_UPDATE_RESULTS_REQUEST,
  STORE_KEY_LOCATION_STATS,
  STORE_KEY_LOGIN_TIME,
  STORE_KEY_MODEL_STATS,
  STORE_KEY_RESULTS_REQUEST, STORE_KEY_TOKEN,
  STORE_KEY_TOKEN_EXPIRATION_TIME,
  STORE_KEY_USER
} from '../constants';
import {User} from './user';

export class State {
  /**
   * Current user object
   */
  user: User;

  /**
   * Current user login time
   */
  loginTime: number;

  /**
   * Current user token
   */
  token: any;

  tokenExpirationTime: number;

  /**
   * Favourite Policies
   */
  favoritePolicies: Policy[];

  lastUpdateFavoritePolicies: number;

  /**
   * Stats
   */
  locationStats: number;

  lastUpdateLocationStats: number;

  modelStats: number;

  lastUpdateModelStats: number;

  algorithmStats: number;

  lastUpdateAlgorithmStats: number;

  /**
   * Results Request
   */
  resultsRequests: ResultsRequest[];

  lastUpdateResultsRequests: number;

  constructor() {
    const loginTime = JSON.parse(localStorage.getItem(STORE_KEY_LOGIN_TIME));
    this.loginTime = loginTime ? loginTime : 0;

    const user = JSON.parse(localStorage.getItem(STORE_KEY_USER));
    this.user = user ? user as User : null;

    const token = JSON.parse(localStorage.getItem(STORE_KEY_TOKEN));
    this.token = token ? token : null;

    const tokenExpirationTime = JSON.parse(localStorage.getItem(STORE_KEY_TOKEN_EXPIRATION_TIME));
    this.tokenExpirationTime = tokenExpirationTime ? tokenExpirationTime : 0;

    const favoritePolicies = JSON.parse(localStorage.getItem(STORE_KEY_FAVORITE_POLICIES));
    this.favoritePolicies = favoritePolicies ? favoritePolicies as Policy[] : [];

    const lastUpdateFavoritePolicies = JSON.parse(localStorage.getItem(STORE_KEY_LAST_UPDATE_FAVORITE_POLICIES));
    this.lastUpdateFavoritePolicies = lastUpdateFavoritePolicies ? lastUpdateFavoritePolicies : 0;

    const locationStats = JSON.parse(localStorage.getItem(STORE_KEY_LOCATION_STATS));
    this.locationStats = locationStats ? locationStats : 0;

    const lastUpdateLocationStats = JSON.parse(localStorage.getItem(STORE_KEY_LAST_UPDATE_LOCATION_STATS));
    this.lastUpdateLocationStats = lastUpdateLocationStats ? lastUpdateLocationStats : 0;

    const modelStats = JSON.parse(localStorage.getItem(STORE_KEY_MODEL_STATS));
    this.modelStats = modelStats ? modelStats : 0;

    const lastUpdateModelStats = JSON.parse(localStorage.getItem(STORE_KEY_LAST_UPDATE_MODEL_STATS));
    this.lastUpdateModelStats = lastUpdateModelStats ? lastUpdateModelStats : 0;

    const algorithmStats = JSON.parse(localStorage.getItem(STORE_KEY_ALGORITHM_STATS));
    this.algorithmStats = algorithmStats ? algorithmStats : 0;

    const lastUpdateAlgorithmStats = JSON.parse(localStorage.getItem(STORE_KEY_LAST_UPDATE_ALGORITHM_STATS));
    this.lastUpdateAlgorithmStats = lastUpdateAlgorithmStats ? lastUpdateAlgorithmStats : 0;

    const resultsRequests = JSON.parse(localStorage.getItem(STORE_KEY_RESULTS_REQUEST));
    this.resultsRequests = resultsRequests ? resultsRequests as ResultsRequest[] : [];

    const lastUpdateResultsRequests = JSON.parse(localStorage.getItem(STORE_KEY_LAST_UPDATE_RESULTS_REQUEST));
    this.lastUpdateResultsRequests = lastUpdateResultsRequests ? lastUpdateResultsRequests : 0;
  }
}
