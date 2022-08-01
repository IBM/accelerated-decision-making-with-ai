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
import { ModelMetadata } from '../../../common/models';
import { LocationDialogService } from '../../services/location-dialog/location-dialog.service';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss'],
})
export class LocationDialogComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean;
  private id: string;
  dataFileSelected: boolean;
  private selectedFile: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LocationDialogService>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setupForm();
    if (this.data.type === 'location') {
      this.loadLocationData(this.data.modelMetadata);
    }
  }

  /**
   * submit the model
   */
  onSubmit(location: FormGroup) {
    this.submitted = true;
    location['id'] = this.id;
    if (this.data.type === 'location') {
      this.dialogRef.close(location);
    } else if (this.data.type === 'dataRepositoryConfiguration') {
      const formData = new FormData();
      formData.append('file', this.formGroup.get('fileBytesStream').value);
      location['fileBytesStream'] = formData;
    }
    this.dialogRef.close(location);
  }

  /**
   * setup the model form
   */
  private setupForm() {
    if (this.data.type === 'location') {
      this.formGroup = this.formBuilder.group({
        names: ['', [Validators.required]],
        adminType: ['', [Validators.required]],
        locatedIn: ['', [Validators.required]],
        country: ['', [Validators.required]],
      });
    } else if (this.data.type === 'dataRepositoryConfiguration') {
      this.formGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        fileBytesStream: ['', [Validators.required]],
      });
    }
  }

  private loadLocationData(modelMetadata: ModelMetadata) {
    if (!isNotNullOrUndefined(modelMetadata.location)) {
      this.formGroup.controls['names'].setValue(modelMetadata.name);
      this.formGroup.controls['adminType'].setValue(modelMetadata.admin_type);
      this.formGroup.controls['locatedIn'].setValue(modelMetadata.located_in);
      this.formGroup.controls['country'].setValue(modelMetadata.country);
    } else {
      if (isNotNullOrUndefined(modelMetadata.location.id)) {
        this.id = modelMetadata.location.id;
      }
      this.formGroup.controls['names'].setValue(modelMetadata.location.names);
      this.formGroup.controls['adminType'].setValue(
        modelMetadata.location.adminType
      );
      this.formGroup.controls['locatedIn'].setValue(
        modelMetadata.location.locatedIn
      );
      this.formGroup.controls['country'].setValue(
        modelMetadata.location.country
      );
    }
  }

  fileChanged(event) {
    this.dataFileSelected = true;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // this.formGroup.controls['fileBytesStream'].setValue(file);
      this.formGroup.get('fileBytesStream').setValue(file);
    }
  }

  private getFileData(location: FormGroup) {
    const numberOfFilesSelected = this.selectedFile.length;
    for (let i = 0; i < numberOfFilesSelected; i += 1) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        location['fileBytesStream'] = e.target['result'];

        if (i === numberOfFilesSelected - 1) {
          this.dialogRef.close(location);
        }
      };
      fileReader.readAsDataURL(this.selectedFile[i]);
    }
  }
}
