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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Entity
@Table(name="results_request")
@ApiModel("ResultsRequest")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ResultsRequest extends Auditable<String> implements Serializable {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String requestName;
    @Column
    private String timeCreated;
    @Column
    private String timeCompleted;



    @Column
    private  boolean status;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonCustomConverter.class)
    private List<Map<String, Object>> environments;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonCustomConverter.class)
    private List<Map<String, Object>> executors;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonCustomConverter.class)
    private List<Map<String, Object>> locations;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonCustomConverter.class)
    private List<Map<String, Object>> experiments;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonCustomConverter.class)
    private List<Map<String, Object>> tasks;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonCustomConverter.class)
    private List<Map<String, Object>> customMap;


    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @Fetch(value = FetchMode.SUBSELECT)
    @JoinColumn(name="results_response_id", referencedColumnName="id")
    private List<ResultsResponse> results;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getRequestName() {
        return requestName;
    }

    public void setRequestName(String requestName) {
        this.requestName = requestName;
    }



    public String getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(String timeCreated) {
        this.timeCreated = timeCreated;
    }

    public String getTimeCompleted() {
        return timeCompleted;
    }

    public void setTimeCompleted(String timeCompleted) {
        this.timeCompleted = timeCompleted;
    }

    public List<Map<String, Object>> getCustomMap() {
        return customMap;
    }

    public void setCustomMap(List<Map<String, Object>> customMap) {
        this.customMap = customMap;
    }

    public List<ResultsResponse> getResults() {
        return results;
    }

    public void setResults(List<ResultsResponse> results) {
        this.results = results;
    }

    public List<Map<String, Object>> getTasks() {
        return tasks;
    }

    public void setTasks(List<Map<String, Object>> tasks) {
        this.tasks = tasks;
    }

    public List<Map<String, Object>> getExperiments() {
        return experiments;
    }

    public void setExperiments(List<Map<String, Object>> experiments) {
        this.experiments = experiments;
    }

    public List<Map<String, Object>> getLocations() {
        return locations;
    }

    public void setLocations(List<Map<String, Object>> locations) {
        this.locations = locations;
    }

    public List<Map<String, Object>> getExecutors() {
        return executors;
    }

    public void setExecutors(List<Map<String, Object>> executors) {
        this.executors = executors;
    }

    public List<Map<String, Object>> getEnvironments() {
        return environments;
    }

    public void setEnvironments(List<Map<String, Object>> environments) {
        this.environments = environments;
    }

}
