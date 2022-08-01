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

import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import {
  ApiService,
  CacheService,
  Executor,
  isString,
  Location,
  NgSliderParameters,
  ResultsRequest,
  SNACK_BAR_DURATION,
} from '../../../common';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  constraints = false;
  currentModels: Executor[] = [];
  models: Executor[] = [];
  currentLocation: Location;
  locations: Location[] = [];
  currentDefaultExecutors: string[] = [];
  defaultExecutors: string[] = [];
  resultsMore: ResultsRequest;
  resultsLess: ResultsRequest;
  searchDisable = true;
  ngSliderParametersList: NgSliderParameters[] = [];
  favorites: any;
  cachedRequestsForUser: ResultsRequest[] = [];
  private subscribeModels: any;
  private subscribeRewardFunctions: any;
  private subscribeLocations: any;
  private subscribeResults: any;
  private subscribeResultsNew: any;
  private subscribeLoadDataOptimally: any;
  private subscribeCheckResultsRequestStatus: any;
  private subscribePostResultsRequest: any;
  private queryParams: any;

  private getResultsRequestForTheUserObservable: Observable<ResultsRequest[]> =
    this.cacheService.getResultsRequestForTheUser().pipe(
      concatMap((data) => {
        if (!isNotNullOrUndefined(data) || !isNotNullOrUndefined(data[0])) {
          return of([]);
        }
        return forkJoin(
          data.map((resultRequest) => {
            return resultRequest.status === false
              ? this.apiService.findResultsRequestById(resultRequest.id)
              : of(resultRequest);
          })
        );
      })
    );

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private cacheService: CacheService
  ) { }

  ngOnInit() {
    this.loadDataOptimally();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.loadMoreData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeModels) {
      this.subscribeModels.unsubscribe();
    }
    if (this.subscribeResultsNew) {
      this.subscribeResultsNew.unsubscribe();
    }
    if (this.subscribeRewardFunctions) {
      this.subscribeRewardFunctions.unsubscribe();
    }
    if (this.subscribeLocations) {
      this.subscribeLocations.unsubscribe();
    }
    if (this.subscribeResults) {
      this.subscribeResults.unsubscribe();
    }
    if (this.subscribeLoadDataOptimally) {
      this.subscribeLoadDataOptimally.unsubscribe();
    }
    if (this.subscribeCheckResultsRequestStatus) {
      this.subscribeCheckResultsRequestStatus.unsubscribe();
    }
    if (this.subscribePostResultsRequest) {
      this.subscribePostResultsRequest.unsubscribe();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log(changes);
  }

  private loadMoreData() {
    this.subscribeModels = this.apiService
      .getAllModels()
      .pipe(
        concatMap((models) => {
          if (isNotNullOrUndefined(models)) {
            // this.models = models.filter(model => model.active === true);
            this.models = models;
          }
          return this.route.queryParams;
        })
      )
      .subscribe(
        (params) => {
          const locationId = params['locationId'];
          const modelId = params['modelId'];
          if (isNotNullOrUndefined(modelId)) {
            const currentModel = this.filter(modelId, this.models, 'id');
            if (
              isNotNullOrUndefined(currentModel) &&
              isNotNullOrUndefined(currentModel[0])
            ) {
              this.currentModels.push(currentModel[0]);
            }
          }
          this.loadLocationsAndPostExecutors([modelId], locationId);
        },
        (error) => {
          this.snackBar.open('Could not find models : ', 'close', {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  private loadLocationsAndPostExecutors(
    modelId: string[],
    locationId?: string
  ) {
    if (!isNotNullOrUndefined(modelId) || !isNotNullOrUndefined(modelId[0])) {
      return;
    }

    this.subscribeLocations = this.apiService
      .getLocationData(null, this.currentModels[0].id, null, null)
      .subscribe(
        (data) => {
          if (isNotNullOrUndefined(data)) {
            this.locations = data;
            if (isNotNullOrUndefined(locationId)) {
              const currentLocation = this.filter(
                locationId,
                this.locations,
                'id'
              );
              if (
                isNotNullOrUndefined(currentLocation) &&
                isNotNullOrUndefined(currentLocation[0])
              ) {
                this.currentLocation = currentLocation[0];
              }
            }
          }
        },
        (error) => {
          this.snackBar.open('Could not find locations : ', 'close', {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  private filter(value: string, options: any[], param: string): any[] {
    if (!isNotNullOrUndefined(value) || !isNotNullOrUndefined(options)) {
      return [];
    }
    const filterValue = value.toLowerCase();
    if (value === 'all') {
      return options;
    }
    return options.filter((option) =>
      option[param].toLowerCase().includes(filterValue)
    );
  }

  private filterMultiple(value: any[], options: any[], param: string): any[] {
    if (
      !isNotNullOrUndefined(param) ||
      !isNotNullOrUndefined(value) ||
      !isNotNullOrUndefined(value[0]) ||
      !isNotNullOrUndefined(options)
    ) {
      return [];
    }
    return options.filter((option) =>
      value.some((val) =>
        option[param].toLowerCase().includes(val[param].toLowerCase())
      )
    );
  }

  private loadLessResults() {
    this.subscribeResults = this.cacheService
      .getCachedFavoritePoliciesForLocationNameAndModelName('Uganda', 'test')
      .subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data)) {
            return;
          }
          this.favorites = data;
        },
        (error) => {
          this.snackBar.open('Could not find results : ', 'close', {
            duration: SNACK_BAR_DURATION,
          });
        }
      );

    this.subscribeResultsNew = this.apiService
      .getAllResultsNew(this.currentModels[0].title, this.currentLocation.names)
      .subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data)) {
            return;
          }
          this.resultsLess = data;
        },
        (error) => {
          this.snackBar.open('Could not find results : ', 'close', {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  private loadMoreResults() {
    this.subscribeResultsNew = this.apiService
      .getAllResultsNew(this.currentModels[0].title, this.currentLocation.names)
      .subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data)) {
            return;
          }
          this.resultsMore = data;
        },
        (error) => {
          this.snackBar.open('Could not find results : ', 'close', {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  constraintsChange($event: boolean) {
    this.disableSearch();
    // console.log($event);
  }

  currentModelsChange($event: Executor[]) {
    // console.log($event);
    this.currentLocation = undefined;
    this.locations = [];
    this.currentDefaultExecutors = [];
    this.defaultExecutors = [];
    this.ngSliderParametersList = [];
    this.disableSearch();
  }

  currentLocationChange($event: Location) {
    // console.log($event);
    this.disableSearch();
  }

  currentDefaultExecutorsChange($event: string[]) {
    // console.log($event);
    // this.disableSearch();
  }

  locationInputFieldClick($event: any) {
    if (
      isNotNullOrUndefined(this.currentModels) &&
      this.currentModels.length > 0 &&
      (!isNotNullOrUndefined(this.locations) || this.locations.length < 1)
    ) {
      const modelIdList = [];
      this.currentModels.forEach((model) => {
        modelIdList.push(model.id);
      });
      this.loadLocationsAndPostExecutors(modelIdList);
    }
  }

  private disableSearch() {
    this.searchDisable =
      !isNotNullOrUndefined(this.currentModels) ||
      this.currentModels.length < 1 ||
      !isNotNullOrUndefined(this.currentLocation);
  }

  searchResultsClick($event: any) {
    this.searchResultsGivenLocationModel();
  }

  resetFiltersClick($event: any) {
    this.poolToCheckResultsRequestStatus();
  }

  setSelectedResult(resultsRequest: ResultsRequest) {
    this.currentModels = this.filterMultiple(
      resultsRequest.executors,
      this.models,
      'id'
    );
    this.apiService
      .getLocationData(null, this.currentModels[0].id, null, null)
      .subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data)) {
            return;
          }
          this.locations = data;
          const currentLocation = this.filter(
            resultsRequest.locations[0].id,
            this.locations,
            'id'
          );
          if (
            isNotNullOrUndefined(currentLocation) &&
            isNotNullOrUndefined(currentLocation[0])
          ) {
            this.currentLocation = currentLocation[0];
          }
          this.disableSearch();
        },
        (error) => {
          console.error(error);
        }
      );
    this.handleResultsAndDisplay(resultsRequest);
  }

  /**
   * The goal is to fetch all data given the conditions in the most optimal way.
   * Below are the proposed process which involves making close to 10 API calls (to the serve and cache and ensuring synchronisation)
   * 1. Make the first set of unique calls in async manner;
   *    a. get all models
   *    b. get all cached requests and list them on the UI
   *    c. get all query parameters
   *   If query parameters from 1c contains locationId, modelId, and/or (taskId or experimentId) proceed to 3, otherwise proceed to 2.
   * 2. Exit
   * 3. Do the following asynchronously;
   *    a. filter for the currentModel using the modelId and set it on the dropdown
   *    b. check if a request exist in cache using the output of 1c
   *  If request from 3b exists proceed 4, else proceed to 5
   * 4. Display the results on the chart and add the reward functions to the dropdown
   * 5. Do the following asynchronously;
   *   a. get all locations associated with the current model
   *   b. create a request and post it
   *   c. fetch favourites
   * 6. Do the following asynchronously;
   *   a. filter for the currentLocation using the locationId and set it on the dropdown
   *   b. cache the request and update the request list in the UI
   * 7. Pool for pending results from cache and each time update as in 4
   */
  loadDataOptimally() {
    const modelObservable: Observable<Executor[]> =
      this.apiService.getAllModels();
    const allQueryParametersObservable: Observable<any> =
      this.route.queryParams.pipe(take(1));
    this.subscribeLoadDataOptimally = forkJoin([
      modelObservable,
      this.getResultsRequestForTheUserObservable.pipe(take(1)),
      allQueryParametersObservable,
    ])
      .pipe(
        concatMap((data) => {
          if (!isNotNullOrUndefined(data)) {
            return of([]);
          }
          this.models = data[0];
          this.cachedRequestsForUser = data[1];
          this.queryParams = data[2];
          if (
            !isNotNullOrUndefined(this.queryParams) ||
            (!isNotNullOrUndefined(this.queryParams['locationId']) &&
              !isNotNullOrUndefined(this.queryParams['modelId']))
          ) {
            return of([]);
          }
          const currentModel = this.filter(
            this.queryParams['modelId'],
            this.models,
            'id'
          );
          if (
            isNotNullOrUndefined(currentModel) &&
            isNotNullOrUndefined(currentModel[0])
          ) {
            this.currentModels.push(currentModel[0]);
          }

          const existingResultsRequest: ResultsRequest[] =
            this.resultsRequestFilter(
              this.cachedRequestsForUser,
              [this.queryParams['modelId']],
              [this.queryParams['locationId']],
              [this.queryParams['experimentId']],
              [this.queryParams['taskId']]
            );

          const nextObservables: Observable<any>[] = [
            this.apiService.getLocationData(
              null,
              this.queryParams['modelId'],
              null,
              null
            ),
            this.cacheService
              .getCachedFavoritePoliciesForLocationNameAndModelName(
                'Uganda',
                'test'
              )
              .pipe(take(1)),
          ];
          const newResultRequest: ResultsRequest = this.processResults(
            existingResultsRequest
          );
          if (isNotNullOrUndefined(newResultRequest)) {
            nextObservables.push(
              this.apiService.postResultRequest(newResultRequest)
            );
          }
          return forkJoin(nextObservables);
        })
      )
      .subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data) || !isNotNullOrUndefined(data[0])) {
            return;
          }
          this.locations = data[0];
          const currentLocation = this.filter(
            this.queryParams['locationId'],
            this.locations,
            'id'
          );
          if (
            isNotNullOrUndefined(currentLocation) &&
            isNotNullOrUndefined(currentLocation[0])
          ) {
            this.currentLocation = currentLocation[0];
          }
          this.disableSearch();
          this.favorites = data[1];
          if (isNotNullOrUndefined(data[2])) {
            this.cachedRequestsForUser.push(data[2]);
            this.cachedRequestsForUser = Object.assign(
              [],
              this.cachedRequestsForUser
            );
            this.cacheService.cacheResultsRequest(data[2]);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  /**
   * maybe after every 5 minutes have a background service that fetches all the status false result requests
   * and in an asynchronous way checks the status from the server and caches accordingly
   *
   * This should probably run in the AppComponent
   *
   * 1. Fetch all cached results requests
   * 2. Loop asynchronously and hit the status API to fetch/check the status of a request
   * 3. Merge the results to the results requests and update the UI
   */
  poolToCheckResultsRequestStatus() {
    this.subscribeCheckResultsRequestStatus =
      this.getResultsRequestForTheUserObservable.subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data)) {
            return;
          }
          this.cachedRequestsForUser = data;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  /**
   * 1. Filter cached ResultsRequests
   * 2. Call method processResults()
   * 3. Post a ResultsRequest if needed
   */
  searchResultsGivenLocationModel() {
    const existingResultsRequest: ResultsRequest[] = this.resultsRequestFilter(
      this.cachedRequestsForUser,
      this.obtainAListOfIdsGivenObjects(this.currentModels, true),
      [this.currentLocation.id],
      [],
      []
    );
    const newResultRequest: ResultsRequest = this.processResults(
      existingResultsRequest,
      true
    );
    if (!isNotNullOrUndefined(newResultRequest)) {
      return;
    }
    this.subscribePostResultsRequest = this.apiService
      .postResultRequest(newResultRequest)
      .subscribe(
        (data) => {
          if (isNotNullOrUndefined(data)) {
            this.cachedRequestsForUser.push(data);
            this.cachedRequestsForUser = Object.assign(
              [],
              this.cachedRequestsForUser
            );
            this.cacheService.cacheResultsRequest(data);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  /**
   * 1. Check whether a `Search` ResultsRequest exists in the cache
   *    a. if a ResultsRequest  does not exists, proceed to 2
   *    b. if a ResultsRequest exists and is false, proceed to do nothing
   *    c. if a ResultsRequest exists and is true, proceed to 3
   * 2. Create a request and post it and cache the request result and update the request list in the UI
   */
  processResults(
    existingResultsRequest: ResultsRequest[],
    search?: boolean
  ): ResultsRequest {
    let newResultRequest: ResultsRequest;
    if (
      isNotNullOrUndefined(existingResultsRequest) &&
      isNotNullOrUndefined(existingResultsRequest[0]) &&
      isNotNullOrUndefined(existingResultsRequest[0]['results'])
    ) {
      // Display the results on the chart and add the reward functions to the dropdown
      this.handleResultsAndDisplay(existingResultsRequest[0]);
    } else if (
      isNotNullOrUndefined(existingResultsRequest) &&
      isNotNullOrUndefined(existingResultsRequest[0])
    ) {
      // Do not create a new result request
    } else {
      // Create a new result request
      const requestName = search
        ? 'Search'
        : isNotNullOrUndefined(this.queryParams['experimentId'])
          ? 'Experiment'
          : isNotNullOrUndefined(this.queryParams['taskId'])
            ? 'Task'
            : 'Search';
      const locations = search
        ? [{ id: this.currentLocation.id }]
        : isNotNullOrUndefined(this.queryParams) &&
          isNotNullOrUndefined(this.queryParams['locationId'])
          ? [{ id: this.queryParams['locationId'] }]
          : null;
      const experiments = search
        ? null
        : isNotNullOrUndefined(this.queryParams) &&
          isNotNullOrUndefined(this.queryParams['experimentId'])
          ? [{ id: this.queryParams['experimentId'] }]
          : null;
      const tasks = search
        ? null
        : isNotNullOrUndefined(this.queryParams) &&
          isNotNullOrUndefined(this.queryParams['taskId'])
          ? [{ id: this.queryParams['taskId'] }]
          : null;
      newResultRequest = {
        requestName,
        environments: this.obtainAListOfIdsGivenObjects(this.currentModels[0].defaultPostExecutor),
        executors: this.obtainAListOfIdsGivenObjects(this.currentModels),
        locations,
        experiments,
        tasks,
        customMap: null,
        results: null,
      };
    }
    return newResultRequest;
  }

  /**
   * Loop through an object and create a new object with id only
   */
  obtainAListOfIdsGivenObjects(objectArray: any[], stringList = false) {
    const newObjectArray = [];
    objectArray.forEach((obj) => {
      if (!stringList) {
        newObjectArray.push({ id: obj.id });
      } else {
        newObjectArray.push(obj.id);
      }
    });
    return newObjectArray;
  }

  private resultsRequestFilter(
    resultsRequestList: ResultsRequest[],
    modelIds: string[],
    locationIds: string[],
    experimentIds: string[],
    taskIds: string[]
  ): ResultsRequest[] {
    if (
      !isNotNullOrUndefined(resultsRequestList) ||
      !isNotNullOrUndefined(resultsRequestList[0]) ||
      !isNotNullOrUndefined(modelIds) ||
      !isNotNullOrUndefined(locationIds) ||
      !isNotNullOrUndefined(experimentIds) ||
      !isNotNullOrUndefined(taskIds)
    ) {
      return [];
    }
    const requestName = isNotNullOrUndefined(experimentIds[0])
      ? 'Experiment'
      : isNotNullOrUndefined(taskIds[0])
        ? 'Task'
        : 'Search';
    if (requestName === 'Experiment') {
      return resultsRequestList.filter((request) => {
        const filteredModelIds = modelIds.filter((modelId) =>
          request.executors.some((ex) => ex.id === modelId)
        );
        const filteredLocationIds = locationIds.filter((locationId) =>
          request.locations.some((lo) => lo.id === locationId)
        );
        // const filteredExperimentIds = experimentIds.filter((experimentId) =>
        //   request.experiments.some((ex) => ex.id === experimentId)
        // );
        const filteredExperimentIds = !isNotNullOrUndefined(request.experiments)
        ? []
        : experimentIds.filter((experimentId) =>
          request.experiments.some((ex) => ex.id === experimentId)
        );
        return (
          request.requestName === requestName &&
          filteredModelIds.length === modelIds.length &&
          filteredLocationIds.length === locationIds.length &&
          filteredExperimentIds.length === experimentIds.length
        );
      });
    } else if (requestName === 'Task') {
      return resultsRequestList.filter((request) => {
        const filteredModelIds = modelIds.filter((modelId) =>
          request.executors.some((ex) => ex.id === modelId)
        );
        const filteredLocationIds = locationIds.filter((locationId) =>
          request.locations.some((lo) => lo.id === locationId)
        );
        const filteredTaskIds = !isNotNullOrUndefined(request.tasks)
          ? []
          : taskIds.filter((taskId) =>
            request.tasks.some((tx) => tx.id === taskId)
          );
        return (
          request.requestName === requestName &&
          filteredModelIds.length === modelIds.length &&
          filteredLocationIds.length === locationIds.length &&
          filteredTaskIds.length === taskIds.length
        );
      });
    } else if (requestName === 'Search') {
      return resultsRequestList.filter((request) => {
        const filteredModelIds = modelIds.filter((modelId) =>
          request.executors.some((ex) => ex.id === modelId)
        );
        const filteredLocationIds = locationIds.filter((locationId) =>
          request.locations.some((lo) => lo.id === locationId)
        );
        return (
          request.requestName === requestName &&
          filteredModelIds.length === modelIds.length &&
          filteredLocationIds.length === locationIds.length
        );
      });
    } else {
      return [];
    }
  }

  /**
   * 1. From the results payload, create a list of outcomes
   */
  private handleResultsAndDisplay(resultsRequest: ResultsRequest) {
    if (
      !isNotNullOrUndefined(resultsRequest) ||
      !isNotNullOrUndefined(resultsRequest.results) ||
      !isNotNullOrUndefined(resultsRequest.results[0]) ||
      !isNotNullOrUndefined(resultsRequest.results[0].rewards) ||
      !isNotNullOrUndefined(resultsRequest.results[0].rewards[0])
    ) {
      this.defaultExecutors = [];
      this.currentDefaultExecutors = [];
      this.resultsLess = undefined;
      this.resultsMore = undefined;
      return;
    }

    // TODO: Remove this data curation method once the data format is corrected from the server
    resultsRequest = this.curateOpenMalariaData(resultsRequest);

    let thisOutcomes = Object.keys(resultsRequest.results[0].rewards[0]);
    thisOutcomes = thisOutcomes.filter((item) => item !== 'day');

    if (thisOutcomes.indexOf('infectious') !== -1) {
      const b = thisOutcomes[thisOutcomes.indexOf('infectious')];
      thisOutcomes[thisOutcomes.indexOf('infectious')] = thisOutcomes[0];
      thisOutcomes[0] = b;
    }

    this.defaultExecutors = thisOutcomes;
    this.currentDefaultExecutors = [thisOutcomes[0]];
    this.resultsLess = resultsRequest;
    this.resultsMore = resultsRequest;
  }

  /**
   * This is a place holder function which structures openmalaria results in to the standard format,
   * essentially this should be done by the rewardFunction or server
   */
  private curateOpenMalariaData(resultsRequest: ResultsRequest) {
    const thisOutcomes = Object.keys(resultsRequest.results[0].rewards[0]);
    const testNumber = resultsRequest.results[0].rewards[0][thisOutcomes[0]];
    if (
      !isNaN(testNumber) ||
      !isNotNullOrUndefined(testNumber) ||
      isString(testNumber)
    ) {
      for (let i = 0; i < +resultsRequest.results.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < resultsRequest.results[i].rewards.length; j++) {
          if (
            isNotNullOrUndefined(
              resultsRequest.results[i].rewards[j]['Observed Deaths']
            ) &&
            isNotNullOrUndefined(
              resultsRequest.results[i].rewards[j]['Predicted Deaths']
            )
          ) {
            const tempObservedDeaths =
              resultsRequest.results[i].rewards[j]['Predicted Deaths'];
            resultsRequest.results[i].rewards[j]['Predicted Deaths'] =
              resultsRequest.results[i].rewards[j]['Observed Deaths'];
            resultsRequest.results[i].rewards[j]['Observed Deaths'] =
              tempObservedDeaths;
          }
        }
      }
      return resultsRequest;
    }

    for (const result of resultsRequest.results) {
      const rewards = [];
      for (const reward of result.rewards) {
        Object.keys(reward).forEach((item) => {
          if (
            reward.hasOwnProperty(item) &&
            reward[item].hasOwnProperty('data')
          ) {
            Object.keys(reward[item]['data']).forEach((day) => {
              if (
                reward[item]['data'].hasOwnProperty(day) &&
                isNotNullOrUndefined(reward[item]['data'][day]) &&
                isNotNullOrUndefined(reward[item]['data'][day][0])
              ) {
                const index = rewards.findIndex(
                  (option) => option['day'] === day
                );
                const newReward = index !== -1 ? rewards[index] : { day };
                newReward[item] = reward[item]['data'][day][0];
                index !== -1
                  ? rewards.push(newReward, index)
                  : rewards.push(newReward);
              }
            });
          }
        });
      }
      result.rewards = rewards;
    }
    return resultsRequest;
  }
}
