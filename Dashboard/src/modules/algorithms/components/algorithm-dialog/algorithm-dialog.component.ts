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

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { Algorithms } from '../../../common';
import { AlgorithmDialogService } from '../../services';

@Component({
  selector: 'app-algorithm-dialog',
  templateUrl: './algorithm-dialog.component.html',
  styleUrls: ['./algorithm-dialog.component.scss'],
})
export class AlgorithmDialogComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean;
  private id: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AlgorithmDialogService>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setupForm();
    if (isNotNullOrUndefined(this.data.algorithm)) {
      this.loadAlgorithmData(this.data.algorithm);
    }
  }

  minDates() {
    return '';
  }

  maxDates() {
    return '';
  }

  onSubmit(algorithm: FormGroup) {
    this.submitted = true;
    algorithm['id'] = this.id;
    this.dialogRef.close(algorithm);
  }

  private setupForm() {
    this.formGroup = this.formBuilder.group({
      uri: ['', [Validators.required]],
      title: ['', [Validators.required]],
      name: ['', [Validators.required]],
      version: ['', [Validators.required]],
      versionDate: ['', [Validators.required]],
      versionAuthor: ['', [Validators.required]],
      githubLink: ['', [Validators.required]],
      requirements: [''],
    });
  }

  private loadAlgorithmData(algorithm: Algorithms) {
    this.formGroup.controls['uri'].setValue(algorithm.uri);
    this.formGroup.controls['title'].setValue(algorithm.title);
    this.formGroup.controls['name'].setValue(algorithm.name);
    this.formGroup.controls['version'].setValue(algorithm.version);
    this.formGroup.controls['versionDate'].setValue(algorithm.versionDate);
    this.formGroup.controls['versionAuthor'].setValue(algorithm.versionAuthor);
    this.formGroup.controls['githubLink'].setValue(algorithm.githubLink);
    this.formGroup.controls['requirements'].setValue(algorithm.requirements);
    if (isNotNullOrUndefined(algorithm.id)) {
      this.id = algorithm.id;
    }
  }
}
