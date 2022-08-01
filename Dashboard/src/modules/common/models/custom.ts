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

import {AdminLevel, Location} from './location';
import {Options} from 'ng5-slider';
import {User} from './user';

export interface ModelMetadata {
  generalLocation?: Location;
  adminLevelList?: AdminLevel[];
  name?: string;
  admin_type?: string;
  admin_level?: number;
  located_in?: string;
  country?: string;
  location?: Location;
  modelId?: string;
  modelName?: string;
  localisedModelDriverDataExists?: boolean;
  provisioned?: boolean;
}

export interface NgSliderParameters {
  type: string;
  units: string;
  value: number;
  highValue?: number;
  options: Options;
  rewardFunction?: string;
}

export interface Feedback {
  contact: string;
  feedback: string;
  user: User;
}
