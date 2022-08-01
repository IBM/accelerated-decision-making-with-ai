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

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;

/**
 * @author charleswachira on 29/03/2019
 * @project Ungana-Models
 **/
@Entity
@Table(name="action_request")
@ApiModel("ActionRequest")
public class ActionRequest extends Auditable<String> implements Serializable {
    @Ignore
    @Id
    @ApiModelProperty(hidden = true)
    public String _id;
    @ApiModelProperty(hidden = true)
    @Transient
    public String _rev;
    @ApiModelProperty(hidden = true)
    @Transient
    @Column(name = "resource_type")
    private String resourceType;

    @Column(name = "job_seeds")
    private HashMap<String, String> jobSeeds;
    @Column(name = "user_id")
    private String userId;

    @Column(name = "scenario_id")
    private String scenarioId;
    private String resolution;
    @Column(name = "experiment_id")
    private String experimentId;

    @Column
    private long timestamp;
  
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(targetEntity = Action.class, cascade = CascadeType.ALL)
    @JoinTable(name = "action_request_action",
            joinColumns = {@JoinColumn(name = "action_request__id")},
            inverseJoinColumns = {@JoinColumn(name = "actions__id")}
            )
    private List<Action> actions;

    @JsonIgnore
    @Column(name = "action_hash")
    private String actionHash;

    public ActionRequest(){this.resourceType = "ACTIONREQUEST";}

    @ApiModelProperty(hidden = true)
    public String getResourceType() {
        return resourceType;
    }

    public List <Action> getActions() {
        return actions;
    }

    public void setActions(List <Action> actions) {
        this.actions = actions;
    }

    @ApiModelProperty(hidden = true)
    public long getTimestamp() {
        return timestamp;
    }

    @ApiModelProperty(hidden = true)
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getScenarioId() {
        return scenarioId;
    }

    public void setScenarioId(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public String getExperimentId() {
        return experimentId;
    }

    public void setExperimentId(String experimentId) {
        this.experimentId = experimentId;
    }

    @ApiModelProperty(hidden = true)
    public String getActionHash() {
        return actionHash;
    }

    @ApiModelProperty(hidden = true)
    public void setActionHash(String actionHash) {
        this.actionHash = actionHash;
    }

    @ApiModelProperty(hidden = true)
    public HashMap<String, String> getJobSeeds() {
        return jobSeeds;
    }

    @ApiModelProperty(hidden = true)
    public void setJobSeeds(HashMap<String, String> jobSeeds) {
        this.jobSeeds = jobSeeds;
    }

    @ApiModelProperty(hidden = true)
    public void addJobSeed(String seed, String jobID){
        this.jobSeeds.put(seed, jobID);
    }
}
