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
import 'leaflet.markercluster';
import {getColor, numberWithCommas} from '../../functions';
import {DataService, MapService} from '../../services';
import {MAP_POPUP_OPTIONS, DROPDOWN_ITEMS_GEO, GLYPHS, DEFAULT_MAP_BOUNDS, MAP_CONSTANTS, NO_DATA} from '../../constants';
import {MapParameters, OverviewMapParameters} from '../../models';
import {environment} from '../../../../environments/environment';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() mapParameters: MapParameters;

  map: L.Map;
  layer0: any;
  layer1: any;
  legend: any;
  innerHeight: number;
  layers: L.Layer[] = [];
  fitBounds: L.LatLngBounds;
  densityPartitionArray: any[];
  markerClusterData: any[] = [];
  glyphOptions = Object.values(GLYPHS);
  markerClusterGroup: L.MarkerClusterGroup;
  layerLink = 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/512/{z}/{x}/{y}@2x?access_token=';

  overviewMapParameters: OverviewMapParameters = {
    glyph: GLYPHS.choropleth.key,
    geo: DROPDOWN_ITEMS_GEO[0],
    parentGeo: DROPDOWN_ITEMS_GEO[0]
  };

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
    // maxBounds: [[-90, -180], [90, 180]],
    // center: L.latLng([0.0, 0.0])
    worldCopyJump: true
  };

  constructor(private dataService: DataService, private mapService: MapService, public titleCasePipe: TitleCasePipe) {
    this.markerClusterGroup = L.markerClusterGroup();
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight;
  }

  onMapReady(map) {
    this.map = map;

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

    this.map.addControl(L.control.zoom({ position: 'topright' }));
    this.map.attributionControl
    .addAttribution('<a href="https://malariaatlas.org/" rel="nofollow" target="_blank">Malaria Atlas Project</a>');

    this.fitMapBounds();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = window.innerHeight;
  }

  getStyle() {
    return { height: this.innerHeight + 'px' };
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  getAsOfLength(dateInformation: string) {
    if (!isNotNullOrUndefined(dateInformation) || dateInformation.length === 0) { return 120; }
    return Math.ceil((dateInformation.length + 1) * (132 / 18));
  }

  changeGlyph($event) {
    this.overviewMapParameters.glyph = $event.value;
    this.overviewMapParameters['changes'] = 'glyph';
    this.dataService.changeOverviewMapParameters(this.overviewMapParameters);
    delete this.overviewMapParameters['changes'];
  }

  fitMapBounds() {
    if (this.map) {
      if (isNotNullOrUndefined(this.legend)) { this.map.removeControl(this.legend); }
      if (this.mapParameters.showLegend && isNotNullOrUndefined(this.mapParameters.geoJSONObject)) {
        this.legend = this.makeLegend(this.map);
      }

      // this.map.setMaxBounds(MAP_MAX_BOUNDS);

      if (this.mapParameters.geo !== this.mapParameters.parentGeo) {
        if (isNotNullOrUndefined(this.layers[0]) && isNotNullOrUndefined(this.layers[0]['_layers'])) {
          const thisGeoJSONFeature =  Object.keys(this.layers[0]['_layers']).filter(key => {
            const feature = this.layers[0]['_layers'][key]['feature'];
            return (feature.properties.ISO_A3 === this.mapParameters.geo)
              || (feature.properties.NAME.toLowerCase() === this.mapParameters.geo.toLowerCase() );
          })[0];
          if (isNotNullOrUndefined(thisGeoJSONFeature)) {
            this.map.fitBounds(this.layers[0]['_layers'][thisGeoJSONFeature].getBounds());
          }
        }
      } else if (this.mapParameters.adminLevel === 1 || this.mapParameters.adminLevel === 2) {
        if (isNotNullOrUndefined(this.layers[0]) && isNotNullOrUndefined(this.layers[0]['_layers'])) {
          let bounds;
          Object.keys(this.layers[0]['_layers']).forEach((key, index) => {
            if (index === 0) {
              bounds = this.layers[0]['_layers'][key].getBounds();
            } else {
              bounds.extend(this.layers[0]['_layers'][key].getBounds());
            }
          });
          this.map.fitBounds(bounds);
        }
      } else {
        this.map.fitBounds(DEFAULT_MAP_BOUNDS);
      }
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // markers are set depending on whether clustering is needed or not...
    if (isNotNullOrUndefined(this.mapParameters.noClustering) && this.mapParameters.noClustering) {
      this.layers = this.mapParameters.markers;
    } else {
      this.markerClusterData = this.mapParameters.markers;
    }

    this.addDefaultLayerToShowCountryBoundaries();

    if (isNotNullOrUndefined(this.mapParameters.polyLines) && isNotNullOrUndefined(this.mapParameters.polyLines[0])
      && this.overviewMapParameters.glyph !== GLYPHS.choropleth.key) {
      const polyLinesGroup = L.layerGroup(this.mapParameters.polyLines);
      this.layers.push(polyLinesGroup);
    }

    if (isNotNullOrUndefined(this.mapParameters.geoJSONObject) && this.overviewMapParameters.glyph === GLYPHS.choropleth.key) {
      this.layers = [];
      const that = this;
      this.markerClusterData = [];
      if (this.mapParameters.showLegend) {
        this.densityPartitionArray = [];
        this.densityPartitionArray = this.mapParameters.geoJSONObject.features[0].properties['densityPartition'];
      }
      this.layer1 = L.geoJSON(this.mapParameters.geoJSONObject, {style: feature => that.style(feature),
        onEachFeature(feature, layer): void {
          layer.on('mouseover', (e) => that.highlightFeature(e, feature));
          layer.on('mouseout', (e) => that.resetHighlight(e));
          layer.on('click', (e) => that.zoomToFeature(e, feature));
        }});
      this.layers.push(this.layer1);
    }

    if (isNotNullOrUndefined(this.mapParameters.geo) && this.mapParameters.geo !== this.mapParameters.parentGeo) {
      this.highlightChartSelectedRegion(this.mapParameters.geo, true);
    }
    this.fitMapBounds();
  }

  private makeLegend(map) {
    const legend = new (L.Control.extend({
      options: {position: 'bottomright'}
    }))();

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      const keyRanges = this.densityPartitionArray;
      div.innerHTML = '';

      // loop through the density intervals and generate a label with a colored square for each interval
      div.innerHTML +=
        '<i style="background:' + getColor(null) + '"></i> ' + NO_DATA + '<br>';
      for (let i = 0; i < keyRanges.length; i++) {
        if (!isNotNullOrUndefined(keyRanges[i]) && !isNotNullOrUndefined(keyRanges[i + 1])) {
          continue;
        }
        div.innerHTML +=
          '<i style="background:' + getColor(keyRanges[i], keyRanges) + '"></i> ' +
          numberWithCommas(keyRanges[i]) + (isNotNullOrUndefined(keyRanges[i + 1]) ? '&ndash;'
          + numberWithCommas(keyRanges[i + 1]) + '<br>' :
          '+ ' + this.mapParameters.outcome);
      }
      return div;
    };
    legend.addTo(map);
    return legend;
  }

  addDefaultLayerToShowCountryBoundaries() {
    const that = this;

    if (this.mapParameters.baseGeoJson) {
      const topLayerShowCountryBoundaries = L.geoJSON(this.mapParameters.baseGeoJson, {style: {
          // fillColor: '#f6f6f3',
          fillColor: '#ffffff',
          weight: 1,
          opacity: 0.6,
          color: '#ccc',
          dashArray: '0',
          fillOpacity: 0
        },
        onEachFeature(feature, layer): void {
          layer.on('click', (e) => that.zoomToFeature(e, feature));
        }});
      this.layers = [];
      this.layer0 = topLayerShowCountryBoundaries;
      this.layers.push(topLayerShowCountryBoundaries);
    }
  }

  zoomToFeature(e, feature) {
    if (isNotNullOrUndefined(feature.properties.ISO_A3)) {
      this.mapParameters.geo = feature.properties.ISO_A3;
    } else {
      this.mapParameters.geo = this.titleCasePipe.transform(feature.properties.NAME);
    }
    // if (!isNotNullOrUndefined(feature.properties.densityFeature)) { this.mapParameters.geo = this.mapParameters.parentGeo; }
    this.overviewMapParameters.geo = this.mapParameters.geo;
    this.overviewMapParameters.parentGeo = this.mapParameters.parentGeo;
    this.overviewMapParameters['changes'] = 'geo';
    this.dataService.changeOverviewMapParameters(this.overviewMapParameters);
    this.map.fitBounds(e.target.getBounds());
    if (isNotNullOrUndefined(this.mapParameters.geo) && this.mapParameters.geo !== this.mapParameters.parentGeo) {
      // this.highlightChartSelectedRegion(this.mapParameters.geo, true);
    }
    // this.fitMapBounds();
  }

  style(feature) {
    let d;
    let densityPartition;
    if (feature !== undefined && feature.properties !== undefined
      && feature.properties.densityPartition !== undefined && feature.properties.densityPartition.length > 0) {
      d = parseFloat(feature.properties.density);
      densityPartition = feature.properties.densityPartition;
    }
    // fill color
    const someKindOfYellow = ['#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
    const someKindOfBlue = ['#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];
    const someKindOfBlack = ['#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'];
    let fillColor = someKindOfBlack[0];

    const shadingArray = someKindOfYellow;

    const densityPartitionLength = densityPartition.length;
    if (d > parseFloat(densityPartition[densityPartitionLength - 1])) {
      fillColor = shadingArray[6];
    } else if (d >= parseFloat(densityPartition[densityPartitionLength - 2])) {
      fillColor = shadingArray[5];
    } else if (d >= parseFloat(densityPartition[densityPartitionLength - 3])) {
      fillColor = shadingArray[4];
    } else if (d >= parseFloat(densityPartition[densityPartitionLength - 4])) {
      fillColor = shadingArray[3];
    } else if (d >= parseFloat(densityPartition[densityPartitionLength - 5])) {
      fillColor = shadingArray[2];
    } else if (d >= parseFloat(densityPartition[0])) {
      fillColor = shadingArray[1];
    } else if (d < parseFloat(densityPartition[0])) {
      fillColor = shadingArray[0];
    }
    return {
      fillColor,
      weight: 1,
      opacity: 0.6,
      color: '#ccc',
      dashArray: '2',
      fillOpacity: 0.4
    };
  }

  highlightFeature(e, feature, noData = false) {
    const layer = e.target;

    let featureWeight = 2.5;
    let featureColor = '#999';
    let featureFillOpacity = 0.7;

    if (isNotNullOrUndefined(this.mapParameters.chartSelectedFeatureStyle)
      && layer.options.weight === this.mapParameters.chartSelectedFeatureStyle.weight) {
      featureWeight = 5;
      featureColor = '#606060';
      featureFillOpacity = 0.7125;
    }

    layer.setStyle({
      weight: featureWeight,
      color: featureColor,
      dashArray: '',
      fillOpacity: featureFillOpacity
    });

    // create popup contents
    let customPopup = '';
    if (noData) {
      customPopup = MAP_CONSTANTS.NO_DATA_AVAILABLE;
    } else {
      customPopup = this.mapService.makeDefautPopup(feature.properties.NAME, feature.properties.densityFeature, feature.properties.density);
    }

    // specify popup options
    MAP_POPUP_OPTIONS['offset'] = L.point(0, -5);

    layer.bindPopup(customPopup, MAP_POPUP_OPTIONS).openPopup(e.latlng);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    // this.fitMapBounds();
  }

  resetHighlight(e, noData = false) {
    setTimeout(() => {
      e.target.closePopup();
    }, 50);
    this.layer1.resetStyle(e.target);
    if (isNotNullOrUndefined(this.mapParameters.geo) && this.mapParameters.geo !== this.mapParameters.parentGeo) {
      this.highlightChartSelectedRegion(this.mapParameters.geo, true);
    }
    // this.fitMapBounds();
  }

  highlightChartSelectedRegion(chartSelectedTerritory, fromHoverEvent) {
    const countryName = chartSelectedTerritory;

    let topLayerFeatures = null;
    topLayerFeatures = Object.values(this.layers[0]['_layers']);

    const anyHighlightedFeature = topLayerFeatures.find(x => x['options']['weight']
      === this.mapParameters.chartSelectedFeatureStyle.weight);
    if (isNotNullOrUndefined(anyHighlightedFeature)) {
      const leafletId = anyHighlightedFeature['_leaflet_id'];
      let featureToReStyle = null;
      featureToReStyle = this.layers[0]['_layers'][leafletId];
      this.layer1.resetStyle(featureToReStyle);
    }

    let chosenFeature = topLayerFeatures.find(x => x['feature']['properties']['ISO_A3'] === countryName);
    if (isNotNullOrUndefined(this.mapParameters.parentGeo) && this.mapParameters.parentGeo !== DROPDOWN_ITEMS_GEO[0]) {
      chosenFeature = topLayerFeatures.find(x => x['feature']['properties']['NAME'].toLowerCase() === countryName.toLowerCase());
    } else if (!isNotNullOrUndefined(chosenFeature)) {
      // handle when event emanates from the chart
      chosenFeature = topLayerFeatures.find(x => x['feature']['properties']['NAME'].toLowerCase() === countryName.toLowerCase());
    }

    if (isNotNullOrUndefined(chosenFeature)) {
      const leafletId = chosenFeature['_leaflet_id'];

      let featureToStyle = null;
      featureToStyle = this.layers[0]['_layers'][leafletId];

      featureToStyle.setStyle(this.mapParameters.chartSelectedFeatureStyle);
    }
  }
}
