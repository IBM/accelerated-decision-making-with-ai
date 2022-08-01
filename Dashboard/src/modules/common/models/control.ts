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

export interface OverviewMapParameters {
  glyph: string;
  geo: string;
  parentGeo: string;
}

export interface OverviewChartParameters {
  geo?: string;
  parentGeo?: string;
}

export interface OverviewControlPanelParameters extends Admin {
  xAxis?: string;
  yAxis?: string;
  yScale?: string;
  date?: number;
  per100kPop?: string;
  topKAdmins?: number;
  dataSources?: string[];
}

export interface OverviewParentParameters {
  floorDate: number;
  ceilDate: number;
  geo: string;
  parentGeo: string;
}

export interface Generic {
  from: string;
  to: string;
  message: any;
}

export interface Admin {
  geo?: string;
  parentGeo?: string;
  admin0?: string;
  admin1?: string;
  admin2?: string;
  adminLevel?: number;
}
