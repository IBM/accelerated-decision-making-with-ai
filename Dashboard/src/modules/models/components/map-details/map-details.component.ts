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
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import {
  ApiService,
  DataService,
  UserService,
} from '../../../common/services';
import { LocationDialogService } from '../../services/location-dialog/location-dialog.service';
import { ModelMetadata, User } from 'src/modules/common/models';
import { SNACK_BAR_DURATION } from 'src/modules/common/constants';
import { MAP_DETAILS_CONSTANTS } from '../../constants/models.constants';

@Component({
  selector: 'app-map-details',
  templateUrl: './map-details.component.html',
  styleUrls: ['./map-details.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, transform: 'translateX(-50%)' })),
      state('hidden', style({ opacity: 0, transform: 'translateX(0)' })),
      transition('* => *', animate('.5s')),
    ]),
  ],
})
export class MapDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isVisible = true;
  @Output() closeDetail = new EventEmitter<boolean>();
  @Output() handleMapDetails = new EventEmitter<any>();
  visibility = 'shown';
  private subscribeModelMetadata: any;
  modelMetadata: ModelMetadata;
  private subscribeLocationDialogService: any;
  user: Observable<User>;

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private locationDialogService: LocationDialogService,
    private userService: UserService
  ) {
    this.user = this.userService.getCurrentUser();
  }

  ngOnInit() {
    this.subscribeModelMetadata =
      this.dataService.metadataSourceObservable.subscribe(
        (data) => {
          if (!isNotNullOrUndefined(data)) {
            return;
          }
          this.modelMetadata = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnChanges() {
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  ngOnDestroy(): void {
    if (this.subscribeLocationDialogService) {
      this.subscribeLocationDialogService.unsubscribe();
    }
  }

  close() {
    this.closeDetail.emit(true);
  }

  addEditLocation(modelMetadata) {
    this.subscribeLocationDialogService = this.locationDialogService
      .openDialog('location', modelMetadata)
      .subscribe(
        (location) => {
          if (
            !isNotNullOrUndefined(location) ||
            !isNotNullOrUndefined(location['names'])
          ) {
            return;
          }
          location['adminLevel'] = modelMetadata['admin_level'] + '';
          location['adminLevelList'] = modelMetadata['adminLevelList'];
          this.modelMetadata.generalLocation = location;
          this.handleMapDetails.emit(location);
        },
        (error) => {
          console.log(error);
          this.snackBar.open(MAP_DETAILS_CONSTANTS.LOCATION_UPDATE_FAILED, MAP_DETAILS_CONSTANTS.CLOSE, {
            duration: SNACK_BAR_DURATION,
          });
        }
      );
  }

  addModelData(modelMetadata) {
    console.log(modelMetadata);
    const verifyDataModel = {
      location_id: modelMetadata.generalLocation.id,
      model_id: modelMetadata.modelId,
      location_name: modelMetadata.generalLocation.names,
      data_verification: true,
      iso2code: modelMetadata.generalLocation.country.slice(0, -1)
    }
    this.handleMapDetails.emit(verifyDataModel);
  }

  viewResults(modelMetadata) {
    this.router.navigate(['/results'], {
      queryParams: {
        locationId: '' + modelMetadata.location.id,
        modelId: '' + modelMetadata.modelId,
      },
    });
  }

  startExperiment(modelMetadata) {
    this.router.navigate(['/experiments'], {
      queryParams: {
        locationId: '' + modelMetadata.location.id,
        modelId: '' + modelMetadata.modelId,
      },
    });
  }
}
