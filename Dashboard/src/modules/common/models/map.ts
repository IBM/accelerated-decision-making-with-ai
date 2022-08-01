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

export interface MapParameters {
  geoJSONObject?: any;
  baseGeoJson?: any;
  markers?: L.Marker[];
  polyLines?: L.Polyline[];
  noClustering?: boolean;
  chartSelectedTerritory?: any;
  geo?: string;
  parentGeo?: string;
  adminLevel?: number;
  outcome?: string;
  dateInformation?: string;
  showLegend?: boolean;
  showAsOf?: boolean;
  showGlyphSelector?: boolean;
  enableMapClick?: boolean;
  showMapPopups?: boolean;
  chartSelectedFeatureStyle?: FeatureStyle;
}

export interface FeatureStyle {
  weight?: number;
  color?: string;
  dashArray?: string;
  opacity?: number;
  fillOpacity?: number;
}
