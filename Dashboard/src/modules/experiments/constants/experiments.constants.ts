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
export const EXPERIMENTS_CONSTANTS = {
  EXPERIMENT_TYPES: {
    PREDICTION: $localize`:@@experimentPrediction:Prediction`,
    CALIBRATION: $localize`:@@experimentCalibration:Calibration`,
  },
  TASKS: {
    SINGLE: $localize`:@@calibrationTaskSingle:Single`,
    MULTIPLE: $localize`:@@calibrationTaskMultiple:Multiple`,
    CONTINUOUS: $localize`:@@calibrationTaskContinuous:Continuous`,
  },
  ACTION_MISSING_IN: $localize`:@@calibrationActionMissing:Actions missing in `,
  MODEL: $localize`:@@modelEndOfStatement:model.`,
  CONSULT_THE__SYSTEM_ADMIN: $localize`:@@consultTheSystemAdmin: Consult the system admin!`,
  CLOSE:$localize`:@@close:Close`,
  ACTION_UPDATE_FAILED: $localize`:@@calibrationActionUpdatedFailed:Entered actions update failed`,
  MODELS_NOT_FOUND: $localize`:@@calibrationModelsNotFound:Could not find models : `,
  LOCATION_NOT_FOUND: $localize`:@@calibrationLocationNotFound:Could not find location : `,
  EXPERIMENT_CREATION_SUCCESSFUL: $localize`:@@calibrationExperimentCreationSuccessful:Experiment Creation Successful: `,
  EXPERIMENT_CREATION_FAILED: $localize`:@@calibrationExperimentCreationFailed:Experiment Creation Failed: `,
  SIMILAR_EXPERIMENT_CONFIRMATION: $localize`:@@calibrationSimilarExperimentConfirmation:A similar experiment for this location and environment has been returned,\ncheck the list of duplicate experiments to view the content.\nWould you like to override this and perform a new experiment?`,
  DATE: $localize`:@@date:Date: `,
  DATES: $localize`:@@dates:Dates: `,
  DATES_DASH: $localize`:@@datesAndDash:Dates: - `
};

export const EXPERIMENT_DIALOG_CONSTANTS = {
  METADATA_DETAILS_NOT_FOUND: $localize`:@@experimentMetadataDetailsNotFound:Metadata details fetch failed`,
  CLOSE:$localize`:@@close:Close`,
};

