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

import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppConfig, APP_CONFIG } from '../common/models/config';
import { COMPONENT_DECLARATIONS, ENTRY_COMPONENT_DECLARATIONS} from './components/index';
import { SERVICE_DECLARATIONS } from './services/index';
import { RoutingModule } from './routing.module';
import { PMAI_INTERCEPTORS } from '../common/interceptors/interceptors';
import { AppComponent } from '../common/components/app/app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
      BrowserAnimationsModule,
      RoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule
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
export class FeedbackModule {
    constructor( @Optional() @SkipSelf() parentModule: FeedbackModule) {
        if (parentModule) {
            throw new Error(`${FeedbackModule.name} is already loaded. Import it in your application's root module only.`);
        }
    }
}
