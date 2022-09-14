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
  DROPDOWN_ITEMS_GEO,
  DROPDOWN_ITEMS_Y_SCALE,
  GLYPHS,
  MAP_COLORS_OUTCOMES,
  MAP_DATA,
  MAP_POPUP_OPTIONS,
  NO_DATA
} from '../../constants';
import {MapParameters} from '../../models';
import * as L from 'leaflet';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {TitleCasePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  static ScaledRadius(val: number, maxVal: number, offset: number): number {
    return offset * (val / maxVal);
  }

  constructor(public titleCasePipe: TitleCasePipe) { }

  makeGlobalGeoJSON(dataToShow: any, geoJSON: any, parentGeo: string, date: number, yAxis: string) {
    let geoJSONToReturn = {type: 'FeatureCollection', features: []};
    if (!isNotNullOrUndefined(dataToShow)) {
      geoJSONToReturn = null;
      return geoJSONToReturn;
    }
    if (isNotNullOrUndefined(dataToShow) && isNotNullOrUndefined(Object.keys(dataToShow)[0]) && geoJSON.features.length > 0) {
      const densitiesArray = [];
      const minDensitiesArray = [];
      Object.keys(dataToShow).forEach(country => {
        const minMax = this.getTheHighestMetric(dataToShow, country, yAxis);
        densitiesArray.push(minMax.max);
        minDensitiesArray.push(minMax.min);
        let geoJSONFeature = null;
        if (parentGeo === DROPDOWN_ITEMS_GEO[0]) {
          geoJSONFeature = geoJSON.features
            .find(feature => feature.properties.ISO_A3.toLowerCase() === country.toLowerCase());
          if (isNotNullOrUndefined(geoJSONFeature)) {
            geoJSONFeature.properties['density'] = this.getTheCurrentMetric(dataToShow, country, date, yAxis);
            geoJSONFeature.properties['densityFeature'] = yAxis;
          }
        } else {
          geoJSONFeature = geoJSON.features
            .find(feature => feature.properties.NAME.toLowerCase() === country.toLowerCase());
          if (isNotNullOrUndefined(geoJSONFeature)) {
            geoJSONFeature.properties['density'] = this.getTheCurrentMetric(dataToShow, country, date, yAxis);
            geoJSONFeature.properties['densityFeature'] = yAxis;
          }
        }
      });
      let densityPartitionArray = [0, 0.05, 0.1, 0.2, 0.3, 0.5];
      const quartileDensityPartitionArray = this.getDensityPartitionArrayForLinearScale(densitiesArray, minDensitiesArray);
      if (isNotNullOrUndefined(quartileDensityPartitionArray) && quartileDensityPartitionArray.length !== 0) {
        densityPartitionArray = quartileDensityPartitionArray;
      }
      geoJSON.features.forEach(feature => {
        feature.properties['densityPartition'] = densityPartitionArray;
      });
    } else {
      return null;
    }
    return geoJSON;
  }

  getTheCurrentMetric(dataToShow, country, date, yAxis) {
    if (dataToShow.hasOwnProperty(country)) {
      let xValue = new Date(+date).getFullYear();
      if (!isNotNullOrUndefined(dataToShow[country]['data'])) {
        return 0;
      } else if (!isNotNullOrUndefined(dataToShow[country]['data'][xValue])) {
        const closestSmallestTimestamp = Object.keys(dataToShow[country]['data']).reverse().find(timestamp => +timestamp <= +xValue);
        xValue = new Date(+closestSmallestTimestamp).getFullYear();
      }
      return dataToShow[country]['data'][xValue][MAP_DATA[yAxis]];
    } else {
      return 0;
    }
  }

  makeMarkers(dataToShow: any, currentGlyph: string, parentGeo: string, date: number, yAxis: string, yScale: string, geoJSON: any) {
    const markers = [];
    const maxVal = this.getMaxValueFromData(dataToShow, yAxis);
    if (!isNotNullOrUndefined(dataToShow)) { return []; }
    const layer = L.geoJSON(geoJSON);
    Object.keys(layer['_layers']).forEach(leafletId => {
      if (layer['_layers'].hasOwnProperty(leafletId) && isNotNullOrUndefined(layer['_layers'][leafletId])) {
        const feature = layer['_layers'][leafletId]['feature'];
        let admin = feature.properties.ISO_A3;
        if (!isNotNullOrUndefined(admin)) { admin = this.titleCasePipe.transform(feature.properties.NAME); }
        const center = layer['_layers'][leafletId].getBounds().getCenter();
        const outcomeValue = this.getTheCurrentMetric(dataToShow, admin, date, yAxis);
        if (isNotNullOrUndefined(center) && outcomeValue > 0 && maxVal > 0 && isNotNullOrUndefined(dataToShow[admin])) {
          const adminName = dataToShow[admin]['name'];
          const latLngBaseOne = center;
          let curatedValue = outcomeValue;
          let curatedMaxVal = maxVal;
          let offset;
          if (yScale === DROPDOWN_ITEMS_Y_SCALE[1]) {
            curatedValue = Math.log10(+curatedValue);
            curatedMaxVal = Math.log10(+maxVal);
          }
          // specify popup options
          const popupOffsetPosition = L.point(0, -5);
          MAP_POPUP_OPTIONS['offset'] = popupOffsetPosition;
          const popupContent = this.makeDefautPopup(adminName, yAxis, outcomeValue);

          if (currentGlyph === GLYPHS.spikes.key) {
            if (yScale === DROPDOWN_ITEMS_Y_SCALE[1]) { offset = 15; } else {offset = 30; }
            const latLngBaseTwo = L.latLng([center.lat, center.lng + 1]);
            const latLngTop =
              L.latLng([center.lat + MapService.ScaledRadius(curatedValue, curatedMaxVal, offset), center.lng + 0.5]);
            const polyline = L.polyline([latLngBaseOne, latLngTop, latLngBaseTwo],
              {color: MAP_COLORS_OUTCOMES, weight: 1});

            polyline.on('mouseover', () => {
              polyline.bindPopup(popupContent, MAP_POPUP_OPTIONS).openPopup();
            });
            polyline.on('mouseout', () => {
              polyline.closePopup();
            });

            markers.push(polyline);
          } else if (currentGlyph === GLYPHS.bubbles.key) {
            if (yScale === DROPDOWN_ITEMS_Y_SCALE[1]) { offset = 300000; } else {offset = 900000; }
            const bubble = L.circle(latLngBaseOne, {
              color: MAP_COLORS_OUTCOMES,
              fillColor: MAP_COLORS_OUTCOMES,
              fillOpacity: 0.5,
              weight: 1.25,
              radius: MapService.ScaledRadius(curatedValue, curatedMaxVal, offset)
            });

            bubble.on('mouseover', () => {
              bubble.bindPopup(popupContent, MAP_POPUP_OPTIONS).openPopup();
            });
            bubble.on('mouseout', () => {
              bubble.closePopup();
            });

            markers.push(bubble);
          }
        }
      }
    });
    return markers;
  }

  getDefaultMapParams(): MapParameters {
    const mapParameters: MapParameters = {
      markers: [],
      noClustering: true,
      adminLevel: 0
    };
    return mapParameters;
  }

  makeDefautPopup(admin, densityFeature, density): string {
    if (!isNotNullOrUndefined(admin)) {
      return `Ops! an unidentified region`;
    }
    return `` +
      `<div class="popup-region-name">${ admin }</div>` +
      `<div>${isNotNullOrUndefined(densityFeature) ? densityFeature : NO_DATA}: ${(isNotNullOrUndefined(density) && density !== '')
        ? +density.toFixed(2) : NO_DATA}</div>`;
  }

  private getDensityPartitionArrayForLinearScale(maxDensitiesArray, minDensitiesArray) {
    const densityPartitionArray: number[] = [];
    let min = Math.max.apply(Math, minDensitiesArray.map(element => element));
    const max = Math.max.apply(Math, maxDensitiesArray.map(element => element));
    if (max > 1) {
      min = 50;
    } // TODO: Find better logic for this
    const increment = (max - min) / 5;
    for (let i = 0; i < 5; i++) {
      densityPartitionArray.push(min + (increment * i));
    }
    densityPartitionArray.unshift(0);
    let decimalPlaces = Math.abs(+(densityPartitionArray[1].toExponential().split('e')[1])) + 1;
    if (decimalPlaces < 3) { decimalPlaces = 3; }
    return densityPartitionArray.map(element => Number(element.toFixed(decimalPlaces)));
  }

  private getTheHighestMetric(dataToShow: any, country: any, yAxis: string) {
    if (dataToShow.hasOwnProperty(country)) {
      if (!isNotNullOrUndefined(dataToShow[country]['data'])) {
        return {min: 0, max: 0};
      }
      const sortedDates = Object.keys(dataToShow[country]['data']).sort((a, b) => {
        const bData = dataToShow[country]['data'][b][MAP_DATA[yAxis]];
        const aData = dataToShow[country]['data'][a][MAP_DATA[yAxis]];
        return +bData - +aData;
      });
      return {min: +dataToShow[country]['data'][sortedDates[Object.keys(sortedDates).length - 1]][MAP_DATA[yAxis]],
        max: +dataToShow[country]['data'][sortedDates[0]][MAP_DATA[yAxis]]};
    } else {
      return {min: 0, max: 0};
    }
  }

  private getMaxValueFromData(dataToShow: any, yAxis: string) {
    if (isNotNullOrUndefined(dataToShow)) {
      const densitiesArray: number[] = [];
      Object.keys(dataToShow).forEach(country => { densitiesArray.push(+this.getTheHighestMetric(dataToShow, country, yAxis).max); });
      return Math.max.apply(Math, densitiesArray.map(element => element));
    }
    return 0;
  }
}
