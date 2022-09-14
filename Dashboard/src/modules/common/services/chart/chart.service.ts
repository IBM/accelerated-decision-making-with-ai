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
import {
  ChartFont,
  ChartLayout,
  ChartLayoutAnnotations,
  ChartLayoutAxis,
  ChartLayoutHovelLabel,
  ChartLayoutLegend,
  ChartLayoutMargin,
  ChartConfig,
  ChartData,
  ChartParameters,
  ChartMeta,
  ChartCallBack,
  OverviewControlPanelParameters,
  OverviewParentParameters,
  Location,
  Intervention,
  NgSliderParameters,
  Executor,
  ResultsRequest,
  ResultsResponse
} from '../../models';
import {
  CHART_INTERVENTIONS_SYMBOLS,
  CONFIRMED_CASES,
  DATE,
  DAYS,
  DEFAULT_COLOR,
  DROPDOWN_ITEMS_INDEX,
  DROPDOWN_ITEMS_X_AXIS, HEADER, INDEX_DATA_KEYS,
  MAP_DATA,
  STROKE_DEFAULT_COLOR
} from '../../constants';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {DatePipe} from '@angular/common';
import {transform, transparentize} from '../../functions';
import {ApiService} from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private datePipe: DatePipe, private apiService: ApiService) { }

  generateOverviewChartParameters(mapOutcomeData: any, overviewControlPanelParameters: OverviewControlPanelParameters,
                                  overviewMapParameters: OverviewParentParameters) {
    let xScaleType = 'date';
    let hoverXLabel = DAYS;
    let xLabel = '';
    if (overviewControlPanelParameters.xAxis === DROPDOWN_ITEMS_X_AXIS[0]) {
      xScaleType = 'date';
      xLabel = '';
      hoverXLabel = DATE;
    } else {
      xScaleType = 'linear';
      xLabel = overviewControlPanelParameters.xAxis;
    }

    const chartConfig: ChartConfig = {
      responsive: true,
      modeBarButtonsToRemove: ['pan2d', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian',
        'toggleSpikelines'],
      displaylogo: false
    };

    const chartFont: ChartFont = {
      family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif'
    };

    const chartLayoutXAxis: ChartLayoutAxis = {
      type: xScaleType,
      ticks: '',
      title: { text: xLabel, standoff: 10 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2
    };

    const chartLayoutYAxis: ChartLayoutAxis = {
      type: overviewControlPanelParameters.yScale,
      ticks: '',
      title: { text: overviewControlPanelParameters.yAxis, standoff: 15 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2,
      fixedrange: true,
      hoverformat: '.2f',
      rangemode: 'tozero'
    };

    const chartLayoutHovelLabel: ChartLayoutHovelLabel = {
      font: chartFont,
      align: 'left'
    };

    const chartLayoutMargin: ChartLayoutMargin = {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    };

    const chartLayoutLegend: ChartLayoutLegend = {
      margin: chartLayoutMargin,
      tracegroupgap: 0,
      borderwidth: 1,
      bordercolor: DEFAULT_COLOR,
      xanchor: 'center',
      x: 0.75,
      y: 0.15,
      orientation: 'v',
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
        size: 10,
      }
    };

    const chartLayout: ChartLayout = {
      font: chartFont,
      xaxis: chartLayoutXAxis,
      yaxis: chartLayoutYAxis,
      hoverlabel: chartLayoutHovelLabel,
      margin: chartLayoutMargin,
      hovermode: 'closest',
      height: 530,
      autosize: true,
      showlegend: false,
      legend: chartLayoutLegend,
      plot_bgcolor: '#ffffff',
      annotations: [],
      shapes: []
    };

    const chartParameters: ChartParameters = {
      chartHeader: overviewControlPanelParameters.yAxis,
      data: [],
      layout: chartLayout,
      config: chartConfig
    };

    const topKAdmins = overviewControlPanelParameters.topKAdmins;
    const topKOutcomeData = this.getTopKOutcomeData(mapOutcomeData, overviewControlPanelParameters.yAxis,
      overviewMapParameters, topKAdmins);
    const colors = this.getK3rdColors(topKOutcomeData, topKAdmins);
    const adminType = 'Countries';

    Object.keys(topKOutcomeData).forEach((key, idx) => {
      let color = colors[idx];
      const adminOutcome = topKOutcomeData[key];
      const x = [];
      const y = [];
      let visible = true;
      let substitute =  false;
      Object.keys(adminOutcome.data).forEach(year => {
        if (adminOutcome.data.hasOwnProperty(year)) {
          const thisYear = adminOutcome.data[year];
          const yValue = thisYear[MAP_DATA[overviewControlPanelParameters.yAxis]];
          let xValue;

          if (xScaleType === 'date') {
            xValue = this.datePipe.transform(new Date(+year, 5), 'y');
            if (new Date(+year, 5).getTime() <= overviewControlPanelParameters.date) {
              x.push(xValue);
              y.push(yValue);
            }
          } else {
            xValue = +year;
            if (xValue <= overviewControlPanelParameters.date) {
              x.push(xValue);
              y.push(yValue);
            }
          }
        }
      });

      let width; let tempColor;
      if (isNotNullOrUndefined(overviewMapParameters) && isNotNullOrUndefined(overviewMapParameters.geo)
        && isNotNullOrUndefined(overviewMapParameters.parentGeo) && (overviewMapParameters.geo !== overviewMapParameters.parentGeo)) {
        if (overviewMapParameters.geo === key) {
          width = 3;
          tempColor = color;
        } else {
          width = 1;
          if (isNotNullOrUndefined(color)) { tempColor = transparentize('' + color, 0.8); }
        }
      } else {
        if (!isNotNullOrUndefined(color)) {
          tempColor = color;
          width = 1;
        } else {
          tempColor = color;
          width = 2;
        }
      }

      if (!isNotNullOrUndefined(color)) {
        const traceMeta: ChartMeta = {
          focus: false,
          width: 1,
          widthFocus: 3,
          widthNoFocus: 1,
          color: '#D3D3D3',
          colorFocus: '#FECB52',
          colorNoFocus: '#D3D3D3',
          type: 'line',
          admin: key,
          hoverXLabel,
          yLabel: overviewControlPanelParameters.yAxis,
          fullName: adminOutcome.name
        };
        const trace: ChartData = {
          mode: 'lines',
          name: adminOutcome.name,
          type: 'scatter',
          x,
          y,
          marker: { color: '#D3D3D3' },
          showlegend: false,
          line: {
            width
          },
          meta: traceMeta,
          hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x|%Y}' + '<br>' +
          '<b>%{meta.yLabel}:</b> %{y:.2f}'
        };
        chartParameters.data.push(trace);
        visible = false;
        color = '#FECB52';
        substitute = true;
      } else {
        const traceMeta: ChartMeta = {
          focus: false,
          width: 2,
          widthFocus: 3,
          widthNoFocus: 1,
          color,
          colorFocus: color,
          colorNoFocus: transparentize('' + color, 0.8),
          type: 'line',
          admin: key,
          hoverXLabel,
          yLabel: overviewControlPanelParameters.yAxis,
          fullName: adminOutcome.name
        };
        const trace = {
          mode: 'lines',
          name: adminOutcome.name,
          type: 'scatter',
          showlegend: false,
          x,
          y,
          marker: { color: tempColor },
          legendgroup: key,
          line: {
            width
          },
          meta: traceMeta,
          hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x|%Y}' + '<br>' +
          '<b>%{meta.yLabel}:</b> %{y:.2f}'
        };
        chartParameters.data.push(trace);
        let annotation: ChartLayoutAnnotations;
        if (overviewControlPanelParameters.yScale === 'log') {
          let logValue = y[y.length - 1];
          if (!isNaN(logValue)) {
            if (+logValue === 0) { logValue = 1; }
            annotation = this.getAnnotations(x[x.length - 1], Math.log10(logValue), adminOutcome.name);
          }
        } else {
          annotation = this.getAnnotations(x[x.length - 1], y[y.length - 1], adminOutcome.name);
        }
        if (isNotNullOrUndefined(annotation) && isNotNullOrUndefined(annotation['x'])) {
          chartParameters.layout.annotations.push(annotation);
        }
      }
    });

    // Add annotation for the topkadmins
    const topKTrace: ChartLayoutAnnotations = {
      xref: 'paper',
      yref: 'paper',
      x: 0,
      xanchor: 'left',
      y: 1.0,
      yanchor: 'center',
      text: '<b>' + topKAdmins + '</b>' + ' top K ' + adminType + ' | '
      + '<b>' + overviewControlPanelParameters.xAxis + '</b>' + ' x-axis' + ' | '
      + '<b>' + overviewControlPanelParameters.yScale + '</b>' + ' y-scale' + ' | '
      + '<b>' + overviewControlPanelParameters.per100kPop + '</b>' + ' normalization' + ' | '
      + '<b>' + overviewControlPanelParameters.dataSources + '</b>' + ' source(s)',
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
        size: 10
      },
      showarrow: false,
      captureevents: false
    };
    chartParameters.layout.annotations.push(topKTrace);

    return chartParameters;
  }

  private getTopKOutcomeData(mapOutcomeData: any, yAxis: string, overviewMapParameters: OverviewParentParameters, k) {
    if (!isNotNullOrUndefined(mapOutcomeData) || !isNotNullOrUndefined(yAxis)) {
      return {};
    }
    const kk3rd = this.getK3rd(k, mapOutcomeData);
    k = kk3rd.k;
    const k3rd = kk3rd.k3rd;

    let sortedKeys = Object.keys(mapOutcomeData).sort((a, b) => {
      const bData = mapOutcomeData[b]['data'];
      const aData = mapOutcomeData[a]['data'];
      return +bData[Object.keys(bData)[Object.keys(bData).length - 1]][MAP_DATA[yAxis]]
        - +aData[Object.keys(aData)[Object.keys(aData).length - 1]][MAP_DATA[yAxis]];
    });

    sortedKeys = sortedKeys.slice(0, k);

    if (isNotNullOrUndefined(overviewMapParameters) && isNotNullOrUndefined(overviewMapParameters.geo)
      && isNotNullOrUndefined(overviewMapParameters.parentGeo) && (overviewMapParameters.geo !== overviewMapParameters.parentGeo)) {
      if (isNotNullOrUndefined(mapOutcomeData[overviewMapParameters.geo])) {
        const clickedLocationIndex = sortedKeys.indexOf(overviewMapParameters.geo);
        if (clickedLocationIndex > -1) {
          if (clickedLocationIndex > k3rd - 1) {
            [sortedKeys[k3rd - 1], sortedKeys[clickedLocationIndex]] = [sortedKeys[clickedLocationIndex], sortedKeys[k3rd - 1]];
          }
        } else {
          sortedKeys.splice(k3rd - 1, 0, overviewMapParameters.geo);
          sortedKeys.pop();
        }
      } else {
        console.log('data missing for selected admin');
      }
    }

    const filteredData = {};
    sortedKeys.forEach((key, idx) => {
      filteredData[key] = mapOutcomeData[key];
    });
    return filteredData;
  }

  private getK3rd(k: number, mapOutcomeData: any) {
    let k3rd = Math.ceil(k / 3);
    if (Object.keys(mapOutcomeData).length < k) {
      k = Object.keys(mapOutcomeData).length;
    }
    if (k3rd < 5 && k >= 5) {
      k3rd = 5;
    }
    return {k, k3rd};
  }

  private getK3rdColors(mapOutcomeData: any, k: number) {
    const allColors = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];
    const k3rd = this.getK3rd(k, mapOutcomeData).k3rd;
    const colors = [];
    for (let i = 0; i < +k3rd; i++) {
      colors.push(allColors[i]);
    }
    return colors;
  }

  private getAnnotations(xValue: any, yValue: any, fullName: string) {
    const thisAnnotation: ChartLayoutAnnotations = {
      x: xValue,
      y: yValue,
      xref: 'x',
      yref: 'y',
      text: transform(fullName, [15, '...']),
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
        size: 10,
      },
      showarrow: false,
      xanchor: 'left',
      yanchor: 'center'
    };
    return thisAnnotation;
  }

  getDefaultChartParams(): ChartParameters {
    const chartParameters: ChartParameters = {
      chartHeader: '',
      data: [],
      layout: {},
      config: {},
    } as ChartParameters;
    return chartParameters;
  }


  public processLineSymbolClicks(chartCallBack: ChartCallBack) {
    for (const entryData of chartCallBack.inputChartParameters.data) {
      if (!isNotNullOrUndefined(entryData)
        || !isNotNullOrUndefined(entryData['meta'])) {
        continue;
      }
      const thisMeta = entryData['meta'];
      if (chartCallBack.pointsData.meta.focus) {
        if (chartCallBack.pointsData.meta.type === 'line') {
          if (thisMeta.type === 'line') {
            entryData['line']['width'] = thisMeta.width;
            entryData['marker']['color'] = thisMeta.color;
          } else if (thisMeta.type === 'marker') {
            entryData['marker']['color'] = [thisMeta.color];
            entryData['visible'] = !thisMeta.substitute;
          }
          entryData['meta']['focus'] = false;
        } else if (chartCallBack.pointsData.meta.type === 'marker') {
          if (thisMeta.type === 'marker') {
            if (thisMeta.admin === chartCallBack.pointsData.meta.admin) {
              entryData['marker']['color'] = [thisMeta.color];
              entryData['meta']['focus'] = false;
              entryData['visible'] = true;
            } else {
              entryData['marker']['color'] = [thisMeta.colorNoFocus];
              entryData['meta']['focus'] = false;
              entryData['visible'] = false;
            }
          } else if (thisMeta.type === 'line') {
            if (thisMeta.admin === chartCallBack.pointsData.meta.admin) {
              entryData['line']['width'] = thisMeta.widthFocus;
              entryData['marker']['color'] = thisMeta.colorFocus;
              entryData['meta']['focus'] = true;
            } else {
              entryData['line']['width'] = thisMeta.widthNoFocus;
              entryData['marker']['color'] = thisMeta.colorNoFocus;
              entryData['meta']['focus'] = false;
            }
          }
        }
      } else {
        if (chartCallBack.pointsData.meta.type === 'line') {
          if (thisMeta.admin === chartCallBack.pointsData.meta.admin) {
            if (thisMeta.type === 'line') {
              entryData['line']['width'] = thisMeta.widthFocus;
              entryData['marker']['color'] = thisMeta.colorFocus;
              entryData['meta']['focus'] = true;
            } else if (thisMeta.type === 'marker') {
              entryData['visible'] = true;
              entryData['marker']['color'] = [thisMeta.color];
            }
          } else {
            if (thisMeta.type === 'line') {
              entryData['line']['width'] = thisMeta.widthNoFocus;
              entryData['marker']['color'] = thisMeta.colorNoFocus;
              entryData['meta']['focus'] = false;
            } else if (thisMeta.type === 'marker') {
              entryData['visible'] = false;
              entryData['marker']['color'] = [thisMeta.color];
            }
          }
        } else if (chartCallBack.pointsData.meta.type === 'marker') {
          if (thisMeta.type === 'marker') {
            if (thisMeta.admin === chartCallBack.pointsData.meta.admin && thisMeta.npi_name === chartCallBack.pointsData.clickedLabel) {
              entryData['marker']['color'] = [thisMeta.colorFocus];
              entryData['meta']['focus'] = true;
              entryData['visible'] = true;
            } else if (thisMeta.admin === chartCallBack.pointsData.meta.admin
              && thisMeta.npi_name !== chartCallBack.pointsData.clickedLabel) {
              entryData['marker']['color'] = [thisMeta.colorNoFocus];
              entryData['meta']['focus'] = false;
              entryData['visible'] = true;
            } else {
              entryData['marker']['color'] = [thisMeta.colorNoFocus];
              entryData['meta']['focus'] = false;
              entryData['visible'] = false;
            }
          } else if (thisMeta.type === 'line') {
            if (thisMeta.admin === chartCallBack.pointsData.meta.admin) {
              entryData['line']['width'] = thisMeta.widthFocus;
              entryData['marker']['color'] = thisMeta.colorFocus;
              entryData['meta']['focus'] = true;
            } else {
              entryData['line']['width'] = thisMeta.widthNoFocus;
              entryData['marker']['color'] = thisMeta.colorNoFocus;
              entryData['meta']['focus'] = false;
            }
          }
        }
      }
    }
    for (const entryShape of chartCallBack.inputChartParameters.layout.shapes) {
      if (!isNotNullOrUndefined(entryShape.meta)) {
        continue;
      }
      if (!chartCallBack.pointsData.meta.focus) {
        entryShape.visible = chartCallBack.pointsData.meta.admin === entryShape.meta.admin;
      } else if (chartCallBack.pointsData.meta.type === 'line') {
        entryShape.visible = true;
      } else if (chartCallBack.pointsData.meta.type === 'marker') {
        entryShape.visible = chartCallBack.pointsData.meta.admin === entryShape.meta.admin;
      }
    }
    return chartCallBack.inputChartParameters;
  }

  generateResultsLessChartParameters(results: ResultsRequest, currentModels: Executor[], currentLocation: Location,
                                     currentDefaultExecutors: string[]): ChartParameters {
    const xScaleType = 'date';
    const yScaleType = 'linear';
    const hoverXLabel = DATE;
    const xLabel = '';
    const yLabel = (isNotNullOrUndefined(currentDefaultExecutors)
      && isNotNullOrUndefined(currentDefaultExecutors[0]))
      ? currentDefaultExecutors[0] : '';
    const alias = (isNotNullOrUndefined(currentDefaultExecutors)
      && isNotNullOrUndefined(currentDefaultExecutors[0]))
      ? currentDefaultExecutors[0] : '';
    const location = (isNotNullOrUndefined(currentLocation) && isNotNullOrUndefined(currentLocation.names)) ? currentLocation.names : '';
    const uniqueInterventions = [];

    const chartConfig: ChartConfig = {
      responsive: true,
      modeBarButtonsToRemove: ['pan2d', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian',
        'toggleSpikelines'],
      displaylogo: false
    };

    const chartFont: ChartFont = {
      family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif'
    };

    const chartLayoutXAxis: ChartLayoutAxis = {
      type: xScaleType,
      ticks: '',
      title: { text: xLabel, standoff: 10 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2
    };

    const chartLayoutYAxis: ChartLayoutAxis = {
      type: yScaleType,
      ticks: '',
      title: { text: yLabel, standoff: 15 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2,
      fixedrange: true,
      hoverformat: '.2f',
      rangemode: 'tozero'
    };

    const chartLayoutHovelLabel: ChartLayoutHovelLabel = {
      font: chartFont,
      align: 'left'
    };

    const chartLayoutMargin: ChartLayoutMargin = {
      l: 20,
      r: 20,
      b: 20,
      t: 20
    };

    const chartLayoutLegend: ChartLayoutLegend = {
      margin: chartLayoutMargin,
      tracegroupgap: 2,
      borderwidth: 1,
      bordercolor: DEFAULT_COLOR,
      orientation: 'v',
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
        size: 10,
      }
    };

    const chartLayout: ChartLayout = {
      font: chartFont,
      xaxis: chartLayoutXAxis,
      yaxis: chartLayoutYAxis,
      hoverlabel: chartLayoutHovelLabel,
      margin: chartLayoutMargin,
      hovermode: 'closest',
      height: 530,
      autosize: true,
      showlegend: true,
      legend: chartLayoutLegend,
      plot_bgcolor: '#ffffff',
      annotations: [],
      shapes: []
    };

    const chartParameters: ChartParameters = {
      chartHeader: yLabel + ' & Interventions over Time',
      data: [],
      layout: chartLayout,
      config: chartConfig
    };

    if (!isNotNullOrUndefined(results) || !isNotNullOrUndefined(results.results)
      || results.results.length < 1) {
      return chartParameters;
    }

    const colors = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];

    Object.keys(results.results).forEach((key, idx) => {
      const color = colors[idx];
      const policy: ResultsResponse = results.results[key];
      const x = [];
      const y = [];
      if (isNotNullOrUndefined(policy.rewards)) {
        Object.keys(policy.rewards).forEach(index => {
          const yValue = policy.rewards[index][alias];
          let xValue = policy.rewards[index]['day'];
          if (xScaleType === 'date') {
            xValue = this.datePipe.transform(new Date(xValue), 'yyyy-MM-dd');
          }
          x.push(xValue);
          y.push(yValue);
        });
      }
      const traceMeta: ChartMeta = {
        hoverXLabel,
        yLabel,
        fullName: alias,
        id: policy.id
      };
      const trace = {
        mode: 'lines',
        name: alias,
        type: 'scatter',
        showlegend: false,
        x,
        y,
        marker: { color },
        legendgroup: key,
        line: {
          width: 2
        },
        meta: traceMeta,
        hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
          '<b>%{meta.yLabel}:</b> %{y:.2f}'
      };
      chartParameters.data.push(trace);
      let annotation: ChartLayoutAnnotations;
      annotation = this.getAnnotations(x[x.length - 1], y[y.length - 1], alias);
      if (isNotNullOrUndefined(annotation) && isNotNullOrUndefined(annotation['x'])) {
        chartParameters.layout.annotations.push(annotation);
      }

      const annoMeta: ChartMeta = Object.assign({}, traceMeta);
      annoMeta.type = 'annotation';
      const annotationForDetails: ChartLayoutAnnotations = {
        x: x[Math.floor(x.length / 2)],
        y: y[Math.floor(y.length / 2)],
        xref: 'x',
        yref: 'y',
        text: 'Click to add <br> ' + alias + '<br> to Favorites <br>',
        font: {
          family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
          size: 10,
        },
        showarrow: true,
        xanchor: 'center',
        yanchor: 'bottom',
        arrowhead: 7,
        ax: 0,
        ay: -40,
        bordercolor: color,
        borderpad: 2,
        captureevents: true,
        meta: annoMeta,
        visible: false
      };
      chartParameters.layout['annotations'].push(annotationForDetails);
    });
    for (const action of uniqueInterventions) {
      const symbol = CHART_INTERVENTIONS_SYMBOLS[action.toLocaleLowerCase()];
      const legendTrace = {
        mode: 'markers',
        name: action,
        type: 'scatter',
        x: [null],
        y: [null],
        marker: {
          color: '' + DEFAULT_COLOR,
          size: 20,
          symbol,
          opacity: 1,
          line: {
            color: '' + STROKE_DEFAULT_COLOR,
            width: 1.5
          }
        },
        showlegend: true
      };
      chartParameters.data.push(legendTrace);
    }
    return chartParameters;
  }

  generateResultsMoreChartParameters(results: ResultsRequest, currentModels: Executor[], currentLocation: Location,
                                     currentDefaultExecutors: string[],
                                     ngSliderParametersList: NgSliderParameters[]): ChartParameters {
    const xScaleType = 'linear';
    const yScaleType = 'linear';

    const xLabel = (isNotNullOrUndefined(currentDefaultExecutors) && isNotNullOrUndefined(currentDefaultExecutors[0]))
      ? currentDefaultExecutors[0] : '';
    const yLabel = (isNotNullOrUndefined(currentDefaultExecutors) && isNotNullOrUndefined(currentDefaultExecutors[1]))
      ? currentDefaultExecutors[1] : '';
    const xAlias = (isNotNullOrUndefined(currentDefaultExecutors) && isNotNullOrUndefined(currentDefaultExecutors[0]))
      ? currentDefaultExecutors[0] : '';
    const yAlias = (isNotNullOrUndefined(currentDefaultExecutors) && isNotNullOrUndefined(currentDefaultExecutors[1]))
      ? currentDefaultExecutors[1] : '';

    const chartConfig: ChartConfig = {
      responsive: true,
      modeBarButtonsToRemove: ['pan2d', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian',
      'hoverCompareCartesian',
        'toggleSpikelines'],
      displaylogo: false
    };

    const chartFont: ChartFont = {
      family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif'
    };

    const chartLayoutXAxis: ChartLayoutAxis = {
      type: xScaleType,
      ticks: '',
      title: { text: xLabel, standoff: 10 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2
    };

    const chartLayoutYAxis: ChartLayoutAxis = {
      type: yScaleType,
      ticks: '',
      title: { text: yLabel, standoff: 15 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2,
      fixedrange: true,
      hoverformat: '.2f',
      rangemode: 'tozero'
    };

    const chartLayoutHovelLabel: ChartLayoutHovelLabel = {
      font: chartFont,
      align: 'left'
    };

    const chartLayoutMargin: ChartLayoutMargin = {
      l: 20,
      r: 20,
      b: 20,
      t: 20
    };

    const chartLayoutLegend: ChartLayoutLegend = {
      margin: chartLayoutMargin,
      tracegroupgap: 2,
      borderwidth: 1,
      bordercolor: DEFAULT_COLOR,
      orientation: 'v',
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
        size: 10,
      }
    };

    const chartLayout: ChartLayout = {
      font: chartFont,
      xaxis: chartLayoutXAxis,
      yaxis: chartLayoutYAxis,
      hoverlabel: chartLayoutHovelLabel,
      margin: chartLayoutMargin,
      hovermode: 'closest',
      height: 530,
      autosize: true,
      showlegend: true,
      legend: chartLayoutLegend,
      plot_bgcolor: '#ffffff',
      annotations: [],
      shapes: []
    };

    const chartParameters: ChartParameters = {
      chartHeader: 'Filter Intervention Packages using ' + yLabel + ' and ' + xLabel,
      data: [],
      layout: chartLayout,
      config: chartConfig
    };

    if (!isNotNullOrUndefined(results) || !isNotNullOrUndefined(results.results)
      || results.results.length < 1) {
      return chartParameters;
    }

    const uniqueModels = [];
    const colors = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];
    for (const policy of results.results) {
      if (uniqueModels.indexOf(policy.executorId) === -1) { uniqueModels.push(policy.executorId); }
      const color = colors[uniqueModels.indexOf(policy.executorId)];
      const x = [];
      const y = [];
      let visible = true;
      if (isNotNullOrUndefined(policy.rewards)) {
        const index = policy.rewards.length - 1;
        const yValue = policy.rewards[index][yAlias];
        const xValue = policy.rewards[index][xAlias];
        x.push(xValue);
        y.push(yValue);
        for (const ng of ngSliderParametersList) {
          const thisValue = policy.rewards[index][ng.rewardFunction];
          if (+thisValue > +ng.highValue || +thisValue < +ng.value) {
            visible = false;
          }
        }
      }

      const traceMeta: ChartMeta = {
        hoverXLabel: xLabel,
        yLabel,
        fullName: policy.resultName,
        id: policy.resultId
      };

      const trace = {
        mode: 'markers',
        name: policy.resultName,
        type: 'scatter',
        showlegend: false,
        x,
        y,
        visible,
        marker: {
          color: transparentize('' + color, 0.3),
          size: 15,
          opacity: 0.8,
          line: {
            color,
            width: 1.5
          }
        },
        legendgroup: policy.executorId,
        meta: traceMeta,
        hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{y:.2f}' + '<br>' +
          '<b>%{meta.yLabel}:</b> %{y:.2f}'
      };
      chartParameters.data.push(trace);

      const annoMeta: ChartMeta = Object.assign({}, traceMeta);
      annoMeta.type = 'annotation';
      const annotationForDetails: ChartLayoutAnnotations = {
        x: x[Math.floor(x.length / 2)],
        y: y[Math.floor(y.length / 2)],
        xref: 'x',
        yref: 'y',
        text: 'Click to load <br> timeseries plots <br> for ' + policy.resultName,
        font: {
          family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
          size: 10,
        },
        showarrow: true,
        xanchor: 'center',
        yanchor: 'bottom',
        arrowhead: 7,
        ax: 0,
        ay: -40,
        bordercolor: color,
        borderpad: 2,
        captureevents: true,
        meta: annoMeta,
        visible: false
      };
      chartParameters.layout['annotations'].push(annotationForDetails);
    }
    for (const model of uniqueModels) {
      const color = colors[uniqueModels.indexOf(model)];
      const legendTrace = {
        mode: 'markers',
        name: model,
        type: 'scatter',
        x: [null],
        y: [null],
        marker: {
          color: transparentize('' + color, 0.3),
          size: 20,
          opacity: 1,
          line: {
            color,
            width: 1.5
          }
        },
        showlegend: true,
        legendgroup: model
      };
      chartParameters.data.push(legendTrace);
    }
    return chartParameters;
  }

  private generateCustomData(action: Intervention) {
    if (!isNotNullOrUndefined(action)) {
      return '-';
    }
    if (action.action && action.coverage && action.description) {
      return 'Perform ' + action.action + ' on ' + +action.coverage * 100 + '' + action.description;
    } else if (action.action && action.coverage && !action.description) {
      return 'Perform ' + action.action + ' on ' + +action.coverage * 100 + '% of the population';
    } else if (action.action && !action.coverage && !action.description) {
      return 'Perform ' + action.action;
    } else if (!action.action && !action.coverage) {
      return '-';
    }
  }

  processSymbolClicks(chartCallBack: ChartCallBack) {
    if (!isNotNullOrUndefined(chartCallBack.pointsData)
      || !isNotNullOrUndefined(chartCallBack.pointsData.meta)
      || !isNotNullOrUndefined(chartCallBack.pointsData.meta.id)) {
      return chartCallBack.inputChartParameters;
    }

    for (const entryData of chartCallBack.inputChartParameters.data) {
      if (!isNotNullOrUndefined(entryData.meta)) {
        continue;
      }
      entryData.meta.focus = entryData.meta.id === chartCallBack.pointsData.meta.id;
    }

    for (const entryAnnotation of chartCallBack.inputChartParameters.layout.annotations) {
      if (!isNotNullOrUndefined(entryAnnotation.meta)) {
        continue;
      }
      entryAnnotation.visible = entryAnnotation.meta.id === chartCallBack.pointsData.meta.id;
    }
    return chartCallBack.inputChartParameters;
  }

  returnToDefault(chartCallBack: ChartCallBack) {
    for (const entryData of chartCallBack.inputChartParameters.data) {
      if (!isNotNullOrUndefined(entryData.meta)) {
        continue;
      }
      entryData.meta.focus = false;
    }

    for (const entryAnnotation of chartCallBack.inputChartParameters.layout.annotations) {
      entryAnnotation.visible = false;
    }
    return chartCallBack.inputChartParameters;
  }

  processLegendClickClick(chartCallBack: ChartCallBack) {
    if (chartCallBack.inputChartParameters.layout.showlegend) {
      chartCallBack.inputChartParameters.layout.showlegend = false;
      chartCallBack = this.resetTheLegendClickMsg(false, chartCallBack);
    } else {
      chartCallBack.inputChartParameters.layout.showlegend = true;
      chartCallBack = this.resetTheLegendClickMsg(true, chartCallBack);
    }
    return chartCallBack.inputChartParameters;
  }

  private resetTheLegendClickMsg(shown: boolean, chartCallBack: ChartCallBack): ChartCallBack {
    for (const annot of chartCallBack.inputChartParameters.layout.annotations) {
      if (!isNotNullOrUndefined(annot) || !isNotNullOrUndefined(annot['meta']) || annot['meta']['id'] !== 'legend_click') {
        continue;
      }
      if (shown) {
        annot.text = '<a href="">' + 'Hide legend' + '</a>';
      } else {
        annot.text = '<a href="">' + 'Show legend' + '</a>';
      }
      break;
    }
    return chartCallBack;
  }

  generateChartParameters(CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE: string, value, indexData: any, geo, innerHeight: number) {
    const xScaleType = 'date';
    const hoverXLabel = DATE;
    const xLabel = '';

    const chartConfig: ChartConfig = {
      responsive: true,
      modeBarButtonsToRemove: ['pan2d', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian',
        'toggleSpikelines'],
      displaylogo: false
    };

    const chartFont: ChartFont = {
      family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif'
    };

    const chartLayoutXAxis: ChartLayoutAxis = {
      type: xScaleType,
      ticks: '',
      title: { text: xLabel, standoff: 10 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2
    };

    const chartLayoutYAxis: ChartLayoutAxis = {
      type: 'linear',
      ticks: '',
      title: { text: $localize`:new cases|new cases@@newCases:New Cases`, standoff: 15 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2,
      fixedrange: true,
      hoverformat: '.2f',
      rangemode: 'tozero'
    };

    const chartLayoutYAxis2: ChartLayoutAxis = {
      type: 'linear',
      ticks: '',
      title: { text: $localize`:index value|index value@@indexValue:Index Value`, standoff: 15 },
      gridcolor: '#F2F2F2',
      linecolor: '#E5E5E5',
      automargin: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 2,
      fixedrange: true,
      hoverformat: '.2f',
      rangemode: 'tozero',
      overlaying: 'y',
      side: 'right'
    };

    const chartLayoutHovelLabel: ChartLayoutHovelLabel = {
      font: chartFont,
      align: 'left'
    };

    const chartLayoutMargin: ChartLayoutMargin = {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    };

    const chartLayoutLegend: ChartLayoutLegend = {
      margin: chartLayoutMargin,
      tracegroupgap: 0,
      borderwidth: 1,
      bordercolor: DEFAULT_COLOR,
      xanchor: 'center',
      yanchor: 'top',
      x: 0.85,
      y: 0.95,
      orientation: 'v',
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
        size: 10,
      }
    };

    const chartLayout: ChartLayout = {
      font: chartFont,
      xaxis: chartLayoutXAxis,
      yaxis: chartLayoutYAxis,
      yaxis2: chartLayoutYAxis2,
      hoverlabel: chartLayoutHovelLabel,
      margin: chartLayoutMargin,
      hovermode: 'closest',
      height: innerHeight,
      autosize: true,
      showlegend: true,
      legend: chartLayoutLegend,
      plot_bgcolor: '#ffffff',
      annotations: [],
      shapes: []
    };

    const chartParameters: ChartParameters = {
      chartHeader: !isNotNullOrUndefined(geo) ? $localize`:Select a region on the map|Select a region on the map@@selectARegionOnTheMap:Select a region on the map`
        : geo['fullname'] + ' ' + '(' + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE + ')',
      data: [],
      layout: chartLayout,
      config: chartConfig
    };

    // load data
    if (!isNotNullOrUndefined(geo) || !isNotNullOrUndefined(indexData)
    || !isNotNullOrUndefined(indexData[geo['name']])) { return chartParameters; }
    const thisAdminIndexData =  indexData[geo['name']];
    const x = [];
    const ycc = [];
    const ywsi = [];
    const ywcs = [];
    const ywni = [];
    const yosi = [];
    const yocs = [];
    const yoni = [];
    Object.keys(thisAdminIndexData).forEach(epoch => {
      if (thisAdminIndexData.hasOwnProperty(epoch) && (+epoch <= +value)) {
        const xValue = this.datePipe.transform(new Date(+epoch), 'yyyy-MM-dd');
        x.push(xValue);
        ycc.push((thisAdminIndexData[epoch][0] < 0) ? 0 : thisAdminIndexData[epoch][0]);
        ywsi.push((thisAdminIndexData[epoch]
          [INDEX_DATA_KEYS[HEADER.STRINGENCY_INDEX_WNTRAC + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]] < 0) ? 0 :
          thisAdminIndexData[epoch][INDEX_DATA_KEYS[HEADER.STRINGENCY_INDEX_WNTRAC + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]]);
        ywcs.push((thisAdminIndexData[epoch]
          [INDEX_DATA_KEYS[HEADER.COMPLIANCE_SCORE_WNTRAC + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]] < 0) ? 0 :
          thisAdminIndexData[epoch][INDEX_DATA_KEYS[HEADER.COMPLIANCE_SCORE_WNTRAC + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]]);
        ywni.push((thisAdminIndexData[epoch]
          [INDEX_DATA_KEYS[HEADER.NPI_INDEX_WNTRAC + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]] < 0) ? 0 :
          thisAdminIndexData[epoch][INDEX_DATA_KEYS[HEADER.NPI_INDEX_WNTRAC + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]]);
        yosi.push((thisAdminIndexData[epoch]
          [INDEX_DATA_KEYS[HEADER.STRINGENCY_INDEX_OXCGRT + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]] < 0) ? 0 :
          thisAdminIndexData[epoch][INDEX_DATA_KEYS[HEADER.STRINGENCY_INDEX_OXCGRT + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]]);
        yocs.push((thisAdminIndexData[epoch]
          [INDEX_DATA_KEYS[HEADER.COMPLIANCE_SCORE_OXCGRT + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]] < 0) ? 0 :
          thisAdminIndexData[epoch][INDEX_DATA_KEYS[HEADER.COMPLIANCE_SCORE_OXCGRT + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]]);
        yoni.push((thisAdminIndexData[epoch]
          [INDEX_DATA_KEYS[HEADER.NPI_INDEX_OXCGRT + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]] < 0) ? 0 :
          thisAdminIndexData[epoch][INDEX_DATA_KEYS[HEADER.NPI_INDEX_OXCGRT + CURRENT_DROPDOWN_ITEMS_MOBILITY_TYPE.toLowerCase()]]);
      }
    });

    const trace: ChartData = {
      mode: 'lines',
      name: $localize`:@@newCasesYAxis:New cases`,
      type: 'scatter',
      x,
      y: ycc,
      marker: { color: '#33adff' },
      showlegend: true,
      line: {
        width: 2
      },
      fill: 'tozeroy',
      fillcolor: transparentize('' + '#33adff', 0.9),
      meta: {fullName: geo['fullname'], hoverXLabel, yLabel: CONFIRMED_CASES},
      hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
        '<b>%{meta.yLabel}:</b> %{y:.2f}'
    };
    chartParameters.data.push(trace);

    const trace2: ChartData = {
      mode: 'lines',
      name: 'WNTRAC SI',
      type: 'scatter',
      x,
      y: ywsi,
      marker: { color: 'red' },
      showlegend: true,
      line: {
        width: 2
      },
      yaxis: 'y2',
      visible: 'legendonly',
      meta: {fullName: geo['fullname'], hoverXLabel, yLabel: 'WNTRAC SI'},
      hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
        '<b>%{meta.yLabel}:</b> %{y:.2f}'
    };
    chartParameters.data.push(trace2);

    const trace3: ChartData = {
      mode: 'lines',
      name: 'WNTRAC CS',
      type: 'scatter',
      x,
      y: ywcs,
      marker: { color: 'green' },
      showlegend: true,
      line: {
        width: 2
      },
      yaxis: 'y2',
      visible: 'legendonly',
      meta: {fullName: geo['fullname'], hoverXLabel, yLabel: 'WNTRAC CS'},
      hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
        '<b>%{meta.yLabel}:</b> %{y:.2f}'
    };
    chartParameters.data.push(trace3);

    const trace4: ChartData = {
      mode: 'lines',
      name: 'WNTRAC NI',
      type: 'scatter',
      x,
      y: ywni,
      marker: { color: 'blue' },
      showlegend: true,
      line: {
        width: 3
      },
      yaxis: 'y2',
      visible: 'legendonly',
      meta: {fullName: geo['fullname'], hoverXLabel, yLabel: 'WNTRAC NI'},
      hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
        '<b>%{meta.yLabel}:</b> %{y:.2f}'
    };
    chartParameters.data.push(trace4);

    const trace5: ChartData = {
      mode: 'lines',
      name: 'OxCGRT SI',
      type: 'scatter',
      x,
      y: yosi,
      marker: { color: 'red' },
      showlegend: true,
      line: {
        width: 2,
        dash: 'dash'
      },
      yaxis: 'y2',
      meta: {fullName: geo['fullname'], hoverXLabel, yLabel: 'OxCGRT SI'},
      hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
        '<b>%{meta.yLabel}:</b> %{y:.2f}'
    };
    chartParameters.data.push(trace5);

    const trace6: ChartData = {
      mode: 'lines',
      name: 'OxCGRT CS',
      type: 'scatter',
      x,
      y: yocs,
      marker: { color: 'green' },
      showlegend: true,
      line: {
        width: 2,
        dash: 'dash'
      },
      yaxis: 'y2',
      // visible: 'legendonly',
      meta: {fullName: geo['fullname'], hoverXLabel, yLabel: 'OxCGRT CS'},
      hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
        '<b>%{meta.yLabel}:</b> %{y:.2f}'
    };
    chartParameters.data.push(trace6);

    const trace7: ChartData = {
      mode: 'lines',
      name: 'OxCGRT NI',
      type: 'scatter',
      x,
      y: yoni,
      marker: { color: 'blue' },
      showlegend: true,
      line: {
        width: 2,
        dash: 'dash'
      },
      yaxis: 'y2',
      // visible: 'legendonly',
      meta: {fullName: geo['fullname'], hoverXLabel, yLabel: 'OxCGRT NI'},
      hovertemplate: '<b>%{meta.fullName}</b>' + '<br><b>%{meta.hoverXLabel}:</b> %{x}' + '<br>' +
        '<b>%{meta.yLabel}:</b> %{y:.2f}'
    };
    chartParameters.data.push(trace7);

    // Add annotation for the topkadmins
    const topKTrace: ChartLayoutAnnotations = {
      xref: 'paper',
      yref: 'paper',
      x: 0,
      xanchor: 'left',
      y: 1.0,
      yanchor: 'center',
      text: '<b>' + 'SI' + '</b>' + ' ' + DROPDOWN_ITEMS_INDEX[2] + ' | '
        + '<b>' + 'CS' + '</b>' + ' ' + DROPDOWN_ITEMS_INDEX[1] + ' | '
        + '<b>' + 'NI' + '</b>' + ' ' + DROPDOWN_ITEMS_INDEX[0] ,
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif',
        size: 10
      },
      showarrow: false,
      captureevents: false
    };
    chartParameters.layout.annotations.push(topKTrace);

    // Add an annotation for legend click event
    const legendTrace: ChartLayoutAnnotations = {
      xref: 'paper',
      yref: 'paper',
      x: 0.85,
      xanchor: 'center',
      y: 1,
      yanchor: 'top',
      yshift: 0,
      text: '<a href="">' + 'Hide legend' + '</a>',
      font: {
        family: '"IBM Plex Sans", "Open Sans", verdana, arial, sans-serif', },
      showarrow: false,
      captureevents: true,
      meta: {id: 'legend_click'},
    };
    chartParameters.layout.annotations.push(legendTrace);
    return chartParameters;
  }
}
