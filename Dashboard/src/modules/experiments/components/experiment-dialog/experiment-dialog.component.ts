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

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { ApiService, SNACK_BAR_DURATION } from 'src/modules/common';
import { EXPERIMENTS_CONSTANTS, EXPERIMENT_DIALOG_CONSTANTS } from '../../constants/experiments.constants';
import { ExperimentDialogService } from '../../services';

@Component({
  selector: 'app-experiment-dialog',
  templateUrl: './experiment-dialog.component.html',
  styleUrls: ['./experiment-dialog.component.scss'],
})
export class ExperimentDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  submitted: boolean;
  actionTypes: string[] = [];
  options: any;
  private metadataDetailsObservable: any;
  pickerDisabled = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ExperimentDialogService>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    if (this.dialogRef.afterOpened()) {
      this.dialogRef.afterOpened().subscribe(() => this.setOptions());
    }
  }

  ngOnInit() {
    this.setOptions();
    this.setupForm();
  }

  ngOnDestroy(): void {
    if (this.metadataDetailsObservable) {
      this.metadataDetailsObservable.unsubscribe();
    }
  }

  private setupForm() {
    this.actionTypes = this.data.experiment.interventions;
    if (this.data.type === EXPERIMENTS_CONSTANTS.TASKS.SINGLE) {
      this.formGroup = this.formBuilder.group({
        coverage: ['', [Validators.required]],
        modelName: ['', [Validators.required]],
        time: ['', [Validators.required]],
      });
    } else if (this.data.type === EXPERIMENTS_CONSTANTS.TASKS.MULTIPLE) {
      if (this.data.experiment.experiment_type === EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.PREDICTION) {
        this.formGroup = this.formBuilder.group({
          interventionName: ['', [Validators.required]],
          numberOfEpisodes: ['', [Validators.required]],
          startDate: ['', [Validators.required]],
          numberOfSimulationYears: ['', [Validators.required]],
          dateStep: ['', [Validators.required]],
          coverageStep: ['', [Validators.required]],
          coverageMinMax: this.formBuilder.control([0, 100]),
        });
      } else if (this.data.experiment.experiment_type === EXPERIMENTS_CONSTANTS.EXPERIMENT_TYPES.CALIBRATION) {
        this.formGroup = this.formBuilder.group({
          time: ['', [Validators.required]],
          numberOfEpisodes: ['', [Validators.required]],
          numberOfSimulationYears: ['', [Validators.required]],
          coverageStep: ['', [Validators.required]],
        });

        this.formGroup.controls['time'].setValue('2020-04-01');
        this.formGroup.controls['numberOfEpisodes'].setValue(10);
        this.formGroup.controls['numberOfSimulationYears'].setValue(280);
        this.formGroup.controls['coverageStep'].setValue(28);
        this.pickerDisabled = true;
      }
    } else if (this.data.type === EXPERIMENTS_CONSTANTS.TASKS.CONTINUOUS) {
      this.formGroup = this.formBuilder.group({
        timeEnd: ['', [Validators.required]],
        modelName: ['', [Validators.required]],
        time: ['', [Validators.required]],
      });

      this.metadataDetailsObservable = this.apiService
        .getMetadataDetails(
          this.data['experiment']['location'],
          this.data['experiment']['model']['id']
        )
        .subscribe(
          (metadataDetails) => {
            if (
              !isNotNullOrUndefined(metadataDetails) ||
              !isNotNullOrUndefined(metadataDetails[0]) ||
              !isNotNullOrUndefined(metadataDetails[0].startDate)
            ) {
              return;
            }
            this.formGroup.controls['time'].setValue(
              metadataDetails[0].startDate
            );
            this.pickerDisabled = true;
          },
          (error) => {
            this.snackBar.open(EXPERIMENT_DIALOG_CONSTANTS.METADATA_DETAILS_NOT_FOUND, EXPERIMENT_DIALOG_CONSTANTS.CLOSE, {
              duration: SNACK_BAR_DURATION,
            });
          }
        );
    }
  }

  private setOptions() {
    this.options = {
      floor: 0,
      ceil: 100,
      step: 1,
      translate: (value: number): string => `${value}%`,
      disabled: false,
      readOnly: false,
    };
  }

  minDates() {
    return '';
  }

  maxDates() {
    return '';
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    this.dialogRef.close(form);
  }

  discreteContinuousChangeListener($event) {
    if ($event.value === 'Discrete') {
      this.formGroup.controls.coverageStep.enable();
    } else if ($event.value === 'Continuous') {
      this.formGroup.controls.coverageStep.disable();
    }
  }
}
