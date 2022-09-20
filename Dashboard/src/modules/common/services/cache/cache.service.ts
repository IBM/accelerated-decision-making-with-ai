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

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import {
  LOADING_ERROR_MESSAGE,
  LONG_SESSION_LENGTH_IN_HOURS,
  SNACK_BAR_DURATION,
  STORE_KEY_ALGORITHM_STATS,
  STORE_KEY_FAVORITE_POLICIES,
  STORE_KEY_LAST_UPDATE_ALGORITHM_STATS,
  STORE_KEY_LAST_UPDATE_FAVORITE_POLICIES,
  STORE_KEY_LAST_UPDATE_LOCATION_STATS,
  STORE_KEY_LAST_UPDATE_MODEL_STATS,
  STORE_KEY_LAST_UPDATE_RESULTS_REQUEST,
  STORE_KEY_LOCATION_STATS,
  STORE_KEY_MODEL_STATS,
  STORE_KEY_RESULTS_REQUEST,
} from '../../constants';
import { Policy, ResultsRequest } from '../../models';
import { ApiService } from '../api/api.service';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  MILLISECONDS_IN_AN_HOUR = 60 * 60 * 1000;

  constructor(
    private apiService: ApiService,
    private storeService: StoreService,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Favourite Policies
   */
  public cacheFavouritePolicy(policy: Policy) {
    let policies: Policy[] = this.storeService.state.favoritePolicies;
    policies = this.deleteDuplicateFavoritePolicy(policy, policies);
    policies.push(policy);
    this.storeService.update(STORE_KEY_FAVORITE_POLICIES, policies);
    this.storeService.update(
      STORE_KEY_LAST_UPDATE_FAVORITE_POLICIES,
      Date.now()
    );
  }

  private deleteDuplicateFavoritePolicy(policy: Policy, policies: Policy[]) {
    policies = policies.filter((p) => p.policyId !== policy.policyId);
    return policies;
  }

  public deleteCachedFavoritePolicyForPolicyId(policyId: string) {
    let policies: Policy[] = this.storeService.state.favoritePolicies;
    policies = policies.filter((policy) => policy.policyId !== policyId);
    this.storeService.update(STORE_KEY_FAVORITE_POLICIES, policies);
    this.storeService.update(
      STORE_KEY_LAST_UPDATE_FAVORITE_POLICIES,
      Date.now()
    );
  }

  private getAllCachedFavoritePoliciesFromStore(): Observable<Policy[]> {
    if (
      Date.now() - this.storeService.state.lastUpdateFavoritePolicies >
      LONG_SESSION_LENGTH_IN_HOURS * this.MILLISECONDS_IN_AN_HOUR
    ) {
      this.apiService.getAllFavoriteResults().subscribe(
        (data) => {
          if (data) {
            this.storeService.update(STORE_KEY_FAVORITE_POLICIES, data);
            this.storeService.update(
              STORE_KEY_LAST_UPDATE_FAVORITE_POLICIES,
              Date.now()
            );
          }
        },
        (error1) => {
          // this.snackBar.open(
          //   LOADING_ERROR_MESSAGE + ' favorite policies',
          //   'close',
          //   {
          //     duration: SNACK_BAR_DURATION,
          //   }
          // );
        }
      );
    }
    return this.storeService.changes.pipe(pluck(STORE_KEY_FAVORITE_POLICIES));
  }

  public getAllCachedFavoritePolicies(): Observable<Policy[]> {
    return this.getAllCachedFavoritePoliciesFromStore();
  }

  public getCachedFavoritePoliciesForLocationNameAndModelName(
    location: string,
    model: string
  ): Observable<Policy[]> {
    return this.getAllCachedFavoritePolicies().pipe(
      map((policies) => {
        return policies.filter((policy) => {
          return policy.location === location;
        });
      })
    );
  }

  /**
   * Stats
   */
  public getLocationStats(): Observable<number> {
    return this.getLocationStatsFromStore();
  }

  public getModelStats(): Observable<number> {
    return this.getModelStatsFromStore();
  }

  public getAlgorithmStats(): Observable<number> {
    return this.getAlgorithmStatsFromStore();
  }

  private getLocationStatsFromStore(): Observable<number> {
    if (
      Date.now() - this.storeService.state.lastUpdateLocationStats >
      LONG_SESSION_LENGTH_IN_HOURS * this.MILLISECONDS_IN_AN_HOUR
    ) {
      this.apiService.getLocationsGivenAdminLevel(null, null, null).subscribe(
        (data) => {
          if (isNotNullOrUndefined(data)) {
            this.storeService.update(STORE_KEY_LOCATION_STATS, data.length);
            this.storeService.update(
              STORE_KEY_LAST_UPDATE_LOCATION_STATS,
              Date.now()
            );
          }
        },
        (error1) => {
          this.snackBar.open(
            LOADING_ERROR_MESSAGE + ' location stats',
            'close',
            {
              duration: SNACK_BAR_DURATION,
            }
          );
        }
      );
    }
    return this.storeService.changes.pipe(pluck(STORE_KEY_LOCATION_STATS));
  }

  private getModelStatsFromStore(): Observable<number> {
    if (
      Date.now() - this.storeService.state.lastUpdateModelStats >
      LONG_SESSION_LENGTH_IN_HOURS * this.MILLISECONDS_IN_AN_HOUR
    ) {
      this.apiService.getAllModels(true).subscribe(
        (data) => {
          if (isNotNullOrUndefined(data)) {
            this.storeService.update(STORE_KEY_MODEL_STATS, data.length);
            this.storeService.update(
              STORE_KEY_LAST_UPDATE_MODEL_STATS,
              Date.now()
            );
          }
        },
        (error1) => {
          this.snackBar.open(LOADING_ERROR_MESSAGE + ' model stats', 'close', {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
    }
    return this.storeService.changes.pipe(pluck(STORE_KEY_MODEL_STATS));
  }

  private getAlgorithmStatsFromStore(): Observable<number> {
    if (
      Date.now() - this.storeService.state.lastUpdateAlgorithmStats >
      LONG_SESSION_LENGTH_IN_HOURS * this.MILLISECONDS_IN_AN_HOUR
    ) {
      this.apiService.getAllAlgorithms().subscribe(
        (data) => {
          if (isNotNullOrUndefined(data)) {
            this.storeService.update(STORE_KEY_ALGORITHM_STATS, data.length);
            this.storeService.update(
              STORE_KEY_LAST_UPDATE_ALGORITHM_STATS,
              Date.now()
            );
          }
        },
        (error1) => {
          this.snackBar.open(
            LOADING_ERROR_MESSAGE + ' algorithm stats',
            'close',
            {
              duration: SNACK_BAR_DURATION,
            }
          );
        }
      );
    }
    return this.storeService.changes.pipe(pluck(STORE_KEY_ALGORITHM_STATS));
  }

  public cacheResultsRequest(resultsRequest: ResultsRequest) {
    let resultsRequestList: ResultsRequest[] =
      this.storeService.state.resultsRequests;
    resultsRequestList = this.deleteDuplicateResultsRequest(
      resultsRequest,
      resultsRequestList
    );
    resultsRequestList.push(resultsRequest);
    this.storeService.update(STORE_KEY_RESULTS_REQUEST, resultsRequestList);
    this.storeService.update(STORE_KEY_LAST_UPDATE_RESULTS_REQUEST, Date.now());
  }

  private deleteDuplicateResultsRequest(
    resultsRequest: ResultsRequest,
    resultsRequestList: ResultsRequest[]
  ) {
    resultsRequestList = resultsRequestList.filter(
      (rr) => rr.id !== resultsRequest.id
    );
    return resultsRequestList;
  }

  private getResultsRequestForTheUserFromStore(
    userId?: string
  ): Observable<ResultsRequest[]> {
    return this.storeService.changes.pipe(pluck(STORE_KEY_RESULTS_REQUEST));
  }

  getResultsRequestForTheUser(userId?: string): Observable<ResultsRequest[]> {
    return this.getResultsRequestForTheUserFromStore(userId);
  }
}
