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
import { Executor, ExecutorRequirement } from '../../../common';
import { RewardFunctionsDialogService } from '../../services/reward-functions-dialog/reward-functions-dialog.service';

@Component({
  selector: 'app-reward-functions-dialog',
  templateUrl: './reward-functions-dialog.component.html',
  styleUrls: ['./reward-functions-dialog.component.scss'],
})
export class RewardFunctionsDialogComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  formGroup: FormGroup;
  submitted: boolean;
  private id: string;
  executorRequirements: ExecutorRequirement<any>[] = [];
  private selectedFile: any;
  fileError = '';
  environmentCapabilities: string[] = ['Calibration', 'Intervention Planning', 'Model Evaluation'];
  mandatoryRequirementKeys = ['description', 'name', 'category', 'type'];
  category = ['parameter', 'optimization_parameter', 'data'];
  types = ['number', 'string', 'date', 'button', 'checkbox', 'color', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RewardFunctionsDialogService>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setupForm();
    if (isNotNullOrUndefined(this.data.rewardFunction)) {
      this.loadRewardFunctionsData(this.data.rewardFunction);
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  /**
   * setup the model form
   */
  private setupForm() {
    this.formGroup = this.formBuilder.group({
      version: ['', [Validators.required]],
      title: ['', [Validators.required]],
      name: ['', [Validators.required]],
      githubLink: ['', [Validators.required]],
      actions: [[], [Validators.required]],
      uri: ['', [Validators.required]],
      versionAuthor: ['', [Validators.required]],
      versionDate: ['', [Validators.required]],
      executorRequirement: ['', [Validators.required]],
      runCommand: ['', [Validators.required]],
    });
  }

  /**
   * load the model for editing action
   */
  private loadRewardFunctionsData(rewardFunction: Executor) {
    this.formGroup.controls['version'].setValue(rewardFunction.version);
    this.formGroup.controls['title'].setValue(rewardFunction.title);
    this.formGroup.controls['name'].setValue(rewardFunction.name);
    this.formGroup.controls['githubLink'].setValue(rewardFunction.githubLink);
    this.formGroup.controls['actions'].setValue(rewardFunction.actions);
    this.formGroup.controls['uri'].setValue(rewardFunction.uri);
    this.formGroup.controls['versionAuthor'].setValue(rewardFunction.versionAuthor);
    this.formGroup.controls['versionDate'].setValue(rewardFunction.versionDate);
    this.formGroup.controls['executorRequirement'].setValue(rewardFunction.executorRequirement);
    this.formGroup.controls['runCommand'].setValue(rewardFunction.runCommand);
    if (isNotNullOrUndefined(rewardFunction.id)) {
      this.id = rewardFunction.id;
    }
  }

  /**
   * submit the model
   */
  onSubmit(rewardFunction: FormGroup) {
    this.submitted = true;
    rewardFunction['id'] = this.id;
    if (rewardFunction['id']) {
      this.data.rewardFunction['version'] = rewardFunction['version'];
      this.data.rewardFunction['title'] = rewardFunction['title'];
      this.data.rewardFunction['name'] = rewardFunction['name'];
      this.data.rewardFunction['githubLink'] = rewardFunction['githubLink'];
      this.data.rewardFunction['actions'] = rewardFunction['actions'];
      this.data.rewardFunction['uri'] = rewardFunction['uri'];
      this.data.rewardFunction['versionAuthor'] = rewardFunction['versionAuthor'];
      this.data.rewardFunction['versionDate'] = rewardFunction['versionDate'];
      this.data.rewardFunction['executorRequirement'] = (this.selectedFile) ?this.selectedFile : this.data.rewardFunction['executorRequirement'];
      this.data.rewardFunction['runCommand'] = rewardFunction['runCommand'];
      this.dialogRef.close(this.data.rewardFunction);
    } else {
      rewardFunction['executorRequirement'] = this.selectedFile;
      this.dialogRef.close(rewardFunction);
    }
  }

  minDates() {
    return '';
  }

  maxDates() {
    return '';
  }

  onFileSelected(event) {
    const inputFile: any = event.target.files[0];
    if (typeof (FileReader) !== 'undefined') {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        try {
          this.selectedFile = JSON.parse(e.target.result)
          this.selectedFile.forEach(req => {
            console.log(req);
            // check if mandatory fields are missing
            const keys = Object.keys(req);
            const isFound = this.mandatoryRequirementKeys.every( ai => Object.keys(req).includes(ai));
            if (!isFound)
              throw new Error('One of the mandatory fields missing!');
            // check if category is set correctly
            if (this.category.indexOf(req['category']) === -1)
              throw new Error('Category ' + req['category'] + ' unknown!');
            // check if types is set correctly
            if (this.types.indexOf(req['type']) === -1)
              throw new Error('Type ' + req['type'] + ' unknown!');

            // check if optimization_parameter have optimization envelope and if others have optimization envelope
            if (req['category'] === 'optimization_parameter' && !req['optimizationEnvelope'])
              throw new Error('optimization_parameter must have optimizationEnvelope provided');
            else if (req['category'] !== 'optimization_parameter' && req['optimizationEnvelope'])
              throw new Error(req['category'] + ' must not have optimizationEnvelope provided');

            // if readonly is set to true, a value must be provided
            if (req['readonly'] === 'true' && !req['value'])
              throw new Error('Readonly parameters must have the value property set');

            // ensure all values are strings
            if (keys.indexOf('optimizationEnvelope') > -1) {
              const tmp = Object.assign({}, req);
              delete tmp['optimizationEnvelope'];
              if (!Object.values(tmp).every(value => typeof value === 'string')
               || !Object.values(req['optimizationEnvelope']).every(value => typeof value === 'string'))
                throw new Error('Some values have not been provided as strings');
            } else {
              if (!Object.values(req).every(value => typeof value === 'string'))
                throw new Error('Some values have not been provided as strings');
            }

            // ensure dates if provided are off the format yyyy-mm-dd
            if (req['type'] === 'date') {
              if(req['defaults']) {
                const dateParts = req['defaults'].split('-');
                if (dateParts.length !== 3
                  || dateParts[0].length !== 4
                  || dateParts[1].length !== 2
                  || dateParts[2].length !== 2)
                  throw new Error('Date format of yyyy-MM-dd not observed on the dates provided!');
              }
              if(req['value']) {
                const dateParts = req['value'].split('-');
                if (dateParts.length !== 3
                  || dateParts[0].length !== 4
                  || dateParts[1].length !== 2
                  || dateParts[2].length !== 2)
                  throw new Error('Date format of yyyy-MM-dd not observed on the dates provided!');
              }
            }
          });
        } catch(e) {
          console.log(e);
          this.formGroup.controls['executorRequirement'].setValue(null);
          this.fileError = e;
          this.selectedFile = null;
        }
      };

      // fileReader.readAsArrayBuffer(inputFile);
      // fileReader.readAsText(inputFile);
      fileReader.readAsBinaryString(inputFile);
      // fileReader.readAsDataURL(inputFile)
    }
  }
}
