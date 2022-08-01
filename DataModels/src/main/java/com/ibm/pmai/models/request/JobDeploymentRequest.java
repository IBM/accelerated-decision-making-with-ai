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

package com.ibm.pmai.models.request;

import java.io.Serializable;
import java.util.HashMap;

import com.ibm.pmai.models.core.Auditable;

public class JobDeploymentRequest extends Auditable<String> implements Serializable {
    private String type;
    private HashMap<String, String> args;

    public JobDeploymentRequest() {
    }

    public JobDeploymentRequest(String type, HashMap<String, String> args) {
        this.type = type;
        this.args = args;
    }

    public String getType() {
            return type;
        }

    public void setType(String type) {
        this.type = type;
    }

    public HashMap<String, String> getArgs() {
        return args;
    }

    public void setArgs(HashMap<String, String> args) {
        this.args = args;
    }
}
