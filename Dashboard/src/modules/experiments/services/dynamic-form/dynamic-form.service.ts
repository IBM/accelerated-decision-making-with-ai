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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { ExecutorRequirement, OptimizationEnvelope } from 'src/modules/common/models/executor';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor(private formBuilder: FormBuilder) { }

  toFormGroup(forms: ExecutorRequirement<any>[]) {
    const group: any = {};

    forms.forEach(form => {
      form.value = form.value ? form.value : form.defaults;
      if (isNotNullOrUndefined(form.optimizationEnvelope) && Object.keys(form.optimizationEnvelope).length > 0) { return; }
      group[form.name] = form.required === 'true'
      ? new FormControl(form.value || '', Validators.required)
      : new FormControl(form.value || '');
      form.readonly === 'true' ? group[form.name].disable({ onlySelf: true }) : group[form.name].enable()
    });
    return new FormGroup(group);
  }

  toFilteredFormGroup(forms: ExecutorRequirement<any>[], optimizationEnvelope: OptimizationEnvelope) {
    const group: any = {};
    const filteredForms: ExecutorRequirement<any>[] = [];

    forms.forEach(form => {
      if (!(form.id in optimizationEnvelope) || !isNotNullOrUndefined(optimizationEnvelope[form.id])) { return; }
      form.value = optimizationEnvelope[form.id];
      group[form.name] = form.required === 'true'
      ? new FormControl(form.value || '', Validators.required)
      : new FormControl(form.value || '');
      optimizationEnvelope[form.id] ? group[form.name].disable({ onlySelf: true }) : group[form.name].enable()
      filteredForms.push(form);
    });
    return {formGroup: new FormGroup(group), filteredForms};
  }
}
