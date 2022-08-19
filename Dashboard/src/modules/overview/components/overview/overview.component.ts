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
  ElementRef,
  HostListener,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import * as L from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { LabelType, Options } from 'ng5-slider';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ApiService,
  ChartCallBack,
  ChartParameters,
  ChartService,
  ConfirmDialogService,
  DataService,
  DROPDOWN_ITEMS_GLOBAL_US,
  DROPDOWN_ITEMS_INDEX,
  DROPDOWN_ITEMS_MOBILITY_TYPE,
  DROPDOWN_ITEMS_NPI_DATASET,
  getDaysBetweenTimestampInDays,
  INDEX_DATA_KEYS,
  MAP_COLORS,
  MAP_POPUP_OPTIONS,
  NO_DATA,
} from '../../../common';
import { OVERVIEW_CONSTANTS } from '../../constants/overview.constants';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @ViewChild('tooltip', { static: true }) manualTooltip: MatTooltip;
  @ViewChild('admin0') admin0Field: ElementRef;
  @ViewChild('admin1') admin1Field: ElementRef;
  months: string[] = [
    'Jan-2020',
    'Feb-2020',
    'Mar-2020',
    'Apr-2020',
    'May-2020',
    'Jun-2020',
    'Jul-2020',
    'Aug-2020',
    'Sep-2020',
    'Oct-2020',
    'Nov-2020',
    'Dec-2020',
    'Jan-2021',
    'Feb-2021',
    'Mar-2021',
    'Apr-2021',
    'May-2021',
  ];
  selectedMonths: string[] = this.months.slice(
    this.months.length - 4,
    this.months.length
  );
  geoJson: any = [];
  bounds: any;
  date: any;

  // play-pause button
  playPauseButton = 'play_circle_outline';
  value;
  options: Options;
  counter;
  play = true;
  interval: any;
  ceilEpoch;
  floorEpoch;

  DROPDOWN_ITEMS_INDEX = DROPDOWN_ITEMS_INDEX;
  CURRENT_DROPDOWN_ITEMS_INDEX = DROPDOWN_ITEMS_INDEX[2];
  CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE = DROPDOWN_ITEMS_MOBILITY_TYPE[0];
  DROPDOWN_ITEMS_MOBILITY_TYPE = DROPDOWN_ITEMS_MOBILITY_TYPE;
  CURRENT_DROPDOWN_ITEMS_NPI_DATASET = DROPDOWN_ITEMS_NPI_DATASET[1];
  DROPDOWN_ITEMS_NPI_DATASET = DROPDOWN_ITEMS_NPI_DATASET;

  chartParameters: ChartParameters = this.chartService.getDefaultChartParams();
  indexData: any;
  rawGEOJSONObject: any;
  parentGeo = DROPDOWN_ITEMS_GLOBAL_US[0];
  geo = { name: 'US', fullname: 'United States' };

  legendData = {
    range: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8],
    colors: MAP_COLORS.someKindOfBlue,
  };

  domain = 'covid19';
  domainTemp = 'covid19';

  monthOptions;
  endMonth;
  startMonth;
  innerHeight: number;

  formGroup: FormGroup;
  ADMIN_0 = [];
  ADMIN_1 = [];
  filteredAdmin0Options: Observable<any[]>;
  filteredAdmin1Options: Observable<any[]>;

  private subscribeIndexGeojson: any;
  private subscribeStatsMetadata: any;

  constructor(
    private chartService: ChartService,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private ngZone: NgZone,
    private confirmDialogService: ConfirmDialogService,
    private modalService: MatDialog,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setupForm();
    this.innerHeight = 0.63 * window.innerHeight;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.subscribeStatsMetadata = this.apiService
        .getCovid19StatsMetadata()
        .subscribe(
          (metadata) => {
            if (isNotNullOrUndefined(metadata)) {
              this.months = metadata['months'];
              this.selectedMonths = this.months.slice(
                this.months.length - 4,
                this.months.length
              );
              if (this.months.length > 0 && this.selectedMonths.length > 0) {
                this.startMonth = this.months.indexOf(this.selectedMonths[0]);
                this.endMonth = this.months.indexOf(
                  this.selectedMonths[this.selectedMonths.length - 1]
                );
                this.monthOptions = {
                  floor: 0,
                  ceil: this.months.length - 1,
                  translate: (value: number, label: LabelType): string => {
                    return this.months[value];
                  },
                };
              }
              this.loadData(this.parentGeo);
              this.manualTooltip.show();
            }
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // this.loadData(this.parentGeo);
    // this.manualTooltip.show();
  }

  ngOnDestroy(): void {
    if (this.subscribeStatsMetadata) {
      this.subscribeStatsMetadata.unsubscribe();
    }
    if (this.subscribeIndexGeojson) {
      this.subscribeIndexGeojson.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = 0.63 * window.innerHeight;
    this.chartParameters = this.chartService.generateChartParameters(
      this.CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE,
      this.value,
      this.indexData,
      this.geo,
      this.innerHeight
    );
  }

  myChartCallbackFunction = (chartCallBack: ChartCallBack): any => {
    if (
      chartCallBack.type === 'plotly_legenddoubleclick' ||
      chartCallBack.type === 'plotly_legendclick'
    ) {
      return true;
    }
    if (chartCallBack.pointsData.meta.id === 'legend_click') {
      return this.chartService.processLegendClickClick(chartCallBack);
    } else {
      return chartCallBack.inputChartParameters;
    }
  };

  private setDateSlider(ceil: number, floor: number) {
    // this.date = ceil;
    const dateRange = this.createDateRange(ceil, floor);

    // this.value = dateRange[dateRange.length - 1].getTime();
    this.value = ceil;
    this.options = {
      stepsArray: dateRange.map((date: Date) => {
        return { value: date.getTime() };
      }),
      translate: (value: number, label: LabelType): string => {
        if (label === LabelType.Low) {
          return this.datePipe.transform(new Date(value), 'yyyy-MM-dd');
        } else {
          return '';
        }
      },
    };
    this.counter = getDaysBetweenTimestampInDays(
      this.ceilEpoch,
      this.floorEpoch
    );
  }

  private createDateRange(ceil: number, floor: number): Date[] {
    const dates: Date[] = [];
    let numberOfDays;
    numberOfDays = getDaysBetweenTimestampInDays(ceil, floor);
    for (let i = 0; i <= numberOfDays; i++) {
      const thisDate = new Date(floor);
      thisDate.setDate(thisDate.getDate() + i);
      dates.push(thisDate);
    }
    return dates;
  }

  /**
   * implements a count down that delays for 1000ms
   */
  startCountDown(seconds) {
    this.counter = seconds;
    this.interval = setInterval(() => {
      this.counter--;
      this.value = this.value + 1000 * 60 * 60 * 24;

      if (this.counter < 0 || this.value > this.ceilEpoch) {
        this.playPause(true);
        console.log('Ding!');
      }
    }, 500);
  }

  /**
   * start and stop the play button so as to navigate through the timeline
   */
  playPause(clear?) {
    if (clear) {
      this.value = this.ceilEpoch;
      clearInterval(this.interval);
      this.counter = 0;
      this.play = true;
      this.playPauseButton = 'play_circle_outline';
    } else if (this.play) {
      // start counter
      this.counter = this.ceilEpoch - this.value;
      if (this.counter < 85000000) {
        this.value = this.floorEpoch;
        this.counter = this.ceilEpoch - this.value;
      }
      // play till end
      this.startCountDown(this.counter);
      // set play to false
      this.play = false;
      // set icon to pause
      this.playPauseButton = 'pause_circle_outline';
    } else if (!this.play) {
      // pause counter
      clearInterval(this.interval);
      // set play to true
      this.play = true;
      // set icon to play
      this.playPauseButton = 'play_circle_outline';
    }
  }

  resetAdmin(level: number, locationMetadata?: any) {
    if (level === -1) {
      this.ADMIN_1 = [];
      this.formGroup.controls['admin1'].setValue(undefined);
      this.formGroup.controls['admin1'].disable({ onlySelf: true });
      this.formGroup.controls['admin0'].setValue('United States');
      if (this.parentGeo === DROPDOWN_ITEMS_GLOBAL_US[0]) {
        this.geo = { name: 'US', fullname: 'United States' };
        this.reLoadData(this.geo);
      } else {
        this.parentGeo = DROPDOWN_ITEMS_GLOBAL_US[0];
        this.geo = { name: 'US', fullname: 'United States' };
        this.loadData(this.parentGeo);
      }
    } else if (level === 0) {
      this.formGroup.controls['admin0'].setValue(locationMetadata.fullname);
      this.formGroup.controls['admin1'].setValue(undefined);
      this.formGroup.controls['admin1'].disable({ onlySelf: true });
    } else if (level === 1) {
      this.formGroup.controls['admin1'].setValue(locationMetadata.fullname);
      this.formGroup.controls['admin1'].enable();
    }
  }

  indexDropdownChangeListener($event: MatSelectChange) {
    this.reLoadData(this.geo);
  }

  npiDatasetDropdownChangeListener($event: MatSelectChange) {
    this.reLoadData(this.geo);
  }

  mobilityTypeDropdownChangeListener($event: MatSelectChange) {
    this.reLoadData(this.geo);
  }

  valueChange($event: number) {
    this.reLoadData(this.geo);
  }

  /**
   * set fill color
   */
  private setLayerStyle(fillColor, weight, color, opacity, dashArray) {
    if (!isNotNullOrUndefined(fillColor)) {
      return {
        weight,
        opacity,
        color,
        dashArray,
        fillOpacity: 0.4,
      };
    }
    return {
      fillColor,
      weight,
      opacity,
      color,
      dashArray,
      fillOpacity: 0.4,
    };
  }

  private loadData(parentGeo) {
    const adminsIndexMonthly = this.apiService.getMonthlyIndicesData(
      parentGeo,
      this.selectedMonths
    );
    const adminsGeoJson =
      parentGeo === DROPDOWN_ITEMS_GLOBAL_US[0]
        ? this.apiService.loadWorldGeoJson()
        : this.apiService.loadSelectedCountryAdmin1GeoJson({
            admin0: parentGeo,
            adminLevel: 1,
          });
    this.subscribeIndexGeojson = forkJoin([
      adminsIndexMonthly,
      adminsGeoJson,
    ]).subscribe(
      (data) => {
        if (!isNotNullOrUndefined(data)) {
          return;
        }
        this.indexData = data[0];
        this.getCeilFloorEpochs(this.indexData);
        this.rawGEOJSONObject = data[1];
        this.reLoadData(this.geo);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private reLoadData(currentMetadata?) {
    this.chartParameters = this.chartService.generateChartParameters(
      this.CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE,
      this.value,
      this.indexData,
      this.geo,
      this.innerHeight
    );
    this.geoJson = [];
    this.bounds = undefined;
    const tempBounds = [];
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
        const locationMetadata: any = {};
        const singleJson = L.geoJSON(thisFeature, {
          style: (feature) => {
            return this.setLayerStyle('#d9d9d9', 1.5, '#ccc', 0.6, '2');
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                this.ngZone.run(() =>
                  this.highlightFeature(e, locationMetadata, currentMetadata)
                );
              },
              mouseout: (e) => {
                this.ngZone.run(() =>
                  this.resetHighlight(e, locationMetadata, currentMetadata)
                );
              },
              click: (e) => {
                this.ngZone.run(() =>
                  this.processLocationChange(locationMetadata)
                );
              },
            });
          },
        });
        locationMetadata['name'] = !isNotNullOrUndefined(
          thisFeature['properties']['ISO_A2']
        )
          ? thisFeature['properties']['NAME']
          : thisFeature['properties']['ISO_A2'];

        const thisLocationData = this.indexData[locationMetadata['name']];
        locationMetadata['index'] = this.CURRENT_DROPDOWN_ITEMS_INDEX;
        locationMetadata['dataset'] = this.CURRENT_DROPDOWN_ITEMS_NPI_DATASET;
        locationMetadata['mobility'] =
          this.CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE;
        locationMetadata['value'] = NO_DATA;
        locationMetadata['fullname'] = thisFeature['properties']['NAME'];

        if (isNotNullOrUndefined(thisLocationData)) {
          const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          const nearTimestamp = Object.keys(thisLocationData).find(
            (timestamp) => {
              return Math.abs(+timestamp - +this.value) < oneDay;
            }
          );
          const thisEpoch = thisLocationData['' + nearTimestamp];
          if (isNotNullOrUndefined(thisEpoch)) {
            let indexDataKey =
              this.CURRENT_DROPDOWN_ITEMS_INDEX +
              '_' +
              this.CURRENT_DROPDOWN_ITEMS_NPI_DATASET +
              '_' +
              this.CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE;
            indexDataKey = indexDataKey.toLowerCase();
            console.log(thisEpoch)
            console.log(INDEX_DATA_KEYS)
            console.log(indexDataKey)
            
            const currentValue = thisEpoch[INDEX_DATA_KEYS[indexDataKey]];
            console.log(currentValue)
            locationMetadata['value'] =
              currentValue === -1 ? NO_DATA : currentValue;

            // fill color
            let fillColor = '#d9d9d9';
            const shadingArray = MAP_COLORS.someKindOfBlue;

            if (currentValue >= 0.8) {
              fillColor = shadingArray[6];
            } else if (currentValue >= 0.6) {
              fillColor = shadingArray[5];
            } else if (currentValue >= 0.4) {
              fillColor = shadingArray[4];
            } else if (currentValue >= 0.3) {
              fillColor = shadingArray[3];
            } else if (currentValue >= 0.2) {
              fillColor = shadingArray[2];
            } else if (currentValue >= 0.1) {
              fillColor = shadingArray[1];
            } else if (currentValue >= 0) {
              fillColor = shadingArray[0];
            } else {
              fillColor = '#d9d9d9';
            }
            singleJson.setStyle(
              this.setLayerStyle(fillColor, 2.5, '#ccc', 0, '2')
            );
          }
        }

        if (this.parentGeo === DROPDOWN_ITEMS_GLOBAL_US[0]) {
          const temp = this.filter(locationMetadata['fullname'], this.ADMIN_0);
          if (!isNotNullOrUndefined(temp) || !isNotNullOrUndefined(temp[0])) {
            this.ADMIN_0.push(locationMetadata);
          }

          if (
            isNotNullOrUndefined(currentMetadata) &&
            currentMetadata['name'] === locationMetadata['name']
          ) {
            Object.keys(singleJson['_layers']).forEach(
              (element, elementIndex) => {
                tempBounds.push(singleJson['_layers'][element].getBounds());
              }
            );
            singleJson.setStyle(
              this.setLayerStyle(undefined, 2.5, '#606060', 1, '')
            );
          } else if (!isNotNullOrUndefined(currentMetadata)) {
            Object.keys(singleJson['_layers']).forEach((element) => {
              tempBounds.push(singleJson['_layers'][element].getBounds());
            });
          }
        } else {
          const temp = this.filter(locationMetadata['fullname'], this.ADMIN_1);
          if (!isNotNullOrUndefined(temp) || !isNotNullOrUndefined(temp[0])) {
            this.ADMIN_1.push(locationMetadata);
          }

          if (
            isNotNullOrUndefined(currentMetadata) &&
            currentMetadata['name'] === locationMetadata['name']
          ) {
            singleJson.setStyle(
              this.setLayerStyle(undefined, 2.5, '#606060', 1, '')
            );
          }
          Object.keys(singleJson['_layers']).forEach((element) => {
            tempBounds.push(singleJson['_layers'][element].getBounds());
          });
        }

        tempGeoJson.push(singleJson);
      }
    });
    this.geoJson = tempGeoJson;
    this.bounds = tempBounds;
  }

  private processLocationChange(locationMetadata: any, mismatchGeo?: any) {
    this.geo = locationMetadata;
    if (
      environment.AVAILABLE_ADMIN1_ISO2_GEOJSON.includes(
        locationMetadata['name']
      )
    ) {
      this.confirmDialogService
        .openDialog(
          'confirmation',
          OVERVIEW_CONSTANTS.ADMIN_LEVEL +
            OVERVIEW_CONSTANTS.DATA_EXISTS_FOR +
            locationMetadata['fullname'] +
            '.' +
            '\n' +
            OVERVIEW_CONSTANTS.WOULD_YOU_LIKE_TO_LOAD_THIS_DATA
        )
        .subscribe(
          (response) => {
            if (response) {
              this.parentGeo = locationMetadata['name'];
              this.geo = { name: 'New York', fullname: 'New York' };
              this.resetAdmin(1, this.geo);
              this.loadData(this.parentGeo);
            } else {
              this.resetAdmin(0, locationMetadata);
              this.reLoadData(locationMetadata);
            }
          },
          (error) => {
            this.reLoadData(locationMetadata);
          }
        );
    } else if (this.parentGeo === DROPDOWN_ITEMS_GLOBAL_US[0]) {
      this.resetAdmin(0, locationMetadata);
      this.reLoadData(locationMetadata);
    } else if (
      isNotNullOrUndefined(mismatchGeo) &&
      mismatchGeo !== DROPDOWN_ITEMS_GLOBAL_US[0]
    ) {
      this.geo = locationMetadata;
      this.parentGeo = DROPDOWN_ITEMS_GLOBAL_US[0];
      this.resetAdmin(0, locationMetadata);
      this.loadData(this.parentGeo);
    } else {
      this.resetAdmin(1, locationMetadata);
      this.reLoadData(locationMetadata);
    }
  }

  private resetHighlight(
    e: LeafletMouseEvent,
    locationMetadata: any,
    currentMetadata
  ) {
    setTimeout(() => {
      e.target.closePopup();
    }, 50);
    if (
      isNotNullOrUndefined(currentMetadata) &&
      currentMetadata['name'] === locationMetadata['name']
    ) {
      return;
    }
    e.target.setStyle({
      weight: 2.5,
      opacity: 0,
      dashArray: '2',
      fillOpacity: 0.4,
    });
  }

  private highlightFeature(
    e: LeafletMouseEvent,
    locationMetadata: any,
    currentMetadata
  ) {
    // create popup contents
    let customPopup = '';
    customPopup = this.makePopup(locationMetadata);

    // specify popup options
    MAP_POPUP_OPTIONS['offset'] = L.point(0, -5);

    e.target.bindPopup(customPopup, MAP_POPUP_OPTIONS).openPopup(e.latlng);
    if (
      isNotNullOrUndefined(currentMetadata) &&
      currentMetadata['name'] === locationMetadata['name']
    ) {
      return;
    }
    e.target.setStyle({
      weight: 2.5,
      dashArray: '',
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
      e.target.bringToFront();
    }
  }

  private makePopup(locationMetadata: any) {
    return (
      `` +
      `<div class="popup-region-name">${locationMetadata['fullname']}</div>` +
      `<div>` + $localize`:dataset|dataset@@dataset:Dataset` + `: ${locationMetadata['dataset']}</div>` +
      `<div>` + $localize`:mobility|mobility@@mobility:Mobility` + `: ${locationMetadata['mobility']}</div>` +
      `<div>` + $localize`:index|index@@index:Index` + `: ${locationMetadata['index']}</div>` +
      `<div>` + $localize`:value|value@@value:Value` + `: ${locationMetadata['value']}</div>`
    );
  }

  private getCeilFloorEpochs(indexData: any) {
    if (!isNotNullOrUndefined(indexData)) {
      return;
    }
    let ceil = 0;
    let floor = +new Date();
    Object.keys(indexData).forEach((admin) => {
      if (indexData.hasOwnProperty(admin)) {
        const timestamps = Object.keys(indexData[admin]);
        const localmin = timestamps.reduce(
          (min, tp) => (+tp < min ? +tp : min),
          +timestamps[0]
        );
        const localmax = timestamps.reduce(
          (max, tp) => (+tp > max ? +tp : max),
          +timestamps[0]
        );
        if (localmax > ceil) {
          ceil = localmax;
        }
        if (localmin < floor) {
          floor = localmin;
        }
      }
    });
    this.ceilEpoch = ceil;
    this.floorEpoch = floor;
    this.setDateSlider(this.ceilEpoch, this.floorEpoch);
  }

  open(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        width: '50%',
        position: { top: '30px' },
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result === 'Save click') {
            if (this.domain !== this.domainTemp) {
              this.domainTemp = '' + this.domain;
              this.dataService.changeDomain(this.domain);
            }

            const tempSelectedMonths = this.months.slice(
              this.startMonth,
              this.endMonth + 1
            );
            if (
              JSON.stringify(tempSelectedMonths) !==
              JSON.stringify(this.selectedMonths)
            ) {
              this.selectedMonths = tempSelectedMonths;
              this.loadData(this.parentGeo);
            }
          }
        },
        (error1) => {
          console.error(error1);
        }
      );
  }

  admin0SelectionChange(value: any) {
    if (typeof value === 'string') {
      const temp = this.filter(value, this.ADMIN_0);
      if (isNotNullOrUndefined(temp)) {
        value = temp[0];
      }
    }
    this.processLocationChange(value, this.parentGeo);
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

  private filter(value: string, options: any[]): any[] {
    if (!isNotNullOrUndefined(value) || !isNotNullOrUndefined(options)) {
      return [];
    }
    const filterValue = value.toLowerCase();
    if (value === 'all') {
      return options;
    }
    return options.filter((option) =>
      option.fullname.toLowerCase().includes(filterValue)
    );
  }

  /**
   * set up formgroup
   */
  private setupForm() {
    this.formGroup = this.formBuilder.group({
      admin0: new FormControl(''),
      admin1: new FormControl(''),
    });
    this.onAdmin0Change();
    this.onAdmin1Change();
    this.initializeTheForm();
  }

  /**
   * initialize the form
   */
  private initializeTheForm() {
    this.formGroup.controls['admin0'].setValue('United States');
    this.formGroup.controls['admin1'].disable({ onlySelf: true });
  }
}
