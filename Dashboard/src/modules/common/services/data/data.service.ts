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

import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
  OverviewMapParameters,
  OverviewChartParameters,
  OverviewControlPanelParameters,
  OverviewParentParameters, Generic, ModelMetadata
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private overviewMapParametersSource = new BehaviorSubject(null);
  overviewMapParametersObservable = this.overviewMapParametersSource.asObservable();

  private overviewChartParametersSource = new BehaviorSubject(null);
  overviewChartParametersObservable = this.overviewChartParametersSource.asObservable();

  private overviewControlPanelParametersSource = new BehaviorSubject(null);
  overviewControlPanelParametersObservable = this.overviewControlPanelParametersSource.asObservable();

  private overviewParentParametersSource = new BehaviorSubject(null);
  overviewParentParametersObservable = this.overviewParentParametersSource.asObservable();

  private genericSource = new BehaviorSubject(null);
  genericObservable = this.genericSource.asObservable();

  private modelMetadataSource = new BehaviorSubject(null);
  metadataSourceObservable = this.modelMetadataSource.asObservable();

  private domainSource = new BehaviorSubject(null);
  domainObservable = this.domainSource.asObservable();

  private authenticatedSource = new BehaviorSubject(false);
  authenticatedObservable = this.authenticatedSource.asObservable();

  constructor() { }

  changeOverviewMapParameters(overviewMapParameters: OverviewMapParameters) {
    this.overviewMapParametersSource.next(overviewMapParameters);
  }

  changeOverviewChartParameters(overviewChartParameters: OverviewChartParameters) {
    this.overviewChartParametersSource.next(overviewChartParameters);
  }

  changeOverviewControlPanelParameters(overviewControlPanelParameters: OverviewControlPanelParameters) {
    this.overviewControlPanelParametersSource.next(overviewControlPanelParameters);
  }

  changeOverviewParentParameters(overviewParentParameters: OverviewParentParameters) {
    this.overviewParentParametersSource.next(overviewParentParameters);
  }

  changeGeneric(generic: Generic) {
    this.genericSource.next(generic);
  }

  changeModelMetadata(modelMetadata: ModelMetadata) {
    this.modelMetadataSource.next(modelMetadata);
  }

  changeDomain(domain: string) {
    this.domainSource.next(domain);
  }

  changeAuthenticated(authenticated: boolean) {
    this.authenticatedSource.next(authenticated);
  }
}
