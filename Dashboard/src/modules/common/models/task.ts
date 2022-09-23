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

import {Executor} from './executor';
import {DataRepositoryConfiguration, Location, LocationData} from './location';

export interface Task {
  id?: string;
  name?: string;
  description?: string;
  user?: any;
  executor?: Executor;
  location?: Location;
  locationData?: LocationData;
  taskInputs?: TaskInputs;
  selectedPostExecutor?: Executor[];
  dataRepositoryConfiguration?: DataRepositoryConfiguration;
}

export interface Experiments {
  id?: string; // backend
  name?: string; // dynamicGroup
  userId?: string; // frontend
  timestamp?: number; // frontend
  status?: boolean; // frontend
  experimentHash?: string; // backend
  data?: string;  // dynamicGroup // individual optimization envelope groups also
  algorithmId?: string; // backend
  description?: string; // dynamicGroup
  experimentType?: string; // dynamicGroup
  location?: Location; // staticGroup but just the name
  executor?: Executor; // staticGroup
  selectedPostExecutor?: Executor[]; // staticGroup
}

export interface Algorithms {
  id?: string;
  uri?: string;
  title?: string;
  name?: string;
  version?: string;
  versionDate?: string;
  versionAuthor?: string;
  githubLink?: string;
  requirements?: string;
  type?: string;
  isVerified?: boolean;
  active?: boolean;
  rating?: number;
}

export interface TaskInputs {
  action?: any;
  name?: string;
  description?: string;
}

export interface TaskInputsRange {
  action?: Action;
  name?: string;
  description?: string;
}

export interface Action {
  values?: string;
  seed?: number;
}

export interface ActionRange {
  values?: string;
  resolution?: number;
}

export interface Intervention {
  action?: string;
  coverage?: string;
  time?: string;
  description?: string;
}

export interface Policy {
  policyId: string;
  policyName: string;
  location: string;
  intervention_space: string;
  total_intervention_cost: string;
  model: string;
  no_of_interventions: number;
  no_of_episodes: number;
  actions: Intervention[];
  reward: any;
}

export interface Results {
  location?: string;
  policies?: Policy[];
}

export interface Request {
  requestId?: string;
  requestName?: string;
  timeCreated?: string;
  status?: boolean;
  timeCompleted?: string;
  objective?: Executor;
  location?: Location;
  results?: Results;
}

export interface ResultsRequest {
  id?: string;
  requestName?: string;
  timeCreated?: string;
  timeCompleted?: string;
  status?: boolean;
  environments?: any[];
  executors?: Executor[];
  locations?: Location[];
  experiments?: Experiments[];
  tasks?: Task[];
  customMap?: any[];
  results?: ResultsResponse[];
}

export interface ResultsResponse {
  id?: string;
  resultId?: string;
  resultName?: string;
  locationId?: string;
  executorId?: string;
  actions?: any[];
  rewards?: any[];
}

export interface MapData{
  json?: string;
}
