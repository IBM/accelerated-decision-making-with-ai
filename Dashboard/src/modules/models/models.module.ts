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
import {COMPONENT_DECLARATIONS, ENTRY_COMPONENT_DECLARATIONS} from './components/index';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {RoutingModule} from './routing.module';
import {HttpClientModule} from '@angular/common/http';
import {JoyrideModule} from 'ngx-joyride';
import {Ng5SliderModule} from 'ng5-slider';
import {SERVICE_DECLARATIONS} from './services/index';
import {CommonModule, DatePipe, TitleCasePipe} from '@angular/common';
import {MglTimelineModule} from 'angular-mgl-timeline';
import { environment } from 'src/environments/environment';
import { AppConfig, PMAICommonModule, APP_CONFIG, PMAI_INTERCEPTORS, AppComponent } from '../common';
import { MaterialModule } from '../common/material.module';

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
    Ng5SliderModule,
    MglTimelineModule
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
export class ModelsModule {
  constructor( @Optional() @SkipSelf() parentModule: ModelsModule) {
    if (parentModule) {
      throw new Error(`${ModelsModule.name} is already loaded. Import it in your application's root module only.`);
    }
  }
}
