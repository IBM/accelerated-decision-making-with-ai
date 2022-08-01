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

import com.ibm.pmai.models.request.JobDeploymentRequest;

public class JobDeploymentResponse {
    private String job_id;
    private String message;
    private JobDeploymentRequest request;
    private int status;

    public JobDeploymentResponse() {
    }

    public JobDeploymentResponse(String job_id, String message, JobDeploymentRequest request, int status) {
        this.job_id = job_id;
        this.message = message;
        this.request = request;
        this.status = status;
    }

    public String getJob_id() {
        return this.job_id;
    }

    public void setJob_id(String job_id) {
        this.job_id = job_id;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public JobDeploymentRequest getRequest() {
        return this.request;
    }

    public void setRequest(JobDeploymentRequest request) {
        this.request = request;
    }

    public int getStatus() {
        return this.status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
