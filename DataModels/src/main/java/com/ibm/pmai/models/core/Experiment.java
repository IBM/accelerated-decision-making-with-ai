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
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="experiment")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Experiment extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String name;

    @Column(name="user_id")
    private String userId;

    @Column(nullable = true)
    private long timestamp;

    @Column
    private boolean status;

    @Schema(hidden = true)
    @Column
    private String experimentHash;

    @Column(columnDefinition = "TEXT")
    private String data;

    @Column(name="algorithm_id")
    private String algorithmId;

    @Column(nullable = true)
    private String resolution;

    @Column(name="scenario_id",nullable = true)
    private String scenarioId;

    @Column(name = "job_id",nullable = true)
    private String jobId;

    @Column(nullable = true)
    private String description;

    @Column(nullable = true)
    private String experimentType;

    @Column(nullable = true)
    private String generationType;

    public Experiment(){}
    public Experiment(String _id, String jobId, String userId, long timestamp,
                      boolean status, String scenarioId, String algorithmId, String resolution,
                      List<com.ibm.pmai.models.core.ActionRange> actionRangeList) {
        this.jobId = jobId;
        this.userId = userId;
        this.timestamp = timestamp;
        this.status = status;
        this.scenarioId = scenarioId;
        this.algorithmId = algorithmId;
        this.resolution = resolution;
        this.actionRangeList = actionRangeList;
    }

    @JoinColumn(name = "location_id", referencedColumnName = "id")
    private Location location;


    @JoinColumn(name = "executor_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = Executor.class,fetch = FetchType.LAZY)
    private Executor executor;

    @OneToMany(targetEntity = ActionRange.class, cascade = CascadeType.ALL)
    @JoinTable(name = "experiment_action_range_list",
            joinColumns = {@JoinColumn(name = "experiment__id")},
            inverseJoinColumns = {@JoinColumn(name = "action_range_list__id")}
    )
    private List<ActionRange> actionRangeList;

    // An task can have more than post executors e.g. reward functions
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name="selected_experimeent_post_executor_id", referencedColumnName="id")
    private List<Executor> selectedPostExecutor;

    // An experiment can have more than one task
    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name="experiment_task_id", referencedColumnName="id")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Task> tasks;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getGenerationType() {
        return generationType;
    }

    public void setGenerationType(String generationType) {
        this.generationType = generationType;
    }

    public String getExperimentType() {
        return experimentType;
    }

    public void setExperimentType(String experimentType) {
        this.experimentType = experimentType;
    }

    public List<ActionRange> getActionRangeList() {
        return actionRangeList;
    }

    public void setActionRangeList(List<ActionRange> actionRangeList) {
        this.actionRangeList = actionRangeList;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getAlgorithmId() {
        return algorithmId;
    }

    public void setAlgorithmId(String algorithmId) {
        this.algorithmId = algorithmId;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public String getJobId() {
        return this.jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getScenarioId() {
        return scenarioId;
    }

    public void setScenarioId(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    public Executor getExecutor() {
        return executor;
    }

    public void setExecutor(Executor executor) {
        this.executor = executor;
    }

    public List<Executor> getSelectedPostExecutor() {
        return selectedPostExecutor;
    }

    public void setSelectedPostExecutor(List<Executor> selectedPostExecutor) {
        this.selectedPostExecutor = selectedPostExecutor;
    }

    public boolean getStatus() {
        return this.status;
    }


    public String getExperimentHash() {
        return this.experimentHash;
    }

    public void setExperimentHash(String experimentHash) {
        this.experimentHash = experimentHash;
    }

    public String getData() {
        return this.data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
