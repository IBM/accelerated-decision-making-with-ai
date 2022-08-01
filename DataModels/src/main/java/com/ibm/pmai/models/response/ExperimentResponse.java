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

package com.ibm.pmai.models.response;

import com.ibm.pmai.models.core.Algorithm;
import com.ibm.pmai.models.core.Experiment;
import com.ibm.pmai.models.core.Location;
import com.ibm.pmai.models.core.MetadataDetails;

/**
 * @author charleswachira on 22/05/2019
 * @project Ungana-Models
 **/
public class ExperimentResponse extends Experiment {
    private MetadataDetails metadataDetails;
    private Algorithm algorithm;

    public ExperimentResponse(Experiment e) {
        super(e.getId(), e.getJobId(), e.getUserId(), e.getTimestamp(), e.isStatus(),
                e.getLocation().getId(), e.getAlgorithmId(), e.getResolution(), e.getActionRangeList());
    }

    public ExperimentResponse() {
    }

    public Algorithm getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(Algorithm algorithm) {
        this.algorithm = algorithm;
    }

    public MetadataDetails getMetadataDetails() {
        return metadataDetails;
    }

    public void setMetadataDetails(MetadataDetails metadataDetails) {
        this.metadataDetails = metadataDetails;
    }
}
