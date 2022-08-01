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

import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import {MAP_COLORS, MAP_DATA} from '../constants';

export function transparentize(color, opacity?) {
  const alpha = opacity === undefined ? 0.5 : 1 - opacity;
  const _opacity = Math.round(Math.min(Math.max(alpha || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

export function getColor(d, range?: number[]): string {
  let grades = [0, 5, 10, 15, 20, 30];
  if (!isNotNullOrUndefined(d) || d === 'NaN') {
    return '#F2EFEA' ;
  }
  if (isNotNullOrUndefined(range)) {
    grades = range;
  }
  const someKindOfYellow = ['#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
  return d > grades[5] ? someKindOfYellow[6] :
    d > grades[4] ? someKindOfYellow[5] :
      d > grades[3] ? someKindOfYellow[4] :
        d > grades[2] ? someKindOfYellow[3] :
          d > grades[1] ? someKindOfYellow[2] :
            d > grades[0] ? someKindOfYellow[1] :
              someKindOfYellow[0];
}

export function getColor2(d, range?: number[], colors?: string[]): string {
  if (!isNotNullOrUndefined(d) || d === 'NaN') {
    return '#d9d9d9' ;
  }
  if (!isNotNullOrUndefined(range)) {
    range = [0, 5, 10, 15, 20, 30];
  }
  if (!isNotNullOrUndefined(colors)) {
    colors = MAP_COLORS.someKindOfYellow;
  }
  return d >= range[6] ? colors[7] :
    d >= range[5] ? colors[6] :
      d >= range[4] ? colors[5] :
        d >= range[3] ? colors[4] :
          d >= range[2] ? colors[3] :
            d >= range[1] ? colors[2] :
              d >= range[0] ? colors[1] :
                colors[0];
}

export function numberWithCommas(x) {
  if (!isNotNullOrUndefined(x) || isNaN(x)) { return x; }
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const rangeOfYears = (start, end) => Array(end - start + 1)
  .fill(start)
  .map((year, index) => {
    year = year + index;
    return new Date(year, 5);
  });

export function transform(value: string, args: any[]): string {
  const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
  const trail = args.length > 1 ? args[1] : '...';
  return value.length > limit ? value.substring(0, limit) + trail : value;
}

export function getTheCurrentMetric(candidateData, admin, date, yAxis) {
  if (candidateData.hasOwnProperty(admin)) {
    let xValue = new Date(+date).getFullYear();
    if (!isNotNullOrUndefined(candidateData[admin]['data'])) {
      return '';
    } else if (!isNotNullOrUndefined(candidateData[admin]['data'][xValue])) {
      const closestSmallestTimestamp = Object.keys(candidateData[admin]['data']).reverse().find(timestamp => +timestamp <= +xValue);
      xValue = new Date(+closestSmallestTimestamp).getFullYear();
    }
    return candidateData[admin]['data'][xValue][MAP_DATA[yAxis]];
  } else {
    return '';
  }
}

export function roundOff(numberx, decimalPlaces) {
  return parseFloat(numberx + '').toFixed(decimalPlaces);
}

export function filterOut(id: string, entities: any[]): any[] {
  let filterValue = id.toLowerCase();
  filterValue = filterValue.trim();
  return entities.filter(option => option.id.toLowerCase() !== filterValue);
}

export function getDaysBetweenTimestampInDays(endTime: number, startTime: number): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.ceil((endTime - startTime) / oneDay);
}

export function isString(value) {
  return typeof value === 'string' || value instanceof String;
}
