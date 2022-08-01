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
@Table(name="task")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Task extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String name;

    @Schema(hidden = true)
    @Column
    private String type;

    @Schema(hidden = true)
    // An task can have more than one state e.g. started, completed etc
    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name="task_state_id", referencedColumnName="id")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TaskStates> taskStates;

    @Schema(hidden = true)
    @Column
    private int workProgress;

    @Column
    private String description;

    @Schema(hidden = true)
    @Column
    private String taskHash;

    @Schema(hidden = true)
    @Column
    private String nullActionHash;

    @JoinColumn(name = "location_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = Location.class,fetch = FetchType.LAZY)
    private Location location;

    @JoinColumn(name = "location_data_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = LocationData.class,fetch = FetchType.EAGER)
    private LocationData locationData;

    // Many or more than one task belong to one user
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = true)
    @ManyToOne(cascade = CascadeType.MERGE, targetEntity = User.class,fetch = FetchType.LAZY)
    private User user;

    // A task will have one input for now --> Second input to the model
    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name="task_input_id", referencedColumnName="id")
    private TaskInput taskInputs;

    @JoinColumn(name = "executor_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = Executor.class,fetch = FetchType.LAZY)
    private Executor executor;

    @JoinColumn(name = "data_repository_configuration_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = DataRepositoryConfiguration.class,fetch = FetchType.LAZY)
    private DataRepositoryConfiguration dataRepositoryConfiguration;

    // An task can have more than post executors e.g. reward functions
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name="selected_post_executor_id", referencedColumnName="id")
    private List<Executor> selectedPostExecutor;

    @Column(name="experiment_id")
    private String experimentId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public Executor getExecutor() {
        return executor;
    }

    public void setExecutor(Executor executor) {
        this.executor = executor;
    }

    public TaskInput getTaskInputs() {
        return taskInputs;
    }

    public void setTaskInputs(TaskInput taskInputs) {
        this.taskInputs = taskInputs;
    }

    public void setTaskHash(String taskHash) {
        this.taskHash = taskHash;
    }

    public String getTaskHash() {
        return taskHash;
    }

    public String getNullActionHash() {
        return nullActionHash;
    }

    public void setNullActionHash(String nullActionHash) {
        this.nullActionHash = nullActionHash;
    }

    public void setTaskStates(List<TaskStates> taskStates) {
        this.taskStates = taskStates;
    }

    public List<TaskStates> getTaskStates(){
        return taskStates;
    }

    public List<Executor> getSelectedPostExecutor() {
        return selectedPostExecutor;
    }

    public void setSelectedPostExecutor(List<Executor> selectedPostExecutor) {
        this.selectedPostExecutor = selectedPostExecutor;
    }

    public void setWorkProgress(int workProgress) {
        this.workProgress = workProgress;
    }

    public int getWorkProgress() {
        return workProgress;
    }

    public DataRepositoryConfiguration getDataRepositoryConfiguration() {
        return dataRepositoryConfiguration;
    }

    public void setDataRepositoryConfiguration(DataRepositoryConfiguration dataRepositoryConfiguration) {
        this.dataRepositoryConfiguration = dataRepositoryConfiguration;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public LocationData getLocationData() {
        return locationData;
    }

    public void setLocationData(LocationData locationData) {
        this.locationData = locationData;
    }

    public String getExperimentId() {
        return experimentId;
    }

    public void setExperimentId(String experimentId) {
        this.experimentId = experimentId;
    }
}
