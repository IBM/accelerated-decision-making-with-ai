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

import { $ } from "protractor";

export const MAP_DETAILS_CONSTANTS = {
    LOCATION_UPDATE_FAILED: $localize`:@@map.details.location.not.found:Entered Location update failed`,
    CLOSE:$localize`:@@close:Close`,
};
  
export const MODELS_CONSTANTS = {
    MODELS_NOT_FOUND: $localize`:@@models.not.found:Could not find models : `,
    MODEL_CREATION_SUCCESSFUL: $localize`:@@model.creation.successful:Model Creation Successful: `,
    MODEL_CREATION_FAILED: $localize`:@@model.creation.failed:Could not create model!: `,
    MODEL_UPDATE_SUCCESSFUL: $localize`:@@model.update.successful:Model Update Successful: `,
    MODEL_UPDATE_FAILED: $localize`:@@model.update.failed:Could not update model!: `,
    ENTERED_MODEL_UPDATE_FAILED: $localize`:@@model.entered.update.failed:Entered Model update failed`,
    MODEL_STATUS_PROVISIONED: $localize`:@@model.status.provisioned:Provisioned`,
    MODEL_STATUS_PROVISIONING: $localize`:@@model.status.provisioning:Provisioning`,

    REWARD_FUNCTION_CREATION_SUCCESSFUL: $localize`:@@model.reward.creation.successful:Reward function Creation Successful: `,
    REWARD_FUNCTION_CREATION_FAILED: $localize`:@@model.reward.creation.failed:Could not create reward function!: `,
    REWARD_FUNCTION_UPDATE_SUCCESSFUL: $localize`:@@model.reward.update.successful:Reward function Update Successful: `,
    REWARD_FUNCTION_UPDATE_FAILED: $localize`:@@model.reward.update.failed:Could not update reward function!: `,
    ENTERED_REWARD_FUNCTION_UPDATE_FAILED: $localize`:@@model.entered.reward.update.failed:Entered reward function update failed`,

    ADMIN_LEVEL: $localize`:@@admin.level:Admin level `,
    DATA_EXISTS_FOR: $localize`:@@data.exists.for: data exists for `,
    WOULD_YOU_LIKE_TO_LOAD_THIS_DATA:$localize`:@@would.you.like.to.load.this.data:Would you like to load this data?`,

    LOCATION_CREATION_SUCCESSFUL: $localize`:@@model.location.creation.successful:Location Creation Successful: `,
    LOCATION_CREATION_FAILED: $localize`:@@model.location.creation.failed:Could not create location!: `,
    LOCATION_UPDATE_SUCCESSFUL: $localize`:@@model.location.update.successful:Location Update Successful: `,
    LOCATION_UPDATE_FAILED: $localize`:@@model.location.update.failed:Could not update location!: `,
    LOCATION_DATA_VERIFICATION_FAILED_MISSING_LOC_ID:$localize`:@@model.location.data.verification.failed.missing.loc.id:Location data verification failed due to missing location Id`,
    LOCATION_DATA_VERIFICATION_SUCCESSFUL: $localize`:@@location.data.verification.successful:Location Data Verification Successful: `,
    LOCATION_DATA_VERIFICATION_FAILED: $localize`:@@location.data.verification.failed:Could not verify location data!: `,

    CLOSE:$localize`:@@close:Close`,
};
