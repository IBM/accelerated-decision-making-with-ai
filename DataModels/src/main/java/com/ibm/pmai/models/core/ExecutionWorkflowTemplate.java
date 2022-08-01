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
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Entity
@Table(name="execution_workflow_templates")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ExecutionWorkflowTemplate extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String workflowTemplateName;

    @Column(columnDefinition = "TEXT")
    private String workflowTemplate;

    @Column
    private String workflowTemplateContentType;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ElementCollection
    @Column(name="expected_user_input_workflow_template_inputs")
    @CollectionTable(name="expected_user_provided_workflow_template_inputs", joinColumns=@JoinColumn(name="id"))
    private List<String> expectedUserProvidedWorkflowTemplateInputs;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ElementCollection
    @Column(name="system_default_input_workflow_template_value")
    @CollectionTable(name="system_default_workflow_template_inputs", joinColumns=@JoinColumn(name="id"))
    private List<String> systemDefaultWorkflowTemplateInputs;

    @ElementCollection(fetch = FetchType.EAGER)
    @MapKeyColumn(name="system_auto_fill_workflow_template_input_key")
    @Column(name="system_auto_fill_workflow_template_input_value")
    @CollectionTable(name="system_auto_fill_workflow_template_inputs", joinColumns=@JoinColumn(name="id"))
    private Map<String,String> systemAutoFillWorkflowTemplateInputs;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public Map<String, String> getSystemAutoFillWorkflowTemplateInputs() {
        return systemAutoFillWorkflowTemplateInputs;
    }

    public void setSystemAutoFillWorkflowTemplateInputs(Map<String, String> systemAutoFillWorkflowTemplateInputs) {
        this.systemAutoFillWorkflowTemplateInputs = systemAutoFillWorkflowTemplateInputs;
    }

    public List<String> getSystemDefaultWorkflowTemplateInputs() {
        return systemDefaultWorkflowTemplateInputs;
    }

    public void setSystemDefaultWorkflowTemplateInputs(List<String> systemDefaultWorkflowTemplateInputs) {
        this.systemDefaultWorkflowTemplateInputs = systemDefaultWorkflowTemplateInputs;
    }

    public List<String> getExpectedUserProvidedWorkflowTemplateInputs() {
        return expectedUserProvidedWorkflowTemplateInputs;
    }

    public void setExpectedUserProvidedWorkflowTemplateInputs(List<String> expectedUserProvidedWorkflowTemplateInputs) {
        this.expectedUserProvidedWorkflowTemplateInputs = expectedUserProvidedWorkflowTemplateInputs;
    }

    public String getWorkflowTemplateContentType() {
        return workflowTemplateContentType;
    }

    public void setWorkflowTemplateContentType(String workflowTemplateContentType) {
        this.workflowTemplateContentType = workflowTemplateContentType;
    }

    public String getWorkflowTemplate() {
        return workflowTemplate;
    }

    public void setWorkflowTemplate(String workflowTemplate) {
        this.workflowTemplate = workflowTemplate;
    }

    public String getWorkflowTemplateName() {
        return workflowTemplateName;
    }

    public void setWorkflowTemplateName(String workflowTemplateName) {
        this.workflowTemplateName = workflowTemplateName;
    }
}
