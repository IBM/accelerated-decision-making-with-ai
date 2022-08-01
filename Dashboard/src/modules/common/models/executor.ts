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

import {DataRepositoryConfiguration} from './location';

export interface Contact {
  id?: string;
  system?: string;
  value?: string;
}

export interface Address {
  id?: string;
  name?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  lat?: string;
  lng?: string;
}

export interface Organization {
  id?: string;
  name?: string;
  email?: string;
  active?: boolean;
  contactList?: Contact[];
  address?: Address;
}

export interface Executor {
  actions?: string[];
  active?: boolean;
  alias?: string;
  counterFactualComparison?: boolean;
  createdAt?: number;
  dataRepositoryConfiguration?: DataRepositoryConfiguration;
  defaultPostExecutor?: Executor[];
  description?: string;
  executionEnvironmentCommand?: ExecutionEnvironmentCommand;
  executorType?: ExecutorType;
  fileName?: string;
  githubLink?: string;
  hash?: string;
  id?: string;
  name?: string;
  organization?: Organization;
  rating?: number;
  runCommand?: string;
  title?: string;
  updatedAt?: number;
  uri?: string;
  verified?: boolean;
  version?: string;
  versionAuthor?: string;
  versionDate?: string;
  executorDomain?: ExecutorDomain[];
  executorRequirement?: ExecutorRequirement<any>[];
}

export class ExecutorRequirement<T> {
  value: T|undefined;
  id: string;
  name: string;
  category: string;
  type: string;
  defaults: string;
  hidden: string;
  required: string;
  readonly: string;
  description: string;
  options: string[];
  metadataDetailsList: [];
  optimizationEnvelope: OptimizationEnvelope;

  constructor(options: {
      value?: T;
      id?: string;
      name?: string;
      category?: string;
      type?: string;
      defaults?: string;
      hidden?: string;
      required?: string;
      readonly?: string;
      description?: string;
      options?: string[];
      metadataDetailsList?: [];
      optimizationEnvelope?: OptimizationEnvelope;
  } = {}) {
      this.value = options.value;
      this.id = options.id || '';
      this.name = options.name || '';
      this.category = options.category || '';
      this.type = options.type || '';
      this.defaults = options.defaults || '';
      this.hidden = options.hidden || 'false';
      this.required = options.required || 'false';
      this.readonly = options.readonly || 'false';
      this.description = options.description || '';
      this.options = options.options || [];
      this.metadataDetailsList = options.metadataDetailsList || [];
      this.optimizationEnvelope = options.optimizationEnvelope || undefined;
  }
}

export interface OptimizationEnvelope {
  value?: string;
  minValue?: string;
  maxValue?: string;
  stepValue?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  stepDays?: string;
  numberOfEpisodes?: string;
}

export interface ExecutionEnvironment {
  id?: string;
  environment?: string;
  hostEndpoint?: string;
  authenticationEndpoint?: string;
  hostUsername?: string;
  hostPassword?: string;
}

export interface ExecutionEnvironmentCommand {
  createdAt?: number;
  updatedAt?: number;
  id?: string;
  commandName?: string;
  commandTemplate?: string;
  commandEntryPoint?: string;
  commandEntryPointURIExtension?: string;
  commandContentType?: string;
  expectedUserProvidedInputs?: string[];
  systemDefaultInputs?: string[];
  executorValues?: string[];
  systemAutoFillInputs?: any;
  commandSampleOutput?: string;
  executionEnvironment?: ExecutionEnvironment;
}

export interface ExecutorType {
  createdAt?: number;
  updatedAt?: number;
  id?: string;
  type?: string;
  name?: string;
  description?: string;
  contentType?: string;
}

export interface ExecutorDomain {
  id?: string;
  type?: string;
  domain?: string;
  description?: string;
}
