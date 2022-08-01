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

import {Component, HostListener, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import * as L from 'leaflet';
import {environment} from '../../../../environments/environment';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {DatePipe} from '@angular/common';
import {getColor2, numberWithCommas} from '../../functions';

@Component({
  selector: 'app-simple-map',
  templateUrl: './simple-map.component.html',
  styleUrls: ['./simple-map.component.scss']
})
export class SimpleMapComponent implements OnInit, OnChanges {
  @Input() geoJson?: any[];
  @Input() bounds?: any;
  @Input() date?: any;
  @Input() index?: any;
  @Input() legendData?: any;
  layers: L.Layer[] = [];
  map: L.Map;
  innerHeight: number;
  layerLink = 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/512/{z}/{x}/{y}@2x?access_token=';

  mapboxTiles = L.tileLayer(this.layerLink + environment.mapbox_api_key, {
    maxZoom: 20,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    attribution: '© <a href="https://www.mapbox.com/about/maps/" rel="nofollow" target="_blank">Mapbox</a>'
  });

  options = {
    layers: [this.mapboxTiles],
    // zoom: 2,
    zoomControl: false,
    maxBounds: [[-90, -180], [90, 180]],
    // center: L.latLng([0.0, 0.0])
    worldCopyJump: true
  };

  dateInformation: string;
  legend: any;

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.innerHeight = 0.72 * window.innerHeight;
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (this.geoJson) {
      this.layers = [];
      for (const layer of this.geoJson) {
        this.layers.push(layer);
      }
    }
    if (isNotNullOrUndefined(this.index) && isNotNullOrUndefined(this.date)) {
      const formattedDate = this.datePipe.transform(this.date, 'MMM d, y');
      this.dateInformation = `${this.index} as of ${formattedDate}`;
    }
    this.fitMapBounds();
  }

  onMapReady(map) {
    this.map = map;
    this.map.invalidateSize();
    this.map.addControl(L.control.zoom({ position: 'topleft' }));

    if (this.geoJson) {
      for (const layer of this.geoJson) {
        this.layers.push(layer);
      }
    }

    if (isNotNullOrUndefined(this.legend)) { this.map.removeControl(this.legend); }
    if (isNotNullOrUndefined(this.legendData)) {
      this.legend = this.makeLegend(this.map);
    }

    this.fitMapBounds();
  }

  fitMapBounds() {
    if (this.map && isNotNullOrUndefined(this.bounds)) {
      this.map.fitBounds(this.bounds);
      this.map.invalidateSize();
    }
  }

  getStyle() {
    return { height: this.innerHeight + 'px' };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = 0.72 * window.innerHeight;
  }

  getAsOfLength(dateInformation: string) {
    if (!isNotNullOrUndefined(dateInformation) || dateInformation.length === 0) { return 120; }
    return Math.ceil(dateInformation.length * (132 / 18));
  }

  private makeLegend(map) {
    const legend = new (L.Control.extend({
      options: {position: 'bottomright'}
    }))();

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      const keyRanges = this.legendData.range;
      div.innerHTML = '';

      // loop through the density intervals and generate a label with a colored square for each interval
      div.innerHTML +=
        '<i style="background:' + getColor2(null) + '"></i> ' + 'No data' + '<br>';
      for (let i = 0; i < keyRanges.length; i++) {
        if (!isNotNullOrUndefined(keyRanges[i]) && !isNotNullOrUndefined(keyRanges[i + 1])) {
          continue;
        }
        div.innerHTML +=
          '<i style="background:' + getColor2(keyRanges[i], keyRanges, this.legendData.colors) + '"></i> ' +
          numberWithCommas(keyRanges[i]) + (isNotNullOrUndefined(keyRanges[i + 1]) ? '&ndash;'
          + numberWithCommas(keyRanges[i + 1]) + '<br>' :
          '+ ');
      }
      return div;
    };
    legend.addTo(map);
    return legend;
  }
}
