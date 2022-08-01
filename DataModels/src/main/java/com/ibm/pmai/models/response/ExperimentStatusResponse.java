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

public class ExperimentStatusResponse {
    private boolean status;
    private JobDeploymentServiceStatusResponse job;

    public ExperimentStatusResponse() {
    }

    public ExperimentStatusResponse(boolean status, JobDeploymentServiceStatusResponse job) {
        this.status = status;
        this.job = job;
    }

    public boolean isStatus() {
        return this.status;
    }

    public boolean getStatus() {
        return this.status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public JobDeploymentServiceStatusResponse getJob() {
        return this.job;
    }

    public void setJob(JobDeploymentServiceStatusResponse job) {
        this.job = job;
    }
}
