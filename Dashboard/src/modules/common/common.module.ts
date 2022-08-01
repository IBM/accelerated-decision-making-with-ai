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

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
  Optional,
  SkipSelf,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlotlyModule } from 'angular-plotly.js';
import { Ng5SliderModule } from 'ng5-slider';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import * as PlotlyJS from 'plotly.js-dist';
import {
  COMPONENT_DECLARATIONS,
  ENTRY_COMPONENT_DECLARATIONS,
} from './components';
import { PMAI_INTERCEPTORS } from './interceptors';
import { MaterialModule } from './material.module';
import { PIPE_DECLARATIONS } from './pipes';
import { AppRoutingModule } from './routing.module';
import { SERVICE_DECLARATIONS } from './services';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [...COMPONENT_DECLARATIONS, ...PIPE_DECLARATIONS],
  entryComponents: [...ENTRY_COMPONENT_DECLARATIONS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [...SERVICE_DECLARATIONS, ...PIPE_DECLARATIONS, PMAI_INTERCEPTORS],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule.forRoot(),
    MaterialModule,
    Ng5SliderModule,
    PlotlyModule,
    NgbModule,
    NgProgressModule,
    NgProgressHttpModule,
  ],
  exports: [...COMPONENT_DECLARATIONS, ...PIPE_DECLARATIONS, MaterialModule],
})
export class PMAICommonModule {
  constructor(@Optional() @SkipSelf() parentModule: PMAICommonModule) {
    if (parentModule) {
      throw new Error(
        `${PMAICommonModule.name} is already loaded. Import it in your application's root module only.`
      );
    }
  }
}
