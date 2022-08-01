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

import * as L from 'leaflet';

export const MAP_COLORS_OUTCOMES = '#aaa';

export const GLYPHS = {
  choropleth: {key: 'choropleth', name: 'Choropleth'},
  spikes: {key: 'spikes', name: 'Spikes'},
  bubbles: {key: 'bubbles', name: 'Bubbles'}
};

export const MAP_POPUP_OPTIONS = {
  maxWidth: 150,
  className : 'custom-popup',
  closeButton: true,
  autoPan: false,
  keepInView: true,
};

export const DEFAULT_MAP_BOUNDS =
  L.latLngBounds(L.latLng([-34.81916635512371, -17.62504269049066]), L.latLng([37.349994411766545, 51.13387]));

export const MAP_MAX_BOUNDS =
  L.latLngBounds(L.latLng([-90, -180]), L.latLng([90, 180]));

export const MAP_COLORS = {someKindOfYellow: ['#d9d9d9', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'],
  someKindOfBlue: ['#d9d9d9', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']};
