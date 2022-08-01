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
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { COMPONENT_DECLARATIONS, ENTRY_COMPONENT_DECLARATIONS } from './components';
import { AppRoutingModule } from './routing.module';
import {PMAICommonModule, AppConfig, APP_CONFIG, AppComponent, PMAI_INTERCEPTORS} from '../common';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../common/material.module';
import {Error} from 'tslint/lib/error';
import {AlgorithmsModule} from '../algorithms';
import { ApisModule } from '../apis';
import { HowToModule } from '../howto';
import { FeedbackModule } from '../feedback';
import { OverviewModule } from '../overview/overview.module';
import { ResultsModule } from '../results/results.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { ModelsModule } from '../models/models.module';

const UNGANA_APP_CONFIG: AppConfig = {
  identityServiceUrl: environment.identityServiceUrl,
  taskClerkServiceUrl: environment.taskClerkServiceUrl,
  swaggerDocsUrl: environment.swaggerDocsUrl
};

@NgModule({
  declarations: [
    ...COMPONENT_DECLARATIONS
  ],
  entryComponents: [...ENTRY_COMPONENT_DECLARATIONS],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    PMAICommonModule,
    AppRoutingModule,
    ModelsModule,
    ResultsModule,
    AlgorithmsModule,
    OverviewModule,
    ApisModule,
    HowToModule,
    FeedbackModule,
    ExperimentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [
    ...COMPONENT_DECLARATIONS
  ],
  providers: [
    { provide: APP_CONFIG, useValue: UNGANA_APP_CONFIG },
    PMAI_INTERCEPTORS
  ],
  bootstrap: [AppComponent]
})
export class AdminModule {

  constructor( @Optional() @SkipSelf() parentModule: AdminModule) {
    if (parentModule) {
      throw new Error(`${AdminModule.name} is already loaded. Import it in your application's root module only.`);
    }
  }

}
