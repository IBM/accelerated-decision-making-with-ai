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

import {ModelsComponent} from './models/models.component';
import {ModelDialogComponent} from './model-dialog/model-dialog.component';
import {RewardFunctionsDialogComponent} from './reward-functions-dialog/reward-functions-dialog.component';
import {MapDetailsComponent} from './map-details/map-details.component';
import {LocationDialogComponent} from './location-dialog/location-dialog.component';

export * from './models/models.component';
export * from './model-dialog/model-dialog.component';
export * from './reward-functions-dialog/reward-functions-dialog.component';
export * from './map-details/map-details.component';
export * from './location-dialog/location-dialog.component';

export const COMPONENT_DECLARATIONS = [
  ModelsComponent,
  ModelDialogComponent,
  RewardFunctionsDialogComponent,
  MapDetailsComponent,
  LocationDialogComponent
];

export const ENTRY_COMPONENT_DECLARATIONS = [
  ModelDialogComponent,
  RewardFunctionsDialogComponent,
  LocationDialogComponent,
];
