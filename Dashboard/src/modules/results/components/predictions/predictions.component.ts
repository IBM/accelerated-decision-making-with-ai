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
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import {
  ApiService,
  CacheService,
  ChartCallBack,
  ChartParameters,
  ChartService,
  Executor,
  Location,
  ResultsRequest,
} from '../../../common';
import { PREDICTION_CONSTANTS } from '../../constants/results.constants';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss'],
})
export class PredictionsComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() models: Executor[];
  @Input() locations: Location[];
  @Input() defaultExecutors: string[];
  @Input() results: ResultsRequest;
  @Input() favorites: any;
  @Input() cachedRequestsForUser: ResultsRequest[];
  @Input() constraints: boolean;
  @Input() currentModels: Executor[];
  @Input() currentLocation: Location;
  @Input() currentDefaultExecutors: string[];
  @Input() searchDisable: boolean;
  @Output() constraintsChange = new EventEmitter<boolean>();
  @Output() currentModelsChange = new EventEmitter<Executor[]>();
  @Output() currentLocationChange = new EventEmitter<Location>();
  @Output() currentDefaultExecutorsChange = new EventEmitter<string[]>();
  @Output() locationInputFieldClick = new EventEmitter<any>();
  @Output() searchResultsClick = new EventEmitter<any>();
  @Output() resetFiltersClick = new EventEmitter<any>();
  @Output() favoritesChange = new EventEmitter<any>();
  @Output() resultsChange = new EventEmitter<ResultsRequest>();
  @Output() setSelectedResult = new EventEmitter<ResultsRequest>();

  chartParameters: ChartParameters = this.chartService.getDefaultChartParams();
  favoritePoliciesDataSource = new MatTableDataSource();
  // @ViewChild('actionsSort', {static: true}) actionsSort: MatSort;
  // @ViewChild('actionsPaginator', {static: true}) actionsPaginator: MatPaginator;
  displayedColumnsForActions = ['policyName', 'model', 'action'];

  resultsRequestsDataSource = new MatTableDataSource();
  @ViewChild('resultsRequestsSort', { static: true })
  resultsRequestsSort: MatSort;
  @ViewChild('resultsRequestsPaginator', { static: true })
  resultsRequestsPaginator: MatPaginator;
  displayedColumnsForResultsRequests = ['type', 'status', 'action'];

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private chartService: ChartService,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  ngAfterViewInit(): void {
    // this.favoritePoliciesDataSource.paginator = this.actionsPaginator;
    // this.favoritePoliciesDataSource.sort = this.actionsSort;
    this.resultsRequestsDataSource.paginator = this.resultsRequestsPaginator;
    this.resultsRequestsDataSource.sort = this.resultsRequestsSort;
  }

  ngOnDestroy(): void {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if ('results' in changes || 'currentDefaultExecutors' in changes) {
      this.loadResults();
    }
    if ('favorites' in changes) {
      this.loadFavorites();
    }
    if ('cachedRequestsForUser' in changes) {
      this.loadCachedRequestsForUser();
    }
  }

  currentModelDropdownChangeListener($event: MatSelectChange) {
    if (!isNotNullOrUndefined($event) || !isNotNullOrUndefined($event.value)) {
      this.currentModelsChange.emit([]);
    } else {
      this.currentModelsChange.emit($event.value);
    }
  }

  currentLocationDropdownChangeListener($event: MatSelectChange) {
    if (!isNotNullOrUndefined($event) || !isNotNullOrUndefined($event.value)) {
      this.currentLocationChange.emit({});
    } else {
      this.currentLocationChange.emit($event.value);
    }
  }

  currentDefaultExecutorsDropdownChangeListener($event: MatSelectChange) {
    if (!isNotNullOrUndefined($event) || !isNotNullOrUndefined($event.value)) {
      this.currentDefaultExecutorsChange.emit([]);
    } else {
      this.currentDefaultExecutorsChange.emit([$event.value]);
    }
  }

  myChartCallbackFunction = (chartCallBack: ChartCallBack): any => {
    if (
      chartCallBack.type === 'plotly_legenddoubleclick' ||
      chartCallBack.type === 'plotly_legendclick'
    ) {
      return false;
    }
    if (!isNotNullOrUndefined(chartCallBack.inputChartParameters)) {
      if (chartCallBack.pointsData.meta.type === 'annotation') {
        const thisPolicy = this.results.results.find(
          (policy) => policy.id === chartCallBack.pointsData.meta.id
        );
        // this.cacheService.cacheFavouritePolicy(thisPolicy);
        chartCallBack.inputChartParameters = this.chartParameters;
        return this.chartService.returnToDefault(chartCallBack);
      }
      return this.chartParameters;
    }
    return this.chartService.processSymbolClicks(chartCallBack);
  };

  viewAuditLogsDialog() {
    console.log();
  }

  private loadResults() {
    if (!isNotNullOrUndefined(this.results)) {
      this.chartParameters = this.chartService.getDefaultChartParams();
    } else {
      this.chartParameters =
        this.chartService.generateResultsLessChartParameters(
          this.results,
          this.currentModels,
          this.currentLocation,
          this.currentDefaultExecutors
        );
    }
  }

  more() {
    this.constraints = true;
    this.constraintsChange.emit(this.constraints);
  }

  locationInputClick($event: MouseEvent) {
    this.locationInputFieldClick.emit($event);
  }

  searchResults() {
    this.searchResultsClick.emit(true);
  }

  resetFilters() {
    this.resetFiltersClick.emit(true);
  }

  private loadFavorites() {
    if (isNotNullOrUndefined(this.favorites)) {
      this.favoritePoliciesDataSource.data = this.favorites;
    }
  }

  private loadCachedRequestsForUser() {
    if (isNotNullOrUndefined(this.cachedRequestsForUser)) {
      this.resultsRequestsDataSource.data = this.cachedRequestsForUser.sort(
        (x, y) => +new Date(y.timeCreated) - +new Date(x.timeCreated)
      );
    }
  }

  deleteFavoritePolicy(item) {
    this.cacheService.deleteCachedFavoritePolicyForPolicyId(item);
  }

  viewFavoritePolicy(item) {
    // const request: Request = {results: {policies: [item], location: this.currentLocation.names}};
    // this.resultsChange.emit(request);
  }

  getStatus(status) {
    if (status) {
      return PREDICTION_CONSTANTS.STATUS_COMPLETED;
    } else {
      return PREDICTION_CONSTANTS.STATUS_IN_PROGRESS;
    }
  }

  viewResultsRequest(item) {
    // this.resultsChange.emit(item);
    this.setSelectedResult.emit(item);
  }
}
