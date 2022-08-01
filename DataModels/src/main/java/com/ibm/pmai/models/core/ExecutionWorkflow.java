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
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Entity
@Table(name="execution_workflow")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ExecutionWorkflow extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String name;

    @Column
    private String description;

    @ElementCollection
    @MapKeyColumn(name="workflow_index_key")
    @Column(name="workflow_task_value")
    @CollectionTable(name="workflow_task_execution_flow", joinColumns=@JoinColumn(name="id"))
    private Map<Integer,Task> workFlowTasks;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name="workflow_task_id", referencedColumnName="id")
    private List<Task> workflowTask;

    @Schema(hidden = true)
    // An task can have more than one state e.g. started, completed etc
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="workflow_state_id", referencedColumnName="id")
    private List<TaskStates> workflowStates;

    @Schema(hidden = true)
    @Column(nullable = true)
    private int workProgress;

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


    public void setWorkFlowTasks(Map<Integer, Task> workFlowTasks) {
        this.workFlowTasks = workFlowTasks;
    }

    public Map<Integer, Task> getWorkFlowTasks() {
         return this.workFlowTasks;
    }

    @JoinColumn(name = "executionWorkflowTemplate_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = ExecutionWorkflowTemplate.class)
    private ExecutionWorkflowTemplate executionWorkflowTemplate;

    @JoinColumn(name = "submissionWorkflowTemplate_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = ExecutionWorkflowTemplate.class)
    private ExecutionWorkflowTemplate submissionWorkflowTemplate;

    public List<Task> getWorkflowTask() {
        return workflowTask;
    }

    public void setWorkflowTask(List<Task> workflowTask) {
        this.workflowTask = workflowTask;
    }

    public List<TaskStates> getWorkflowStates() {
        return workflowStates;
    }

    public void setWorkflowStates(List<TaskStates> workflowStates) {
        this.workflowStates = workflowStates;
    }

    public void setWorkProgress(int workProgress) {
        this.workProgress = workProgress;
    }

    public int getWorkProgress() {
        return workProgress;
    }

    public ExecutionWorkflowTemplate getExecutionWorkflowTemplate() {
        return executionWorkflowTemplate;
    }

    public void setExecutionWorkflowTemplate(ExecutionWorkflowTemplate executionWorkflowTemplate) {
        this.executionWorkflowTemplate = executionWorkflowTemplate;
    }

    public ExecutionWorkflowTemplate getSubmissionWorkflowTemplate() {
        return submissionWorkflowTemplate;
    }

    public void setSubmissionWorkflowTemplate(ExecutionWorkflowTemplate submissionWorkflowTemplate) {
        this.submissionWorkflowTemplate = submissionWorkflowTemplate;
    }
}
