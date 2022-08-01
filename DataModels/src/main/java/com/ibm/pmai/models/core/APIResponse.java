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

package com.ibm.pmai.models.core;

import org.springframework.http.HttpStatus;

/**
 * @author charleswachira on 29/03/2019
 * @project Ungana-Models
 **/
public class APIResponse<T> extends BaseModel {
    private String message;
    private int status;
    private boolean success;
    private T data;

    public APIResponse(String message, int status, boolean success, T data) {
        this.message = message;
        this.status = status;
        this.success = success;
        this.data = data;
    }

    public APIResponse() {
    }

    public APIResponse(String message, HttpStatus status, T data) {
        this.setData(data);
        this.setMessage(message);

        if(status.value() >= 200 && status.value()< 300)
            this.setSuccess(true);
        else
            this.setSuccess(false);
        this.setStatus(status.value());
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
