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

import java.util.List;

public class JobDeploymentServiceStatusResponse {
    private List<String> message;
    private List<String> state;
    private List<Integer> status;

    public JobDeploymentServiceStatusResponse() {
    }

    public JobDeploymentServiceStatusResponse(List<String> message, List<String> state, List<Integer> status) {
        this.message = message;
        this.state = state;
        this.status = status;
    }

    public List<String> getMessage() {
        return this.message;
    }

    public void setMessage(List<String> message) {
        this.message = message;
    }

    public List<String> getState() {
        return this.state;
    }

    public void setState(List<String> state) {
        this.state = state;
    }

    public List<Integer> getStatus() {
        return this.status;
    }

    public void setStatus(List<Integer> status) {
        this.status = status;
    }
}
