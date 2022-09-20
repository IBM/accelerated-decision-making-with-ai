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

import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { Observable } from 'rxjs';
import { concatMap, map, startWith } from 'rxjs/operators';
import { Executor, User, ExecutorRequirement, Algorithms, ApiService, UserService, ConfirmDialogService,
  SNACK_BAR_DURATION, getDaysBetweenTimestampInDays, Experiments, Task, TaskInputs, Location, ExperimentOutput, OptimizationEnvelope } from 'src/modules/common';
import { EXPERIMENTS_CONSTANTS } from '../../constants/experiments.constants';
import { DynamicFormService } from '../../services/dynamic-form/dynamic-form.service';
import { ExperimentDialogService } from '../../services/experiment-dialog/experiment-dialog.service';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
})

export class ExperimentsComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedValue = '';
  @ViewChild('itemsSort', { static: true }) sort: MatSort;
  @ViewChild('itemsPaginator', { static: true }) paginator: MatPaginator;

  @ViewChild('duplicateExperimentsSort', { static: false }) duplicateExperimentsSort: MatSort;
  @ViewChild('duplicateExperimentsPaginator', { static: false }) duplicateExperimentsPaginator: MatPaginator;

  @ViewChild('experimentOutputSort', { static: false }) experimentOutputSort: MatSort;
  @ViewChild('experimentOutputPaginator', { static: false }) experimentOutputPaginator: MatPaginator;

  private subscribeExperiments: any;
  itemsDataSource = new MatTableDataSource();
  duplicateExperimentsDataSource = new MatTableDataSource();
  experimentOutputDataSource = new MatTableDataSource();
  displayedColumnsForItems = ['name', 'description', 'action'];
  displayedColumnsForExperimentOutput = ['name', 'description', 'action'];
  formGroup: FormGroup;
  models: Executor[] = [];
  filteredLocationOptions: Observable<any[]>;
  locations: Location[] = [];
  defaultExecutors: Executor[] = [];
  expTypes: string[] = [EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.PREDICTION, EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.CALIBRATION];
  tasks: string[] = [EXPERIMENTS_CONSTANTS.TASKS.SINGLE, EXPERIMENTS_CONSTANTS.TASKS.MULTIPLE, EXPERIMENTS_CONSTANTS.TASKS.CONTINUOUS];
  actionList: any[] = [];
  private locationIdentity;
  private locationDataIdentity;
  private subscribeModels: any;
  private subscribeLocations: any;
  private subscribeExperimentDialogService: any;
  formData: any;
  expandEnabled = true;
  alternate = true;
  toggle = true;
  focusOnOpen = true;
  options: any;
  color = false;
  size = 10;
  private subscribePostTask: any;
  private subscribePostExperiment: any;
  userObservable: Observable<User>;
  subscribeUser: any;
  user: User;
  allRequements: ExecutorRequirement<any>[] | null = [];
  infoRequements: ExecutorRequirement<any>[] | null = [{'id':'1','name':'experimentType','category':'info','type':'string','defaults':'','required':'true','hidden':'false','readonly':'false','description':$localize`:experiment type|experiment type@@experiment.type:experiment type`,'options':[]},{'id':'0','name':'algorithmId','category':'info','type':'string','defaults':'','required':'true','hidden':'false','readonly':'false','description': $localize`:algorithm name|algorithm name@@algorithm.name:algorithm name`,'options':[]},{'id':'2','name':'name','category':'info','type':'string','defaults':'Calibration','required':'true','hidden':'false','readonly':'false','description':$localize`:experiment name|experiment name@@experiment.name:experiment name`},{'id':'3','name':'description','category':'info','type':'string','defaults':'Calibrating x model to y data','required':'true','hidden':'false','readonly':'false','description':$localize`:Description of the experiment|Description of the experiment@@description.of.the.experiment:Description of the experiment`}] as ExecutorRequirement<any>[];
  optimizationEnvelopeRequiments: ExecutorRequirement<any>[] | null = [{'id':'value','name':'value','category':'parameter_attribute','type':'number','required':'true','hidden':'false','readonly':'false','description':'the actual value of the parameter'},{'id':'minValue','name':'minValue','category':'parameter_attribute','type':'number','required':'true','hidden':'false','readonly':'false','description':'the lowest value of the parameter that can be sampled'},{'id':'maxValue','name':'maxValue','category':'parameter_attribute','type':'number','required':'true','hidden':'false','readonly':'false','description':'the highest value of the parameter that can be sampled'},{'id':'stepValue','name':'stepValue','category':'parameter_attribute','type':'number','required':'true','hidden':'false','readonly':'false','description':'the lowest resolution of the sampling rate of the parameter'},{'id':'date','name':'date','category':'parameter_attribute','type':'date','required':'true','hidden':'false','readonly':'false','description':'the actual date that the parameter value is applied'},{'id':'startDate','name':'startDate','category':'parameter_attribute','type':'date','required':'true','hidden':'false','readonly':'false','description':'the start date from which parameters are sampled'},{'id':'endDate','name':'endDate','category':'parameter_attribute','type':'date','required':'true','hidden':'false','readonly':'false','description':'the end date up to which parameters are sampled'},{'id':'stepDays','name':'stepDays','category':'parameter_attribute','type':'number','required':'true','hidden':'false','readonly':'false','description':'the lowest time resolution in days of the sampling of the parameter'},{'id':'numberOfEpisodes','name':'numberOfEpisodes','category':'parameter_attribute','type':'number','required':'true','hidden':'false','readonly':'false','description':'the number of optimized parameters to be considered'}] as ExecutorRequirement<any>[];
  filteredOptimizationEnvelopeRequiments: any = {};
  experimentTypeSubscriber: any;
  algorithms: Algorithms[] = [];
  subscribeAlgorithms: any;

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private userService: UserService,
    private experimentDialogService: ExperimentDialogService,
    private dynamicFormService: DynamicFormService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.userObservable = this.userService.getCurrentUser();
  }

  ngOnInit() {
    this.setOptions();
    this.getAllAlgorithms();
    this.setupForm();
    this.subscribeUser = this.userObservable.subscribe((whoami) => {
      if (!isNotNullOrUndefined(whoami)) {
        return;
      }
      this.user = whoami;
      this.getAllExperiments();
      this.tasks =
        this.user.type === 'DM'
          ? [EXPERIMENTS_CONSTANTS.TASKS.SINGLE, EXPERIMENTS_CONSTANTS.TASKS.CONTINUOUS]
          : [EXPERIMENTS_CONSTANTS.TASKS.SINGLE, EXPERIMENTS_CONSTANTS.TASKS.MULTIPLE, EXPERIMENTS_CONSTANTS.TASKS.CONTINUOUS];
      this.expTypes =
        this.user.type === 'DM'
          ? [EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.PREDICTION]
          : [EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.PREDICTION, EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.CALIBRATION];
    });
  }

  ngAfterViewInit(): void {
    this.itemsDataSource.paginator = this.paginator;
    this.itemsDataSource.sort = this.sort;

    setTimeout(() => {
      this.loadMoreData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeUser) {
      this.subscribeUser.unsubscribe();
    }
    if (this.subscribeExperiments) {
      this.subscribeExperiments.unsubscribe();
    }
    if (this.subscribeModels) {
      this.subscribeModels.unsubscribe();
    }
    if (this.subscribeLocations) {
      this.subscribeLocations.unsubscribe();
    }
    if (this.subscribeExperimentDialogService) {
      this.subscribeExperimentDialogService.unsubscribe();
    }
    if (this.subscribePostTask) {
      this.subscribePostTask.unsubscribe();
    }
    if (this.subscribePostExperiment) {
      this.subscribePostExperiment.unsubscribe();
    }
    if (this.experimentTypeSubscriber) {
      this.experimentTypeSubscriber.unsubscribe();
    }
    if (this.subscribeAlgorithms) {
      this.subscribeAlgorithms.unsubscribe();
    }
  }

  private getAllAlgorithms() {
    this.subscribeAlgorithms = this.apiService.getAllAlgorithms().subscribe((data) => {
      if (isNotNullOrUndefined(data) && isNotNullOrUndefined(data[0])) {
        this.algorithms = data;
        const algorithmNames = [];
        this.algorithms.forEach(element => {
          algorithmNames.push(element.name);
        });
        this.infoRequements[1].options = algorithmNames;
        this.infoRequements[1].defaults = algorithmNames[0]
      } else {
        this.infoRequements.splice(1, 1);
      }
    }, (error) => {
      console.log(error);
    });
  }

  private filterForAlgorithmIdGivenName(name: string, filterAlgoritms: Algorithms[]): string {
    if (!isNotNullOrUndefined(filterAlgoritms) || !name) {
      return null;
    }
    const filteredAlgoritms: Algorithms[] = filterAlgoritms.filter(al => al.name.toLowerCase() === name.toLowerCase());
    if (filteredAlgoritms && filteredAlgoritms[0]) {
      return filteredAlgoritms[0].id;
    } else return null;
  }

  /**
   * Get all experiments and list them in a table
   */
  private getAllExperiments() {
    this.subscribeExperiments = this.apiService.getAllExperiments().subscribe(
      (data) => {
        if (isNotNullOrUndefined(data)) {
          this.itemsDataSource.data = data;
        }
      },
      (error) => {
        // this.snackBar.open('Could not find experiments : ', 'close', {
        //   duration: SNACK_BAR_DURATION,
        // });
      }
    );
  }

  private setupForm() {
    this.formGroup = this.formBuilder.group({
      staticGroup: this.formBuilder.group({
        executor: new FormControl(''),
        selectedPostExecutor: new FormControl([]),
        location: new FormControl(''),
      }),
    });
    this.locationChange();
  }

  currentModelDropdownChangeListener($event) {
    if (isNotNullOrUndefined($event.value.defaultPostExecutor)) {
      this.defaultExecutors = $event.value.defaultPostExecutor;
    }

    (this.formGroup.get('staticGroup') as FormGroup).controls['location'].setValue('');
    this.loadLocationsAndPostExecutors($event.value.id);
  }

  locationSelectionChange(value: any) {
    this.locationIdentity = value.id;
    this.locationDataIdentity = value.locationDataId;
    this.experimentOutputDataSource.data = [];
    this.duplicateExperimentsDataSource.data = [];
  }

  private locationChange() {
    this.filteredLocationOptions = (this.formGroup.get('staticGroup') as FormGroup).controls[
      'location'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.filter(value, this.locations, 'names');
      })
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
    return options.filter((option) => {
      if (!isNotNullOrUndefined(option) || !isNotNullOrUndefined(option[param])) {
        return false;
      }
      return option[param].toLowerCase().includes(filterValue);
    });
  }

  public filterList(filterValues: string[], options: any[], param: string): any[] {
    if (!isNotNullOrUndefined(filterValues) || !isNotNullOrUndefined(options)) {
      return options || [];
    }
    return options.filter((option) => {
      if (!isNotNullOrUndefined(option) || !isNotNullOrUndefined(option[param])) {
        return false;
      }
      return filterValues.includes(option[param]);
    });
  }

  public filterList2(options: any[], param: string): any[] {
    if (!isNotNullOrUndefined(options)) {
      return [];
    }
    return options.filter((option) => {
      if (!isNotNullOrUndefined(option) || !isNotNullOrUndefined(option[param])) {
        return false;
      }
      return option[param] && Object.keys(option[param]).length > 0;
    });
  }

  public filterList3(options: any[], param: string): any[] {
    if (!isNotNullOrUndefined(options)) {
      return [];
    }
    return options.filter((option) => {
      if (!isNotNullOrUndefined(option) || isNotNullOrUndefined(option[param])) {
        return false;
      }
      return true;
    });
  }

  defaultExecutorsChangeListener(rf: Executor) {
    if (this.experimentTypeSubscriber) {
      this.experimentTypeSubscriber.unsubscribe();
    }
    const optimizationParametersRequiments: ExecutorRequirement<any>[] = this.filterList(['optimization_parameter'], rf.executorRequirement, 'category');
    this.infoRequements[0].options = rf.actions;
    this.infoRequements[0].defaults = rf.actions[0]
    this.allRequements = [...this.infoRequements, ...rf.executorRequirement];
    this.formGroup.controls['dynamicGroup'] = this.dynamicFormService.toFormGroup(this.allRequements as ExecutorRequirement<any>[]);
    this.allRequements.forEach(requirement => {
      if (!isNotNullOrUndefined(requirement.optimizationEnvelope) || Object.keys(requirement.optimizationEnvelope).length < 1) { return; }
      const filteredFormsAndFormGroup = this.dynamicFormService.toFilteredFormGroup(
        this.optimizationEnvelopeRequiments as ExecutorRequirement<any>[], requirement.optimizationEnvelope);
      this.formGroup.controls[requirement.name] = filteredFormsAndFormGroup.formGroup;
      this.filteredOptimizationEnvelopeRequiments[requirement.name] = filteredFormsAndFormGroup.filteredForms;
    });
    this.experimentTypeSubscriber = (this.formGroup.get('dynamicGroup') as FormGroup).controls['experimentType']
    .valueChanges.subscribe(value => {
      if (value === 'Model Evaluation') {
        this.duplicateExperimentsDataSource.data = [];
        this.apiService.getExperimentOutputByLocationIdAndPostExecutorId(this.locationIdentity, rf.id).subscribe(
          output => {
            this.experimentOutputDataSource.data = output['entity'];
            setTimeout(() => {
              this.experimentOutputDataSource.paginator = this.experimentOutputPaginator;
              this.experimentOutputDataSource.sort = this.experimentOutputSort;
            });
          },
          error => {
            console.log(error);
          }
        );
      } else {
        // TODO: Remove the calibrated params if any and show OptimizationEnvelope content
        this.experimentOutputDataSource.data = [];
        Object.keys(this.formGroup.controls).forEach(control => {
          if (['staticGroup', 'dynamicGroup'].indexOf(control) === -1) {
            this.formGroup.removeControl(control);
           }
        });

        this.infoRequements[0].options = rf.actions;
        this.infoRequements[0].defaults = rf.actions[0]
        this.allRequements = [...this.infoRequements, ...rf.executorRequirement];

        this.allRequements.forEach(requirement => {
          if ((isNotNullOrUndefined(requirement.optimizationEnvelope)
          && Object.keys(requirement.optimizationEnvelope).length > 0)
          || requirement.name === 'experimentType') { return; }
          (this.formGroup.get('dynamicGroup') as FormGroup).controls[requirement.name]
          .setValue(requirement.value ? requirement.value : requirement.defaults);
          requirement.readonly === 'true'
          ? (this.formGroup.get('dynamicGroup') as FormGroup).controls[requirement.name].disable({ onlySelf: true })
          : (this.formGroup.get('dynamicGroup') as FormGroup).controls[requirement.name].enable()
        });

        this.allRequements.forEach(requirement => {
          if (!isNotNullOrUndefined(requirement.optimizationEnvelope)
          || Object.keys(requirement.optimizationEnvelope).length < 1) { return; }
          const filteredFormsAndFormGroup = this.dynamicFormService.toFilteredFormGroup(
            this.optimizationEnvelopeRequiments as ExecutorRequirement<any>[], requirement.optimizationEnvelope);
          this.formGroup.controls[requirement.name] = filteredFormsAndFormGroup.formGroup;
          this.filteredOptimizationEnvelopeRequiments[requirement.name] = filteredFormsAndFormGroup.filteredForms;
        });
        // window.location.reload();
      }
    });
  }

  getParameter(currentRequirement: ExecutorRequirement<any>, param: string) {
    let message = ``;
    if (param === 'date') {
      message = currentRequirement.optimizationEnvelope.date
      ? EXPERIMENTS_CONSTANTS.DATE + currentRequirement.optimizationEnvelope.date
      : (currentRequirement.optimizationEnvelope.startDate && currentRequirement.optimizationEnvelope.endDate)
      ? EXPERIMENTS_CONSTANTS.DATES + currentRequirement.optimizationEnvelope.startDate + ` - `
      + currentRequirement.optimizationEnvelope.endDate
      : currentRequirement.optimizationEnvelope.startDate
      ? EXPERIMENTS_CONSTANTS.DATES + currentRequirement.optimizationEnvelope.startDate + ` - `
      : currentRequirement.optimizationEnvelope.endDate
      ? EXPERIMENTS_CONSTANTS.DATES_DASH + currentRequirement.optimizationEnvelope.endDate
      : ``;
    } else if (param === 'parameter') {
      message = currentRequirement.optimizationEnvelope.value
      ? currentRequirement.name + ` - (` + currentRequirement.optimizationEnvelope.value + `)`
      : (currentRequirement.optimizationEnvelope.minValue && currentRequirement.optimizationEnvelope.maxValue)
      ? currentRequirement.name + ` - (` + currentRequirement.optimizationEnvelope.minValue + ` - `
      + currentRequirement.optimizationEnvelope.maxValue + `)`
      : currentRequirement.optimizationEnvelope.minValue
      ? currentRequirement.name + ` - (` + currentRequirement.optimizationEnvelope.minValue + ` - )`
      : currentRequirement.optimizationEnvelope.maxValue
      ? currentRequirement.name + ` - ( - ` + currentRequirement.optimizationEnvelope.maxValue + `)`
      : currentRequirement.name;
    }
    return message;
  }

  expTypeDropdownChangeListener($event: MatSelectChange) {
    this.tasks =
      $event.value === EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.CALIBRATION
        ? [EXPERIMENTS_CONSTANTS.TASKS.MULTIPLE]
        : this.user.type === 'DM'
        ? [EXPERIMENTS_CONSTANTS.TASKS.SINGLE, EXPERIMENTS_CONSTANTS.TASKS.CONTINUOUS]
        : [EXPERIMENTS_CONSTANTS.TASKS.SINGLE, EXPERIMENTS_CONSTANTS.TASKS.MULTIPLE, EXPERIMENTS_CONSTANTS.TASKS.CONTINUOUS];
    // this.formGroup.controls['tasks'].setValue('');
    this.actionList = [];
  }

  tasksDropdownChangeListener($event: MatSelectChange) {
    this.actionList = [];
  }

  openActionsDialog(form) {
    form['location'] = this.locationIdentity;
    this.formData = form;

    this.subscribeExperimentDialogService = this.experimentDialogService
      .openDialog(form.tasks, form)
      .subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data) || data === '') {
            return;
          }
          if (form['tasks'] === EXPERIMENTS_CONSTANTS.TASKS.SINGLE) {
            this.actionList.push(this.getInterventionDate(data));
          } else if (form['tasks'] === EXPERIMENTS_CONSTANTS.TASKS.MULTIPLE) {
            if (form['experiment_type'] === EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.PREDICTION) {
              this.actionList.push(this.getStartAndEndDates(data));
            } else if (form['experiment_type'] === EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.CALIBRATION) {
              // data['coverageMinMax'] = [data['coverageMin'], data['coverageMax']];
              // this.actionList.push(data);
              data['location'] = 'UG';
              data['model_name'] = 'maksphcovid19modelv1';
              this.actionList.push(this.getInterventionDate(data));
            }
          } else if (form['tasks'] === EXPERIMENTS_CONSTANTS.TASKS.CONTINUOUS) {
            this.actionList.push(this.getContinuousInterventions(data));
          }
        },
        (error) => {
          this.snackBar.open(EXPERIMENTS_CONSTANTS.ACTION_UPDATE_FAILED, EXPERIMENTS_CONSTANTS.CLOSE, {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  private getStartAndEndDates(params) {
    const startDate = params.startDate;
    const year = startDate.getFullYear();
    params.startDate = this.formatDate(new Date(startDate));
    startDate.setFullYear(year + params.numberOfSimulationYears);
    params.endDate = this.formatDate(new Date(startDate));
    return params;
  }

  private getInterventionDate(params) {
    const time = params.time;
    params.time = this.formatDate(new Date(time));
    return params;
  }

  private getContinuousInterventions(params) {
    const time = params.time;
    params.time = this.formatDate(new Date(time));
    const timeEnd = params.timeEnd;
    params.timeEnd = this.formatDate(new Date(timeEnd));
    params['days'] = getDaysBetweenTimestampInDays(
      new Date(params.timeEnd).getTime(),
      new Date(params.time).getTime()
    );
    return params;
  }

  private formatDate(date: Date) {
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    return formattedDate.toString();
  }

  removeAction(actionRange, i): void {
    this.actionList.splice(i, 1);
  }

  private setOptions() {
    this.options = {
      floor: 0,
      ceil: 100,
      step: 1,
      translate: (value: number): string => `${value}%`,
      disabled: false,
      readOnly: false,
    };
  }

  onHeaderClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onDotClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  private loadMoreData() {
    this.subscribeModels = this.apiService
      .getAllModels()
      .pipe(
        concatMap((models) => {
          if (isNotNullOrUndefined(models)) {
            this.models = models.filter((model) => model.active === true);
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
              (this.formGroup.get('staticGroup') as FormGroup).controls['executor'].setValue(currentModel[0]);
              if (isNotNullOrUndefined(currentModel[0].defaultPostExecutor)) {
                this.defaultExecutors = currentModel[0].defaultPostExecutor;
              }
            }
          }
          this.loadLocationsAndPostExecutors(modelId, locationId);
        },
        (error) => {
          this.snackBar.open(EXPERIMENTS_CONSTANTS.MODELS_NOT_FOUND, EXPERIMENTS_CONSTANTS.CLOSE, {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  private loadLocationsAndPostExecutors(modelId: string, locationId?: string) {
    this.subscribeLocations = this.apiService
      .getLocationData(null, modelId, null, null)
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
                this.locationIdentity = currentLocation[0].id;
                this.locationDataIdentity = currentLocation[0].locationDataId;
                (this.formGroup.get('staticGroup') as FormGroup).controls['location'].setValue(
                  currentLocation[0].names
                );
              }
            }
          }
        },
        (error) => {
          this.snackBar.open(EXPERIMENTS_CONSTANTS.LOCATION_NOT_FOUND, EXPERIMENTS_CONSTANTS.CLOSE, {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  runExperiment(value: any) {
    // const formPayload = JSON.stringify(this.formGroup.getRawValue());
    const formPayload = this.formGroup.getRawValue();

    const experimentData = formPayload['dynamicGroup'];
    const calibratedParams = [];
    Object.keys(formPayload).forEach(key => {
      if (key !== 'dynamicGroup' && key !== 'staticGroup') {
        experimentData[key] = formPayload[key];
        isNotNullOrUndefined(experimentData[key]['value']) ? calibratedParams.push(experimentData[key]['value']) : console.log();
      }
    });
    if (experimentData['experimentType'] === 'Model Evaluation') {
      experimentData['calibratedParams'] = calibratedParams;
    }
    const experimentPayload: Experiments = {};
    experimentPayload.name = formPayload['dynamicGroup']['name'];
    experimentPayload.userId = (this.user && this.user['sub']) ? this.user['sub'] : 'guest';
    experimentPayload.timestamp = Date.now();
    experimentPayload.status = false;
    experimentPayload.data = JSON.stringify(JSON.stringify(experimentData));
    experimentPayload.description = formPayload['dynamicGroup']['description'];
    experimentPayload.experimentType = formPayload['dynamicGroup']['experimentType'];
    experimentPayload.location = { id: this.locationIdentity };
    experimentPayload.executor = formPayload['staticGroup']['executor'];
    experimentPayload.selectedPostExecutor = [formPayload['staticGroup']['selectedPostExecutor']];
    experimentPayload.algorithmId = this.filterForAlgorithmIdGivenName(formPayload['dynamicGroup']['algorithmId'], this.algorithms);
    console.log(experimentPayload);
    if (this.subscribePostExperiment) {
      this.subscribePostExperiment.unsubscribe();
    }
    this.subscribePostExperiment = this.apiService
      .postExperiment(experimentPayload, experimentPayload.experimentType === 'Model Evaluation' ? false : true)
      .subscribe((outcome) => {
        if (!outcome['entity'] || !outcome['entity'][0]) {
          this.snackBar.open(EXPERIMENTS_CONSTANTS.EXPERIMENT_CREATION_FAILED + experimentPayload['name'], EXPERIMENTS_CONSTANTS.CLOSE, {
            duration: SNACK_BAR_DURATION,
          });
          return;
        }

        if (outcome['status'] === 201) {
          this.itemsDataSource.data = [...outcome['entity'], ...this.itemsDataSource.data];
          this.snackBar.open(EXPERIMENTS_CONSTANTS.EXPERIMENT_CREATION_SUCCESSFUL
            + experimentPayload['name'], EXPERIMENTS_CONSTANTS.CLOSE, {
              duration: SNACK_BAR_DURATION,
          });
          this.router.navigate(['/results'], {
            queryParams: {
              modelId: '' + outcome['entity'][0]['executor']['id'],
              locationId: '' + outcome['entity'][0]['location']['id'],
              experimentId: '' + outcome['entity'][0]['id'],
            },
          });
        } else if (outcome['status'] === 200) {
          this.duplicateExperimentsDataSource.data = outcome['entity'];
          setTimeout(() => {
            this.duplicateExperimentsDataSource.paginator = this.duplicateExperimentsPaginator;
            this.duplicateExperimentsDataSource.sort = this.duplicateExperimentsSort;
          });

          this.confirmDialogService.openDialog('confirmation',EXPERIMENTS_CONSTANTS.SIMILAR_EXPERIMENT_CONFIRMATION).subscribe(response => {
            if (response) {
              if (this.subscribePostExperiment) {
                this.subscribePostExperiment.unsubscribe();
              }
              this.subscribePostExperiment = this.apiService.postExperiment(experimentPayload, false).subscribe(newOutcome => {
                if (!newOutcome['entity'] || !newOutcome['entity'][0]) {
                  this.snackBar.open(EXPERIMENTS_CONSTANTS.EXPERIMENT_CREATION_FAILED
                    + experimentPayload['name'], EXPERIMENTS_CONSTANTS.CLOSE, {
                    duration: SNACK_BAR_DURATION,
                  });
                  return;
                }
                this.itemsDataSource.data = [...newOutcome['entity'], ...this.itemsDataSource.data];
                this.snackBar.open(EXPERIMENTS_CONSTANTS.EXPERIMENT_CREATION_SUCCESSFUL
                  + experimentPayload['name'], EXPERIMENTS_CONSTANTS.CLOSE, {
                  duration: SNACK_BAR_DURATION,
                });
                this.router.navigate(['/results'], {
                  queryParams: {
                    modelId: '' + newOutcome['entity'][0]['executor']['id'],
                    locationId: '' + newOutcome['entity'][0]['location']['id'],
                    experimentId: '' + newOutcome['entity'][0]['id'],
                  },
                });
              }, newError => {
                this.snackBar.open(EXPERIMENTS_CONSTANTS.EXPERIMENT_CREATION_FAILED
                  + experimentPayload['name'], EXPERIMENTS_CONSTANTS.CLOSE, {
                  duration: SNACK_BAR_DURATION,
                });
              });
            } else {
              console.log('Use duplicate!');
            }
          }, error => {
            console.log('Highly unusual case!');
          });
        } else {
          console.log('Highly unusual case!');
        }
    });
  }

  experimentOutput(item: ExperimentOutput) {
    if (!isNotNullOrUndefined(item) || !isNotNullOrUndefined(item.experiment) || !isNotNullOrUndefined(item.experiment.data)) {
      console.log('Experiment data missing!');
      return;
    }
    const data = JSON.parse(item.experiment.data);
    Object.keys((this.formGroup.get('dynamicGroup') as FormGroup).controls).forEach(control => {
      if (control in data && control !== 'experimentType' && control !== 'end_date') {
        (this.formGroup.get('dynamicGroup') as FormGroup).controls[control].setValue(data[control]);
        (this.formGroup.get('dynamicGroup') as FormGroup).controls[control].disable({ onlySelf: true })
      }
    });
    this.apiService.getExperimentOutputByExperimentOutputId(item.id).subscribe(
      output => {
        if (!isNotNullOrUndefined(output) || !isNotNullOrUndefined(output['actions'])) { return; }
        Object.keys(this.formGroup.controls).forEach(control => {
          if (['staticGroup', 'dynamicGroup'].indexOf(control) === -1) {
            this.formGroup.removeControl(control);
           }
        });
        this.allRequements = this.filterList3(this.allRequements, 'optimizationEnvelope')
        for (const action of output['actions']) {
          const executorRequirement: ExecutorRequirement<string> = new ExecutorRequirement({
            id: action['action_name'] + '-' + action['action_position'],
            name: action['action_name'] + '-' + action['action_position'],
            category: 'optimization_parameter',
            type: 'number',
            defaults: action['action_value'],
            required: 'true',
            hidden: 'false',
            value: action['action_value'],
            readonly: 'true',
            description: action['action_name'] + ' at position ' + action['action_position']
          });
          executorRequirement.options = [];
          executorRequirement.metadataDetailsList = [];

          const optimizationEnvelope: OptimizationEnvelope = {};
          optimizationEnvelope.value = action['action_value'];
          optimizationEnvelope.startDate = action['action_start_date'];
          optimizationEnvelope.endDate = action['action_end_date'];

          executorRequirement.optimizationEnvelope = optimizationEnvelope;

          this.allRequements.push(executorRequirement);
        }

        this.allRequements.forEach(requirement => {
          if (!isNotNullOrUndefined(requirement.optimizationEnvelope)
          || Object.keys(requirement.optimizationEnvelope).length < 1) { return; }
          const filteredFormsAndFormGroup = this.dynamicFormService.toFilteredFormGroup(
            this.optimizationEnvelopeRequiments as ExecutorRequirement<any>[], requirement.optimizationEnvelope);
          this.formGroup.controls[requirement.name] = filteredFormsAndFormGroup.formGroup;
          this.filteredOptimizationEnvelopeRequiments[requirement.name] = filteredFormsAndFormGroup.filteredForms;
        });
      },
      error => {
        console.log(error);
      }
    );
  }
}
