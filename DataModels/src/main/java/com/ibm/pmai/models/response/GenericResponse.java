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

/**
 * @author charleswachira on 31/03/2019
 * @project Ungana-Models
 **/

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.ibm.pmai.models.core.BaseModel;

import java.util.List;

/**
 * This is used to return all the requests to the calling services/components
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GenericResponse extends BaseModel {

    /**
     * Variable declarations
     */
    private String message;
    private Boolean status;
    private int statusCode;
    private String jobId;
    private JsonNode data;

    public JsonNode getJsonNode() {
        return jsonNode;
    }

    public void setJsonNode(JsonNode jsonNode) {
        this.jsonNode = jsonNode;
    }

    private JsonNode jsonNode;
    private List<JsonNode> jsonNodeList;

    /**
     * Empty Constructor
     */
    public GenericResponse() {
    }

    /**
     * Constructor that takes in some of the variables and assigns them
     * @param message
     * @param status
     * @param statusCode
     */
    public GenericResponse(String message, Boolean status, int statusCode) {
        this.message = message;
        this.status = status;
        this.statusCode = statusCode;
    }

    /**
     * Message to be returned
     * @return
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the message
     * @param message
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Returns the status
     * @return
     */
    public Boolean getStatus() {
        return status;
    }

    /**
     * Sets request status
     * @param status
     */
    public void setStatus(Boolean status) {
        this.status = status;
    }

    /**
     * Returns request status code
     * @return
     */
    public int getStatusCode() {
        return statusCode;
    }

    /**
     * Set request status code
     * @param statusCode
     */
    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    /**
     * Returns a list of object
     * @return
     */
    public List<JsonNode> getJsonNodeList() {
        return jsonNodeList;
    }

    /**
     * This is a generic object that takes in any object that other services have requested
     * @return
     */
    public void setJsonNodeList(List<JsonNode> jsonNodeList) {
        this.jsonNodeList = jsonNodeList;
    }

    /**
     * Returns json node object that is used to store generic objects
     * @return
     */
    public JsonNode getData() {
        return data;
    }

    /**
     * Sets objects to json node that can be returned to the users
     * @param data
     */
    public void setData(JsonNode data) {
        this.data = data;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }
}

