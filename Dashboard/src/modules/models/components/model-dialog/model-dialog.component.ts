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

import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { ApiService } from '../../../common/services';
import { Executor } from '../../../common/models/executor';
import { ModelDialogService } from '../../services/model-dialog/model-dialog.service';

@Component({
  selector: 'app-model-dialog',
  templateUrl: './model-dialog.component.html',
  styleUrls: ['./model-dialog.component.scss'],
})
export class ModelDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  formGroup: FormGroup;
  submitted: boolean;
  private id: string;
  defaultExecutors: Executor[] = [];
  private subscribeDefaultExecutors: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModelDialogService>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setupForm();
    if (isNotNullOrUndefined(this.data.model)) {
      this.loadModelData(this.data.model);
      if (isNotNullOrUndefined(this.data.model.defaultPostExecutor)) {
        this.defaultExecutors = this.data.model.defaultPostExecutor;
      }
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {
    if (this.subscribeDefaultExecutors) {
      this.subscribeDefaultExecutors.unsubscribe();
    }
  }

  /**
   * setup the model form
   */
  private setupForm() {
    this.formGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      name: ['', [Validators.required]],
      version: ['', [Validators.required]],
      versionAuthor: ['', [Validators.required]],
      versionDate: ['', [Validators.required]],
      githubLink: ['', [Validators.required]],
      uri: ['', [Validators.required]],
      runCommand: [''],
      modelDataUrl: ['', [Validators.required]],
      modelDataDescription: ['', [Validators.required]]
    });
  }

  /**
   * load the model for editing action
   */
  private loadModelData(model: Executor) {
    this.formGroup.controls['title'].setValue(model.title);
    this.formGroup.controls['name'].setValue(model.name);
    this.formGroup.controls['version'].setValue(model.version);
    this.formGroup.controls['versionDate'].setValue(model.versionDate);
    this.formGroup.controls['versionAuthor'].setValue(model.versionAuthor);
    this.formGroup.controls['githubLink'].setValue(model.githubLink);
    this.formGroup.controls['uri'].setValue(model.uri);
    this.formGroup.controls['runCommand'].setValue(model.runCommand);
    if (model.executorRequirement && model.executorRequirement[0] && model.executorRequirement[0]) {
      this.formGroup.controls['modelDataUrl'].setValue( model.executorRequirement[0].value);
      this.formGroup.controls['modelDataDescription'].setValue( model.executorRequirement[0].description);
    }
    if (isNotNullOrUndefined(model.id)) {
      this.id = model.id;
    }
  }

  /**
   * submit the model
   */
  onSubmit(model: FormGroup) {
    this.submitted = true;
    model['id'] = this.id;
    this.dialogRef.close(model);
  }

  defaultExecutorsChangeListener(de: Executor) {
    console.log(de);
  }

  minDates() {
    return '';
  }

  maxDates() {
    return '';
  }
}
