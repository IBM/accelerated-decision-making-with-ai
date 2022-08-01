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
  ElementRef,
  NgZone,
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
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { concatMap, map, startWith } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  ConfirmDialogService,
  DataService,
  UserService,
} from '../../../common/services';
import {
  DROPDOWN_ITEMS_GEO,
  SNACK_BAR_DURATION,
} from '../../../common/constants';
import { Executor, ExecutorRequirement, User, Location, ModelMetadata } from '../../../common/models';
import { ApiService } from '../../../common/services/api/api.service';
import { ModelDialogService } from '../../services/model-dialog/model-dialog.service';
import { RewardFunctionsDialogService } from '../../services/reward-functions-dialog/reward-functions-dialog.service';
import { filterOut } from 'src/modules/common/functions/functions';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
})
export class ModelsComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscribeModels: any;
  private subscribeModelDialogService: any;
  private subscribeCreateModel: any;
  private subscribeUpdateModel: any;
  itemsDataSource = new MatTableDataSource();
  displayedColumnsForItems = ['name', 'version_author'];

  @ViewChild('rewardFunctionsSort', { static: true })
  rewardFunctionsSort: MatSort;
  @ViewChild('rewardFunctionsPaginator', { static: true })
  rewardFunctionsPaginator: MatPaginator;
  private subscribeRewardFunctions: any;
  private subscribeRewardFunctionsDialogService: any;
  private subscribeCreateRewardFunctions: any;
  private subscribeUpdateRewardFunctions: any;
  rewardFunctionsDataSource = new MatTableDataSource();
  displayedColumnsForRewardFunctions = ['title', 'action'];

  @ViewChild('admin0') admin0Field: ElementRef;
  @ViewChild('admin1') admin1Field: ElementRef;
  @ViewChild('admin2') admin2Field: ElementRef;
  ADMIN_0 = [];
  ADMIN_1 = [];
  ADMIN_2 = [];
  filteredAdmin0Options: Observable<any[]>;
  filteredAdmin1Options: Observable<any[]>;
  filteredAdmin2Options: Observable<any[]>;
  adminParams: any = {
    adminLevel: 0,
    geo: undefined,
    parentGeo: DROPDOWN_ITEMS_GEO[0],
    admin0: null,
    admin1: undefined,
    admin2: undefined,
  };

  formGroup: FormGroup;
  currentModel: Executor;
  isVisible = false;
  markers: L.Marker[] = [];
  geoJson: any = [];
  private subscribeLoadWorldGeoJson: any;
  private rawGEOJSONObject: any;
  private subscribeLoadSelectedCountryAdmin1GeoJson: any;
  private locations: Location[] = [];
  private generalLocations: Location[] = [];
  private subscribeLocations: any;
  bounds: any;
  modelMetadataList: ModelMetadata[] = [];

  private subscribeUpdateLocation: any;
  private subscribeCreateLocation: any;
  private subscribeCreateDataRepositoryConfiguration: any;
  user: Observable<User>;

  constructor(
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modelDialogService: ModelDialogService,
    private confirmDialogService: ConfirmDialogService,
    private rewardFunctionsDialogService: RewardFunctionsDialogService,
    private userService: UserService
  ) {
    this.user = this.userService.getCurrentUser();
  }

  ngOnInit() {
    this.loadData();
    this.setupForm();
  }

  ngAfterViewInit() {
    this.rewardFunctionsDataSource.paginator = this.rewardFunctionsPaginator;
    this.rewardFunctionsDataSource.sort = this.rewardFunctionsSort;
  }

  ngOnDestroy(): void {
    this.dataService.changeModelMetadata(null);
    if (this.subscribeModels) {
      this.subscribeModels.unsubscribe();
    }
    if (this.subscribeModelDialogService) {
      this.subscribeModelDialogService.unsubscribe();
    }
    if (this.subscribeCreateModel) {
      this.subscribeCreateModel.unsubscribe();
    }
    if (this.subscribeUpdateModel) {
      this.subscribeUpdateModel.unsubscribe();
    }
    if (this.subscribeRewardFunctions) {
      this.subscribeRewardFunctions.unsubscribe();
    }
    if (this.subscribeRewardFunctionsDialogService) {
      this.subscribeRewardFunctionsDialogService.unsubscribe();
    }
    if (this.subscribeCreateRewardFunctions) {
      this.subscribeCreateRewardFunctions.unsubscribe();
    }
    if (this.subscribeUpdateRewardFunctions) {
      this.subscribeUpdateRewardFunctions.unsubscribe();
    }
    if (this.subscribeLoadWorldGeoJson) {
      this.subscribeLoadWorldGeoJson.unsubscribe();
    }
    if (this.subscribeLoadSelectedCountryAdmin1GeoJson) {
      this.subscribeLoadSelectedCountryAdmin1GeoJson.unsubscribe();
    }
    if (this.subscribeLocations) {
      this.subscribeLocations.unsubscribe();
    }
    if (this.subscribeUpdateLocation) {
      this.subscribeUpdateLocation.unsubscribe();
    }
    if (this.subscribeCreateLocation) {
      this.subscribeCreateLocation.unsubscribe();
    }
    if (this.subscribeCreateDataRepositoryConfiguration) {
      this.subscribeCreateDataRepositoryConfiguration.unsubscribe();
    }
  }

  /**
   * Get all models and list them in a table
   */
  private getAllModels() {
    this.subscribeModels = this.apiService.getAllModels().subscribe(
      (data) => {
        if (isNotNullOrUndefined(data)) {
          this.currentModel = data[0];
          this.itemsDataSource.data = data;
        }
      },
      (error) => {
        this.snackBar.open('Could not find models : ', 'close', {
          duration: SNACK_BAR_DURATION,
        });
      }
    );
  }

  openModelDialog(inputModel?: Executor) {
    this.subscribeModelDialogService = this.modelDialogService
      .openDialog('model', inputModel)
      .subscribe(
        (model) => {
          if (!isNotNullOrUndefined(model) || !isNotNullOrUndefined(model['name'])) {
            return;
          }
          console.log(model);
          if (!isNotNullOrUndefined(model['id'])) {
            model['active'] = false;
            model['verified'] = false;
            model['actions'] = [];
            const executorRequirement: ExecutorRequirement<string> = new ExecutorRequirement({
              value: model['modelDataUrl'], description: model['modelDataDescription'],
              name: 'model_data', category: 'data', type: 'string', hidden: 'true',
              required: 'true', readonly: 'true'
            });
            model['executorRequirement'] = [executorRequirement];
            this.subscribeCreateModel = this.apiService
              .postModel(model)
              .subscribe(
                (outcome) => {
                  this.itemsDataSource.data.push(outcome['entity']);
                  this.currentModel = outcome['entity'];
                  this.resetAdmin(-1);
                  this.rewardFunctionsDataSource.data = [];
                  this.snackBar.open(
                    'Model Creation Successful: ' + model['name'],
                    'close',
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                },
                (error) => {
                  console.log(error);
                  this.snackBar.open(
                    'Could not create model!: ' + model['name'],
                    'close',
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                }
              );
          } else {
            const updateModel: Executor = Object.assign({}, this.currentModel);
            updateModel.title = model['title'];
            updateModel.name = model['name'];
            updateModel.version = model['version'];
            updateModel.versionAuthor = model['versionAuthor'];
            updateModel.versionDate = model['versionDate'];
            updateModel.githubLink = model['githubLink'];
            updateModel.uri = model['uri'];
            updateModel.runCommand = model['runCommand'];
            const executorRequirement: ExecutorRequirement<string> = updateModel.executorRequirement[0];
            executorRequirement.value = model['modelDataUrl']
            executorRequirement.description = model['modelDataDescription']
            updateModel.executorRequirement = [executorRequirement];
            this.subscribeUpdateModel = this.apiService
              .updateModel(model['id'], updateModel)
              .subscribe(
                (outcome) => {
                  const temp: Executor[] = filterOut(
                    model['id'],
                    this.itemsDataSource.data
                  );
                  temp.push(outcome['entity']);
                  this.itemsDataSource.data = temp;
                  this.currentModel = outcome['entity'];
                  this.resetAdmin(-1);
                  this.snackBar.open(
                    'Model Update Successful: ' + model['id'],
                    'close',
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                },
                (error) => {
                  console.log(error);
                  this.snackBar.open(
                    'Could not update model!: ' + model['id'],
                    'close',
                    {
                      duration: SNACK_BAR_DURATION,
                    }
                  );
                }
              );
          }
        },
        (error) => {
          this.snackBar.open('Entered Model update failed', 'close', {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  getStatus(provisioned) {
    if (provisioned) {
      return 'Provisioned';
    } else {
      return 'Provisioning';
    }
  }

  openRewardFunctionDialog(inputRewardFunction?: Executor) {
    this.subscribeRewardFunctionsDialogService =
      this.rewardFunctionsDialogService
        .openDialog('reward_function', inputRewardFunction)
        .subscribe((rewardFunction) => {
            console.log(rewardFunction);
            if (!isNotNullOrUndefined(rewardFunction) || !isNotNullOrUndefined(rewardFunction['title'])) {
              return;
            }
            if (!isNotNullOrUndefined(rewardFunction['id'])) {
              rewardFunction['active'] = false;
              rewardFunction['verified'] = false;
              this.subscribeCreateRewardFunctions = this.apiService
                .postRewardFunction(rewardFunction)
                .subscribe(
                  (outcome) => {
                    if (!isNotNullOrUndefined(this.currentModel.defaultPostExecutor)) {
                      this.currentModel.defaultPostExecutor = [];
                    }
                    this.currentModel.defaultPostExecutor.push(
                      outcome['entity']
                    );
                    this.rewardFunctionsDataSource.data =
                      this.currentModel.defaultPostExecutor;
                    this.apiService
                      .updateModel(this.currentModel.id, this.currentModel)
                      .subscribe((newOutcome) => {
                        const tempModel = filterOut(
                          this.currentModel['id'],
                          this.itemsDataSource.data
                        );
                        tempModel.push(newOutcome['entity']);
                        this.itemsDataSource.data = tempModel;
                        this.currentModel = newOutcome['entity'];
                        this.snackBar.open(
                          'Reward function Creation Successful: ' +
                            rewardFunction['title'],
                          'close',
                          {
                            duration: SNACK_BAR_DURATION,
                          }
                        );
                      });
                  },
                  (error) => {
                    console.log(error);
                    this.snackBar.open(
                      'Could not create reward function!: ' +
                        rewardFunction['title'],
                      'close',
                      {
                        duration: SNACK_BAR_DURATION,
                      }
                    );
                  }
                );
            } else {
              this.subscribeUpdateRewardFunctions = this.apiService
                .updateRewardFunction(rewardFunction['id'], rewardFunction)
                .subscribe(
                  (outcome) => {
                    const temp: Executor[] = filterOut(
                      rewardFunction['id'],
                      this.currentModel.defaultPostExecutor
                    );
                    temp.push(outcome['entity']);
                    this.currentModel.defaultPostExecutor = temp;
                    this.rewardFunctionsDataSource.data =
                      this.currentModel.defaultPostExecutor;
                    this.apiService
                      .updateModel(this.currentModel.id, this.currentModel)
                      .subscribe((newOutcome) => {
                        const tempModel = filterOut(
                          this.currentModel['id'],
                          this.itemsDataSource.data
                        );
                        tempModel.push(newOutcome['entity']);
                        this.itemsDataSource.data = tempModel;
                        this.currentModel = newOutcome['entity'];
                        this.snackBar.open(
                          'Reward function Update Successful: ' +
                            rewardFunction['id'],
                          'close',
                          {
                            duration: SNACK_BAR_DURATION,
                          }
                        );
                      });
                  },
                  (error) => {
                    console.log(error);
                    this.snackBar.open(
                      'Could not update reward function!: ' +
                        rewardFunction['id'],
                      'close',
                      {
                        duration: SNACK_BAR_DURATION,
                      }
                    );
                  }
                );
            }
          },
          (error) => {
            this.snackBar.open(
              'Entered reward function update failed',
              'close',
              {
                duration: SNACK_BAR_DURATION,
              }
            );
          }
        );
  }

  private loadGeoJson(selectedModelMetadata?: ModelMetadata) {
    this.subscribeLoadWorldGeoJson = this.apiService
      .getLocationData(
        '' + this.adminParams.adminLevel,
        this.currentModel.id,
        this.adminParams.admin0,
        this.adminParams.parentGeo
      )
      .pipe(
        concatMap((locations) => {
          this.locations = locations;
          return this.apiService.getLocationsGivenAdminLevel(
            this.adminParams.adminLevel,
            this.adminParams.admin0,
            this.adminParams.parentGeo
          );
        })
      )
      .pipe(
        concatMap((admin0Locations) => {
          if (isNotNullOrUndefined(admin0Locations)) {
            this.generalLocations = admin0Locations;
          }
          if (this.adminParams.parentGeo === DROPDOWN_ITEMS_GEO[0]) {
            return this.apiService.loadWorldGeoJson();
          } else if (
            this.adminParams.adminLevel === 1 ||
            this.adminParams.adminLevel === 2
          ) {
            return this.apiService.loadSelectedCountryAdminxGeoJson(
              this.adminParams.parentGeo,
              this.adminParams
            );
          }
        })
      )
      .subscribe((geojson) => {
        this.rawGEOJSONObject = geojson;
        this.reloadData();
      });
  }

  private reloadData(selectedModelMetadata?: ModelMetadata) {
    this.markers = [];
    this.geoJson = [];
    this.bounds = undefined;
    let tempBounds;
    const tempGeoJson: L.Layer[] = [];
    if (
      !isNotNullOrUndefined(this.rawGEOJSONObject) ||
      !isNotNullOrUndefined(this.rawGEOJSONObject['features'])
    ) {
      return;
    }
    // loop through each map feature
    Object.keys(this.rawGEOJSONObject['features']).forEach((key, index) => {
      if (this.rawGEOJSONObject['features'].hasOwnProperty(key)) {
        const thisFeature = this.rawGEOJSONObject['features'][key];
        const modelMetadata: ModelMetadata = {};
        const singleJson = L.geoJSON(thisFeature, {
          style: (feature) => {
            return this.setLayerStyle('#d9d9d9', 1.5, '#ccc', 0.6, '2');
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                // e.target.setStyle({
                //   weight: 3,
                //   color: '#3f51b5',
                //   dashArray: '',
                //   fillOpacity: 0.7
                // });
                //
                // if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
                //   e.target.bringToFront();
                // }
              },
              mouseout: (e) => {
                // e.target.setStyle({
                //   weight: 2,
                //   opacity: 1,
                //   color: '#545454',
                //   dashArray: '3',
                //   fillOpacity: 0.7
                // });
              },
              click: (e) => {
                this.ngZone.run(() =>
                  this.processLocationChange(modelMetadata)
                );
              },
            });
          },
        });
        const response: Location[] = this._filter(
          thisFeature['properties']['NAME'],
          this.locations
        );
        modelMetadata.location = response[0];
        const response2: Location[] = this._filter(
          thisFeature['properties']['NAME'],
          this.generalLocations
        );
        modelMetadata.generalLocation = response2[0];
        modelMetadata.admin_level = !isNotNullOrUndefined(
          thisFeature['properties']['ADMIN_LEVEL']
        )
          ? 0
          : thisFeature['properties']['ADMIN_LEVEL'];
        modelMetadata.admin_type = !isNotNullOrUndefined(
          thisFeature['properties']['ADMIN_TYPE']
        )
          ? 'Country'
          : thisFeature['properties']['ADMIN_TYPE'];
        modelMetadata.country = !isNotNullOrUndefined(
          thisFeature['properties']['ISO_A3']
        )
          ? thisFeature['properties']['ADMIN0']
          : thisFeature['properties']['ISO_A3'];
        modelMetadata.localisedModelDriverDataExists = isNotNullOrUndefined(
          modelMetadata.location
        );
        modelMetadata.located_in = !isNotNullOrUndefined(
          thisFeature['properties']['ADMIN1']
        )
          ? ''
          : thisFeature['properties']['ADMIN1'];
        modelMetadata.located_in =
          modelMetadata.located_in === ''
            ? modelMetadata.country
            : modelMetadata.located_in + ', ' + modelMetadata.country;
        modelMetadata.name = thisFeature['properties']['NAME'];
        modelMetadata.modelId = this.currentModel.id;
        modelMetadata.modelName = this.currentModel.title;
        modelMetadata.provisioned = this.currentModel.active;
        if (modelMetadata.admin_level === 0) {
          modelMetadata.adminLevelList = [];
          const temp = this.filter(modelMetadata.name, this.ADMIN_0);
          if (!isNotNullOrUndefined(temp) || !isNotNullOrUndefined(temp[0])) {
            this.ADMIN_0.push(modelMetadata);
          }
        } else if (modelMetadata.admin_level === 1) {
          modelMetadata.adminLevelList = [
            { levelId: 0, levelName: modelMetadata.country },
          ];
          const temp = this.filter(modelMetadata.name, this.ADMIN_1);
          if (!isNotNullOrUndefined(temp) || !isNotNullOrUndefined(temp[0])) {
            this.ADMIN_1.push(modelMetadata);
          }
        } else if (modelMetadata.admin_level === 2) {
          modelMetadata.adminLevelList = [
            { levelId: 0, levelName: modelMetadata.country },
            { levelId: 1, levelName: thisFeature['properties']['ADMIN1'] },
          ];
          const temp = this.filter(modelMetadata.name, this.ADMIN_2);
          if (!isNotNullOrUndefined(temp) || !isNotNullOrUndefined(temp[0])) {
            this.ADMIN_2.push(modelMetadata);
          }
        }

        if (isNotNullOrUndefined(modelMetadata.location)) {
          singleJson.setStyle(
            this.setLayerStyle('#3f51b5', 2.5, '#ccc', 0, '2')
          );
        }

        if (
          isNotNullOrUndefined(selectedModelMetadata) &&
          selectedModelMetadata.name === modelMetadata.name
        ) {
          Object.keys(singleJson['_layers']).forEach(
            (element, elementIndex) => {
              if (elementIndex === 0) {
                tempBounds = singleJson['_layers'][element].getBounds();
              } else {
                tempBounds.extend(singleJson['_layers'][element].getBounds());
              }
            }
          );
          if (!isNotNullOrUndefined(selectedModelMetadata.location)) {
            singleJson.setStyle(
              this.setLayerStyle('#d9d9d9', 3, '#606060', 1, '')
            );
          } else {
            singleJson.setStyle(
              this.setLayerStyle('#3f51b5', 5, '#606060', 1, '')
            );
          }
        } else if (!isNotNullOrUndefined(selectedModelMetadata)) {
          Object.keys(singleJson['_layers']).forEach((element) => {
            if (index === 0) {
              tempBounds = singleJson['_layers'][element].getBounds();
            } else {
              tempBounds.extend(singleJson['_layers'][element].getBounds());
            }
          });
        }

        tempGeoJson.push(singleJson);
      }
    });
    this.geoJson = tempGeoJson;
    this.bounds = tempBounds;
  }

  private _filter(names: string, locations: Location[]): Location[] {
    let filterValue = names.toLowerCase();
    filterValue = filterValue.trim(); // Remove whitespace
    return locations.filter(
      (option) => option.names.toLowerCase() === filterValue
    );
  }

  /**
   * set fill color
   */
  private setLayerStyle(fillColor, weight, color, opacity, dashArray) {
    return {
      fillColor,
      weight,
      opacity,
      color,
      dashArray,
      fillOpacity: 0.4,
    };
  }

  currentModelDropdownChangeListener($event: MatSelectChange) {
    this.resetAdmin(-1);
    if (isNotNullOrUndefined($event.value.defaultPostExecutor)) {
      this.rewardFunctionsDataSource.data = $event.value.defaultPostExecutor;
    }
    this.isVisible = false;
    this.subscribeLocations = this.apiService
      .getLocationData(
        '' + this.adminParams.adminLevel,
        $event.value.id,
        this.adminParams.admin0,
        this.adminParams.parentGeo
      )
      .pipe(
        concatMap((locations) => {
          this.locations = locations;
          if (this.adminParams.parentGeo === DROPDOWN_ITEMS_GEO[0]) {
            return this.apiService.loadWorldGeoJson();
          } else if (
            this.adminParams.adminLevel === 1 ||
            this.adminParams.adminLevel === 2
          ) {
            return this.apiService.loadSelectedCountryAdminxGeoJson(
              this.adminParams.parentGeo,
              this.adminParams
            );
          }
        })
      )
      .subscribe((geojson) => {
        this.rawGEOJSONObject = geojson;
        this.reloadData();
      });
  }

  loadData() {
    this.subscribeModels = this.apiService
      .getLocationsGivenAdminLevel(
        this.adminParams.adminLevel,
        this.adminParams.admin0,
        this.adminParams.parentGeo
      )
      .pipe(
        concatMap((admin0Locations) => {
          if (isNotNullOrUndefined(admin0Locations)) {
            this.generalLocations = admin0Locations;
          }
          return this.apiService.getAllModels();
        })
      )
      .pipe(
        concatMap((models) => {
          if (isNotNullOrUndefined(models) && isNotNullOrUndefined(models[0])) {
            this.currentModel = models[0];
            if (isNotNullOrUndefined(this.currentModel.defaultPostExecutor)) {
              this.rewardFunctionsDataSource.data =
                this.currentModel.defaultPostExecutor;
            }
            this.itemsDataSource.data = models;
            return this.apiService.getLocationData(
              '' + this.adminParams.adminLevel,
              this.currentModel.id,
              this.adminParams.admin0,
              this.adminParams.parentGeo
            );
          }
          return this.apiService.getLocationData(
            '' + this.adminParams.adminLevel,
            null,
            this.adminParams.admin0,
            this.adminParams.parentGeo
          );
        })
      )
      .pipe(
        concatMap((locations) => {
          this.locations = locations;
          if (this.adminParams.parentGeo === DROPDOWN_ITEMS_GEO[0]) {
            return this.apiService.loadWorldGeoJson();
          } else if (
            this.adminParams.adminLevel === 1 ||
            this.adminParams.adminLevel === 2
          ) {
            return this.apiService.loadSelectedCountryAdminxGeoJson(
              this.adminParams.parentGeo,
              this.adminParams
            );
          }
        })
      )
      .subscribe((geojson) => {
        this.rawGEOJSONObject = geojson;
        this.reloadData();
      }, error => {
        console.error(error);
      });
  }

  admin0SelectionChange(value: any) {
    if (typeof value === 'string') {
      const temp = this.filter(value, this.ADMIN_0);
      if (isNotNullOrUndefined(temp)) {
        value = temp[0];
      }
    }
    this.processLocationChange(value);
  }

  admin1SelectionChange(value: any) {
    if (typeof value === 'string') {
      const temp = this.filter(value, this.ADMIN_1);
      if (isNotNullOrUndefined(temp)) {
        value = temp[0];
      }
    }
    this.processLocationChange(value);
  }

  admin2SelectionChange(value: any) {
    if (typeof value === 'string') {
      const temp = this.filter(value, this.ADMIN_2);
      if (isNotNullOrUndefined(temp)) {
        value = temp[0];
      }
    }
    this.processLocationChange(value);
  }

  /**
   * set up formgroup
   */
  private setupForm() {
    this.formGroup = this.formBuilder.group({
      admin0: new FormControl(''),
      admin1: new FormControl(''),
      admin2: new FormControl(''),
    });
    this.onAdmin0Change();
    this.onAdmin1Change();
    this.onAdmin2Change();
    this.initializeTheForm();
  }

  /**
   * initialize the form
   */
  private initializeTheForm() {
    this.formGroup.controls['admin0'].setValue('All');
    this.formGroup.controls['admin1'].disable({ onlySelf: true });
    this.formGroup.controls['admin2'].disable({ onlySelf: true });
  }

  private filter(value: string, options: any[]): any[] {
    if (!isNotNullOrUndefined(value) || !isNotNullOrUndefined(options)) {
      return [];
    }
    const filterValue = value.toLowerCase();
    if (value === 'all') {
      return options;
    }
    return options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * listen for admin0 changes as the user types
   */
  private onAdmin0Change() {
    this.filteredAdmin0Options = this.formGroup.controls[
      'admin0'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.filter(value, this.ADMIN_0);
      })
    );
  }

  /**
   * listen for admin1 changes as the user types
   */
  private onAdmin1Change() {
    this.filteredAdmin1Options = this.formGroup.controls[
      'admin1'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.filter(value, this.ADMIN_1);
      })
    );
  }

  /**
   * listen for admin2 changes as the user types
   */
  private onAdmin2Change() {
    this.filteredAdmin2Options = this.formGroup.controls[
      'admin2'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.filter(value, this.ADMIN_2);
      })
    );
  }

  private processLocationChange(modelMetadata: ModelMetadata) {
    this.dataService.changeModelMetadata(modelMetadata);
    this.isVisible = true;
    if (
      environment.AVAILABLE_ADMIN1_GEOJSON.includes(modelMetadata.country) &&
      (modelMetadata.admin_level === 0 || modelMetadata.admin_level === 1)
    ) {
      const newLevel = modelMetadata.admin_level + 1;
      this.confirmDialogService
        .openDialog(
          'confirmation',
          'Admin level ' +
            '' +
            newLevel +
            ' data exists for ' +
            modelMetadata.name +
            '.' +
            '\n' +
            'Would you like to load this data?'
        )
        .subscribe(
          (response) => {
            if (response) {
              this.adminParams.parentGeo =
                newLevel === 1 ? modelMetadata.country : modelMetadata.name;
              this.adminParams.geo = modelMetadata.name;
              this.adminParams.adminLevel = newLevel;
              this.adminParams.admin0 = modelMetadata.country;
              this.resetAdmin(newLevel, modelMetadata);
              this.loadGeoJson();
            } else {
              this.formGroup.controls[
                'admin' + modelMetadata.admin_level
              ].setValue(modelMetadata.name);
              if (this.adminParams.adminLevel > modelMetadata.admin_level) {
                this.setAdmin(modelMetadata.admin_level, modelMetadata);
                this.loadGeoJson(modelMetadata);
              } else {
                this.reloadData(modelMetadata);
              }
            }
          },
          (error) => {
            console.error(error);
            this.formGroup.controls[
              'admin' + modelMetadata.admin_level
            ].setValue(modelMetadata.name);
            if (this.adminParams.adminLevel > modelMetadata.admin_level) {
              this.setAdmin(modelMetadata.admin_level, modelMetadata);
              this.loadGeoJson(modelMetadata);
            } else {
              this.reloadData(modelMetadata);
            }
          }
        );
    } else if (this.adminParams.adminLevel > modelMetadata.admin_level) {
      this.formGroup.controls['admin' + modelMetadata.admin_level].setValue(
        modelMetadata.name
      );
      this.setAdmin(modelMetadata.admin_level, modelMetadata);
      this.loadGeoJson(modelMetadata);
    } else {
      this.formGroup.controls['admin' + modelMetadata.admin_level].setValue(
        modelMetadata.name
      );
      this.reloadData(modelMetadata);
    }
  }

  resetAdmin(level: number, modelMetadata?: ModelMetadata) {
    if (level === -1) {
      this.adminParams.admin2 = undefined;
      this.adminParams.admin1 = undefined;
      this.adminParams.admin0 = null;
      this.adminParams.geo = undefined;
      this.adminParams.parentGeo = DROPDOWN_ITEMS_GEO[0];
      this.ADMIN_1 = [];
      this.ADMIN_2 = [];
      this.formGroup.controls['admin1'].setValue(undefined);
      this.formGroup.controls['admin2'].setValue(undefined);
      this.formGroup.controls['admin1'].disable({ onlySelf: true });
      this.formGroup.controls['admin2'].disable({ onlySelf: true });
      this.formGroup.controls['admin0'].setValue('All');
      if (this.adminParams.adminLevel > 0) {
        this.adminParams.adminLevel = 0;
        this.loadGeoJson();
      } else {
        this.adminParams.adminLevel = 0;
        this.reloadData();
      }
      this.isVisible = false;
    } else if (level === 0) {
      this.adminParams.admin0 = null;
      this.adminParams.admin2 = undefined;
      this.adminParams.admin1 = undefined;
      this.adminParams.geo = modelMetadata.name;
      this.adminParams.parentGeo = DROPDOWN_ITEMS_GEO[0];
      this.ADMIN_0 = [];
      this.ADMIN_1 = [];
      this.ADMIN_2 = [];
      this.formGroup.controls['admin1'].setValue(undefined);
      this.formGroup.controls['admin2'].setValue(undefined);
      this.formGroup.controls['admin1'].disable({ onlySelf: true });
      this.formGroup.controls['admin2'].disable({ onlySelf: true });
    } else if (level === 1) {
      this.adminParams.admin1 = modelMetadata.name;
      this.formGroup.controls['admin0'].setValue(modelMetadata.name);
      this.formGroup.controls['admin1'].enable();
      this.formGroup.controls['admin1'].setValue('All');
      this.formGroup.controls['admin2'].setValue(undefined);
      this.formGroup.controls['admin2'].disable({ onlySelf: true });
      this.ADMIN_1 = [];
      this.ADMIN_2 = [];
    } else if (level === 2) {
      this.adminParams.admin2 = modelMetadata.name;
      this.formGroup.controls['admin1'].setValue(modelMetadata.name);
      this.formGroup.controls['admin2'].enable();
      this.formGroup.controls['admin2'].setValue('All');
      this.ADMIN_2 = [];
    }
  }

  setAdmin(level: number, modelMetadata: ModelMetadata) {
    if (level === 0) {
      this.adminParams.admin0 = null;
      this.adminParams.admin2 = undefined;
      this.adminParams.admin1 = undefined;
      this.adminParams.geo = modelMetadata.name;
      this.adminParams.parentGeo = DROPDOWN_ITEMS_GEO[0];
      this.ADMIN_1 = [];
      this.ADMIN_2 = [];
      this.formGroup.controls['admin1'].setValue(undefined);
      this.formGroup.controls['admin2'].setValue(undefined);
      this.formGroup.controls['admin1'].disable({ onlySelf: true });
      this.formGroup.controls['admin2'].disable({ onlySelf: true });
    } else if (level === 1) {
      this.adminParams.admin1 = modelMetadata.name;
      this.adminParams.geo = modelMetadata.name;
      this.adminParams.adminLevel = level;
      this.adminParams.admin2 = undefined;
      this.adminParams.parentGeo = modelMetadata.country;
      this.formGroup.controls['admin1'].enable();
      this.formGroup.controls['admin2'].setValue(undefined);
      this.formGroup.controls['admin2'].disable({ onlySelf: true });
      this.ADMIN_2 = [];
    } else if (level === 2) {
      this.adminParams.admin2 = modelMetadata.name;
      this.formGroup.controls['admin2'].enable();
    }
  }

  closeDetail(close) {
    this.isVisible = false;
  }

  handleMapDetails(event: any) {
    if (event.hasOwnProperty('locatedIn')) {
      if (!isNotNullOrUndefined(event['id'])) {
        this.subscribeCreateLocation = this.apiService
          .postLocation(event)
          .subscribe(
            (outcome) => {
              this.generalLocations.push(outcome['entity']);
              this.snackBar.open(
                'Location Creation Successful: ' + event['names'],
                'close',
                {
                  duration: SNACK_BAR_DURATION,
                }
              );
            },
            (error) => {
              console.log(error);
              this.snackBar.open(
                'Could not create location!: ' + event['names'],
                'close',
                {
                  duration: SNACK_BAR_DURATION,
                }
              );
            }
          );
      } else {
        this.subscribeUpdateLocation = this.apiService
          .updateLocation(event['id'], event)
          .subscribe(
            (outcome) => {
              const temp: Location[] = filterOut(
                event['id'],
                this.generalLocations
              );
              temp.push(outcome['entity']);
              this.generalLocations = temp;
              this.snackBar.open(
                'Location Update Successful: ' + event['id'],
                'close',
                {
                  duration: SNACK_BAR_DURATION,
                }
              );
            },
            (error) => {
              console.log(error);
              this.snackBar.open(
                'Could not update location!: ' + event['id'],
                'close',
                {
                  duration: SNACK_BAR_DURATION,
                }
              );
            }
          );
      }
    } else if (event.hasOwnProperty('data_verification')) {
      let response: Location[];
      if (!isNotNullOrUndefined(event.location_id)) {
        response = this._filter(event.location_name, this.generalLocations);

        if (
          !isNotNullOrUndefined(response[0]) ||
          !isNotNullOrUndefined(response[0].id)
        ) {
          this.snackBar.open(
            'Location data verification failed due to missing location Id',
            'close',
            {
              duration: SNACK_BAR_DURATION,
            }
          );
          return;
        }
        event.location_id = response[0].id;
      }
      this.subscribeCreateDataRepositoryConfiguration = this.apiService
        .verifyAndUploadLocationData(
          event.location_id,
          event.model_id,
          event.iso2code
        )
        .subscribe(
          (outcome) => {
            this.locations.push(outcome['entity']['location']);
            console.log(outcome['entity']);

            const tempModel = filterOut(
              event.model_id,
              this.itemsDataSource.data
            );
            const thisModel = outcome['entity']['executorList'].filter((option) => {
              return option['id'] === event.model_id;
            })[0];
            console.log(thisModel)
            tempModel.push(thisModel);
            this.itemsDataSource.data = tempModel;
            this.currentModel = thisModel;
            this.reloadData();
            this.snackBar.open(
              'Location Data Verification Successful: ' +
                event['iso2code'],
              'close',
              {
                duration: SNACK_BAR_DURATION,
              }
            );
          },
          (error) => {
            console.log(error);
            this.snackBar.open(
              'Could not verify location data!: ' + event['iso2code'],
              'close',
              {
                duration: SNACK_BAR_DURATION,
              }
            );
          }
        );
    }
  }
}
