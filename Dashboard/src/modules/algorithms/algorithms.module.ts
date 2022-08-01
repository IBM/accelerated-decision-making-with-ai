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

import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, Optional, SkipSelf} from '@angular/core';
import {environment} from '../../environments/environment';
import {AppConfig} from '../common/models/index';
import {COMPONENT_DECLARATIONS, ENTRY_COMPONENT_DECLARATIONS} from './components/index';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PMAICommonModule, APP_CONFIG, AppComponent, PMAI_INTERCEPTORS} from '../common/index';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {RoutingModule} from './routing.module';
import {MaterialModule} from '../common/material.module';
import {HttpClientModule} from '@angular/common/http';
import {JoyrideModule} from 'ngx-joyride';
import {Ng5SliderModule} from 'ng5-slider';
import {SERVICE_DECLARATIONS} from './services/index';
import {DatePipe, TitleCasePipe} from '@angular/common';

const UNGANA_APP_CONFIG: AppConfig = {
  identityServiceUrl: environment.identityServiceUrl,
  taskClerkServiceUrl: environment.taskClerkServiceUrl,
  swaggerDocsUrl: environment.swaggerDocsUrl
};

@NgModule({
  declarations: [...COMPONENT_DECLARATIONS],
  entryComponents: [...ENTRY_COMPONENT_DECLARATIONS],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    PMAICommonModule,
    RoutingModule,
    HttpClientModule,
    JoyrideModule.forRoot(),
    Ng5SliderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [
    ...COMPONENT_DECLARATIONS
  ],
  providers: [
    { provide: APP_CONFIG, useValue: UNGANA_APP_CONFIG },
    ...SERVICE_DECLARATIONS,
    DatePipe,
    TitleCasePipe,
    PMAI_INTERCEPTORS
  ],
  bootstrap: [AppComponent]
})
export class AlgorithmsModule {
  constructor( @Optional() @SkipSelf() parentModule: AlgorithmsModule) {
    if (parentModule) {
      throw new Error(`${AlgorithmsModule.name} is already loaded. Import it in your application's root module only.`);
    }
  }
}
