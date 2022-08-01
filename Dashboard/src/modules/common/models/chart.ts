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

export interface ChartParameters {
  chartHeader: string;
  data: ChartData[];
  layout: ChartLayout;
  config: ChartConfig;
}

export interface ChartData {
  x?: any[];
  y?: any[];
  showlegend?: boolean;
  xaxis?: string;
  yaxis?: string;
  type?: string;
  marker?: ChartDataMarker;
  orientation?: string;
  name?: string;
  hovertemplate?: string;
  mode?: string;
  text?: any;
  textposition?: string;
  line?: ChartLine;
  visible?: any;
  opacity?: number;
  hoverinfo?: string;
  legendgroup?: string;
  meta?: ChartMeta;
  customdata?: any[];
  fill?: string;
  fillcolor?: string;
}

export interface ChartLayout {
  font?: ChartFont;
  xaxis?: ChartLayoutAxis;
  yaxis?: ChartLayoutAxis;
  grid?: ChartLayoutGrid;
  hoverlabel?: ChartLayoutHovelLabel;
  margin?: ChartLayoutMargin;
  hovermode?: string;
  height?: number;
  autosize?: boolean;
  showlegend?: boolean;
  legend?: ChartLayoutLegend;
  paper_bgcolor?: string;
  plot_bgcolor?: string;
  annotations?: ChartLayoutAnnotations[];
  shapes?: ChartLayoutShapes[];
  dragmode?: string;
  mapbox?: any;
  yaxis2?: ChartLayoutAxis;
}

export interface ChartConfig {
  responsive?: boolean;
  modeBarButtonsToRemove?: string[];
  displaylogo?: boolean;
  mapboxAccessToken?: string;
}

export interface ChartFont {
  family?: string;
  size?: number;
}

export interface ChartLayoutAxis {
  automargin?: boolean;
  tickfont?: ChartFont;
  showgrid?: boolean;
  showline?: boolean;
  fixedrange?: boolean;
  ticks?: string;
  showticklabels?: boolean;
  zeroline?: boolean;
  domain?: number[];
  rangemode?: string;
  title?: ChartLayoutAxisTitle;
  tickmode?: string;
  tickvals?: number[];
  ticktext?: string[];
  dtick?: number;
  type?: string;
  gridcolor?: string;
  linecolor?: string;
  zerolinecolor?: string;
  zerolinewidth?: number;
  range?: any[];
  hoverformat?: string;
  overlaying?: string;
  side?: string;
}

export interface ChartLayoutAxisTitle {
  text: string;
  standoff: number;
}

export interface ChartLayoutGrid {
  rows: number;
  columns: number;
  subplots: string[][];
}

export interface ChartLayoutHovelLabel {
  font: ChartFont;
  align: string;
}

export interface ChartLayoutMargin {
  l: number;
  r: number;
  b: number;
  t: number;
  pad?: number;
}

export interface ChartLayoutLegend {
  margin?: ChartLayoutMargin;
  tracegroupgap?: number;
  borderwidth?: number;
  bordercolor?: string;
  xanchor?: string;
  x?: number;
  y?: number;
  orientation?: string;
  font?: ChartFont;
  yanchor?: string;
}

export interface ChartLayoutAnnotations {
  x: any;
  y: any;
  xref?: string;
  yref?: string;
  text?: string;
  font?: ChartFont;
  showarrow?: boolean;
  xanchor?: string;
  yanchor?: string;
  arrowhead?: number;
  ax?: number;
  ay?: number;
  bordercolor?: string;
  borderpad?: number;
  captureevents?: boolean;
  meta?: ChartMeta;
  yshift?: number;
  visible?: boolean;
}

export interface ChartMeta {
  focus?: boolean;
  width?: number;
  widthFocus?: number;
  widthNoFocus?: number;
  color?: string;
  colorFocus?: string;
  colorNoFocus?: string;
  type?: string;
  admin?: string;
  hoverXLabel?: string;
  yLabel?: string;
  hoverYLabel?: string;
  xLabel?: string;
  fullName?: string;
  substitute?: string;
  npi_name?: string;
  id?: string;
}

export interface ChartLayoutShapes {
  type: string;
  x0: any;
  y0: any;
  x1: any;
  yref: string;
  y1: any;
  line: ChartLine;
  xsizemode: string;
  ysizemode: string;
  xanchor: any;
  yanchor: any;
  layer: string;
  visible: boolean;
  meta: ChartMeta;
  fillcolor: string;
  opacity: number;
}

export interface ChartLine {
  color?: string;
  width?: number;
  dash?: string;
}

export interface ChartDataMarker {
  color?: any;
  symbol?: any;
  opacity?: number;
  line?: ChartLine;
  size?: number;
}

export interface ChartCallBack {
  type?: string;
  inputChartParameters?: ChartParameters;
  pointsData?: PointsData;
}

export interface PointsData {
  meta?: ChartMeta;
  clickedLabel?: string;
}
