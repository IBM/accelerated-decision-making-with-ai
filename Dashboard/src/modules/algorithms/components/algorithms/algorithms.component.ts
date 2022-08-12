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

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { forkJoin, Observable } from 'rxjs';
import {
  Algorithms,
  ApiService,
  ChartCallBack,
  ChartParameters,
  ChartService,
  Executor,
  filterOut,
  Location,
  SNACK_BAR_DURATION,
  User,
  UserService,
} from '../../../common';
import { ALGORITHM_CREATION_FAILED,
  ALGORITHM_CREATION_SUCCESSFUL,
  ALGORITHM_UPDATE_FAILED,
  ALGORITHM_UPDATE_SUCCESSFUL, 
  CLOSE, ENTERED_ALGORITHM_UPDATE_FAILED,
  LEARNING_RESULTS_NOT_FOUND, LOAD_ALGO_ENVS_LOCS_FAILED,
  PROVISIONED_STATUS, PROVISIONING_STATUS } from '../../constants/algorithms.constants';
import { AlgorithmDialogService } from '../../services';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.scss'],
})
export class AlgorithmsComponent implements OnInit, OnDestroy, AfterViewInit {
  chartParameters: ChartParameters = this.chartService.getDefaultChartParams();
  currentAlgorithm: Algorithms;
  algorithms: Algorithms[] = [];
  currentCompareAlgorithms: Algorithms[] = [];
  compareAlgorithms: Algorithms[] = [];
  currentEnvironment: Executor;
  environments: Executor[] = [];
  currentLocation: Location;
  locations: Location[] = [];
  learningResults: any = [];
  searchDisable = true;
  user: Observable<User>;
  private subscribeAlgorithmDialogService: any;
  private subscribeCreateAlgorithm: any;
  private subscribeUpdateAlgorithm: any;
  private subscribeThisData: any;
  private subscribeLearningResults: any;

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private chartService: ChartService,
    private userService: UserService,
    private algorithmDialogService: AlgorithmDialogService
  ) {
    this.user = this.userService.getCurrentUser();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeAlgorithmDialogService) {
      this.subscribeAlgorithmDialogService.unsubscribe();
    }
    if (this.subscribeCreateAlgorithm) {
      this.subscribeCreateAlgorithm.unsubscribe();
    }
    if (this.subscribeUpdateAlgorithm) {
      this.subscribeUpdateAlgorithm.unsubscribe();
    }
    if (this.subscribeThisData) {
      this.subscribeThisData.unsubscribe();
    }
    if (this.subscribeLearningResults) {
      this.subscribeLearningResults.unsubscribe();
    }
  }

  currentAlgorithmDropdownChangeListener($event: MatSelectChange) {
    if (!isNotNullOrUndefined($event) || !isNotNullOrUndefined($event.value)) {
      this.currentAlgorithm = undefined;
    } else {
      this.currentAlgorithm = $event.value;
      this.compareAlgorithms = filterOut(
        this.currentAlgorithm['id'],
        this.algorithms
      );
    }
    this.disableSearch();
  }

  compareAlgorithmDropdownChangeListener($event: MatSelectChange) {
    if (!isNotNullOrUndefined($event) || !isNotNullOrUndefined($event.value)) {
      this.currentCompareAlgorithms = [];
    } else {
      this.currentCompareAlgorithms = $event.value;
    }
    this.disableSearch();
  }

  currentEnvironmentDropdownChangeListener($event: MatSelectChange) {
    if (!isNotNullOrUndefined($event) || !isNotNullOrUndefined($event.value)) {
      this.currentEnvironment = undefined;
    } else {
      this.currentEnvironment = $event.value;
    }
    this.disableSearch();
  }

  currentLocationDropdownChangeListener($event: MatSelectChange) {
    if (!isNotNullOrUndefined($event) || !isNotNullOrUndefined($event.value)) {
      this.currentLocation = undefined;
    } else {
      this.currentLocation = $event.value;
    }
    this.disableSearch();
  }

  searchResults() {
    const temp = Object.assign([this.currentAlgorithm], this.compareAlgorithms);
    this.subscribeLearningResults = this.apiService
      .getLearningResults(temp, this.currentEnvironment, this.currentLocation)
      .subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data)) {
            return;
          }
          this.learningResults = data;
        },
        (error) => {
          this.snackBar.open(LEARNING_RESULTS_NOT_FOUND, CLOSE , {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  resetFilters() {
    this.currentCompareAlgorithms = [];
    this.currentEnvironment = undefined;
    this.currentLocation = undefined;
    this.disableSearch();
  }

  myChartCallbackFunction = (chartCallBack: ChartCallBack): any => {
    if (
      chartCallBack.type === 'plotly_legenddoubleclick' ||
      chartCallBack.type === 'plotly_legendclick'
    ) {
      return false;
    }
    // TODO: write logic that handles plotting learningResults
    return this.chartService.getDefaultChartParams();
  };

  openAlgorithmDialog(inputAlgorithm?: Executor) {
    this.subscribeAlgorithmDialogService = this.algorithmDialogService
      .openDialog('algorithm', inputAlgorithm)
      .subscribe(
        (algorithm) => {
          if (
            !isNotNullOrUndefined(algorithm) ||
            !isNotNullOrUndefined(algorithm['name'])
          ) {
            return;
          }
          if (!isNotNullOrUndefined(algorithm['id'])) {
            algorithm['active'] = false;
            algorithm['verified'] = false;
            this.subscribeCreateAlgorithm = this.apiService
              .postAlgorithm(algorithm)
              .subscribe(
                (outcome) => {
                  this.compareAlgorithms = Object.assign([], this.algorithms);
                  this.algorithms.push(outcome['entity']);
                  this.currentAlgorithm = outcome['entity'];
                  this.snackBar.open(
                    ALGORITHM_CREATION_SUCCESSFUL + algorithm['name'],
                    CLOSE,
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                },
                (error) => {
                  console.log(error);
                  this.snackBar.open(
                    ALGORITHM_CREATION_FAILED + algorithm['name'],
                    CLOSE,
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                }
              );
          } else {
            this.subscribeUpdateAlgorithm = this.apiService
              .updateAlgorithm(algorithm['id'], algorithm)
              .subscribe(
                (outcome) => {
                  const temp: Algorithms[] = filterOut(
                    algorithm['id'],
                    this.algorithms
                  );
                  this.compareAlgorithms = Object.assign([], temp);
                  temp.push(outcome['entity']);
                  this.algorithms = temp;
                  this.currentAlgorithm = outcome['entity'];
                  this.snackBar.open(
                    ALGORITHM_UPDATE_SUCCESSFUL + algorithm['id'],
                    CLOSE ,
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                },
                (error) => {
                  console.log(error);
                  this.snackBar.open(
                    ALGORITHM_UPDATE_FAILED + algorithm['id'],
                    CLOSE,
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                }
              );
          }
        },
        (error) => {
          this.snackBar.open(ENTERED_ALGORITHM_UPDATE_FAILED, CLOSE, {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  getStatus(provisioned: boolean) {
    if (provisioned) {
      return PROVISIONED_STATUS;
    } else {
      return PROVISIONING_STATUS;
    }
  }

  private loadData() {
    const algorithmsObservable = this.apiService.getAllAlgorithms();
    const locationsObservable = this.apiService.getAllLocations();
    const environmentsObservable = this.apiService.getAllModels();
    this.subscribeThisData = forkJoin([
      algorithmsObservable,
      locationsObservable,
      environmentsObservable,
    ]).subscribe(
      (data) => {
        if (!isNotNullOrUndefined(data)) {
          return;
        }
        this.algorithms = data[0];
        this.currentAlgorithm = this.algorithms[0];
        if (!isNotNullOrUndefined(this.currentAlgorithm)) {
          return;
        }
        this.compareAlgorithms = filterOut(
          this.currentAlgorithm['id'],
          this.algorithms
        );
        this.locations = data[1];
        this.environments = data[2];
      },
      (error) => {
        this.snackBar.open(
          LOAD_ALGO_ENVS_LOCS_FAILED,
          CLOSE,
          {
            duration: SNACK_BAR_DURATION,
          }
        );
      }
    );
  }

  private disableSearch() {
    this.searchDisable =
      !isNotNullOrUndefined(this.currentAlgorithm) ||
      !isNotNullOrUndefined(this.currentCompareAlgorithms) ||
      !isNotNullOrUndefined(this.currentCompareAlgorithms[0]) ||
      !isNotNullOrUndefined(this.currentEnvironment) ||
      !isNotNullOrUndefined(this.currentLocation);
  }
}
