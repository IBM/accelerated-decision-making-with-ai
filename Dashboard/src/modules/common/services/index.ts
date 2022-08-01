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

import {StoreService} from './store/store.service';
import {ApiService} from './api/api.service';
import {MapService} from './map/map.service';
import {ChartService} from './chart/chart.service';
import {DataService} from './data/data.service';
import {ConfirmDialogService} from './confirm-dialog/confirm-dialog.service';
import {CurationService} from './curation/curation.service';
import {CacheService} from './cache/cache.service';
import {UserService} from './user/user.service';

export * from './store/store.service';
export * from './api/api.service';
export * from './map/map.service';
export * from './chart/chart.service';
export * from './data/data.service';
export * from './confirm-dialog/confirm-dialog.service';
export * from './curation/curation.service';
export * from './cache/cache.service';
export * from './user/user.service';

export const SERVICE_DECLARATIONS = [
  StoreService,
  ApiService,
  MapService,
  ChartService,
  DataService,
  ConfirmDialogService,
  CurationService,
  CacheService,
  UserService
];
