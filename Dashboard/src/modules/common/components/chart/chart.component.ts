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

import {Component, HostListener, Input, OnInit} from '@angular/core';
import {PlotlyService} from 'angular-plotly.js';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import {ChartParameters, ChartCallBack} from '../../models';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() chartParameters: ChartParameters;
  @Input() chartCallbackFunction: (args: any) => ChartParameters;
  private plotlyEventClick = false;

  constructor(public plotlyService: PlotlyService) {}

  ngOnInit() {}

  @HostListener('click') onClick() {
    if (!this.plotlyEventClick) {
    }
    this.plotlyEventClick = false;
  }

  onInitialized($event) {
    const div = this.plotlyService.getInstanceByDivId('main-plot-div');
    div.on('plotly_legenddoubleclick', (data) => {
      const chartCallBack: ChartCallBack = {
        type: 'plotly_click'
      };
      return this.chartCallbackFunction(chartCallBack);
    });

    div.on('plotly_legendclick', (data) => {
      const chartCallBack: ChartCallBack = {
        type: 'plotly_legendclick'
      };
      return this.chartCallbackFunction(chartCallBack);
    });

    div.on('plotly_clickannotation', (event, data) => {
      if (isNotNullOrUndefined(event) && isNotNullOrUndefined(event.index) && isNotNullOrUndefined(event.annotation)
        && isNotNullOrUndefined(event.annotation['meta'])) {
        const chartCallBack: ChartCallBack = {
          type: 'plotly_clickannotation',
          pointsData: {
            meta: event.annotation['meta'],
          }
        };
        if (event.annotation['meta']['id'] === 'legend_click') {
          chartCallBack.inputChartParameters = this.chartParameters;
          this.chartParameters = this.chartCallbackFunction(chartCallBack);
          return;
        }
        this.chartCallbackFunction(chartCallBack);
      }
    });

    div.on('plotly_click', (data) => {
      if (!isNotNullOrUndefined(data)
        || !isNotNullOrUndefined(data['points'])
        || !isNotNullOrUndefined(data['points'][0])
        || !isNotNullOrUndefined(data['points'][0]['curveNumber'])
        || !isNotNullOrUndefined(data['points'][0]['data'])
        || data['points'][0]['data'].length < 1) {
        return;
      }
      const pointsData = data['points'][0];
      const thisData = pointsData['data'];
      const meta = Object.assign({}, thisData['meta']);
      const chartCallBack: ChartCallBack = {
        type: 'plotly_click',
        inputChartParameters: this.chartParameters,
        pointsData: {
          meta,
          clickedLabel: thisData.name
        }
      };
      this.chartParameters = this.chartCallbackFunction(chartCallBack);
    });
  }
}
