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
@Table(name="execution_environment_commands")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ExecutionEnvironmentCommand extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    // e.g  String templateString = " bash -c 'JOB_ID=${JOB_ID} MODEL_NAME=${MODEL_NAME} ./runModel.sh' ";
    // for docker run -it witsacza bash -c 'JOB_ID=ec373037-1724-4436-8145-7d7b1fd6d667 MODEL_NAME=witsacza ./runModel.sh'

    @Column(unique = true)
    private String environmentCommandName;

    @Column
    private String commandName;

    @Column(nullable = true,columnDefinition = "TEXT")
    private String commandTemplate;

    @Column
    private String commandEntryPoint;

    @Column
    private String commandEntryPointURIExtension;

    @Column
    private String commandContentType;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ElementCollection
    @Column(name="expected_user_input_command_inputs")
    @CollectionTable(name="expected_user_provided_inputs", joinColumns=@JoinColumn(name="id"))
    private List<String> expectedUserProvidedInputs;


    @LazyCollection(LazyCollectionOption.FALSE)
    @ElementCollection
    @Column(name="system_default_input_command_value")
    @CollectionTable(name="system_default_inputs", joinColumns=@JoinColumn(name="id"))
    private List<String> systemDefaultInputs;



    @ElementCollection(fetch = FetchType.EAGER)
    @MapKeyColumn(name="system_auto_fill_input_command_key")
    @Column(name="system_auto_fill_input_command_value")
    @CollectionTable(name="system_auto_fill_inputs", joinColumns=@JoinColumn(name="id"))
    private Map<String,String> systemAutoFillInputs;

    @Column
    private String commandSampleOutput;

    // Many or more than one execution environment command belong to one execution environment
    @JoinColumn(name = "execution_environment_id", referencedColumnName = "id", nullable = true)
    @ManyToOne(cascade = CascadeType.MERGE, targetEntity = ExecutionEnvironment.class)
    private ExecutionEnvironment executionEnvironment;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getCommandEntryPoint() {
        return commandEntryPoint;
    }

    public void setCommandEntryPoint(String commandEntryPoint) {
        this.commandEntryPoint = commandEntryPoint;
    }

    public String getCommandSampleOutput() {
        return commandSampleOutput;
    }

    public void setCommandSampleOutput(String commandSampleOutput) {
        this.commandSampleOutput = commandSampleOutput;
    }

    public ExecutionEnvironment getExecutionEnvironment() {
        return executionEnvironment;
    }

    public void setExecutionEnvironment(ExecutionEnvironment executionEnvironment) {
        this.executionEnvironment = executionEnvironment;
    }

    public String getCommandContentType() {
        return commandContentType;
    }

    public void setCommandContentType(String commandContentType) {
        this.commandContentType = commandContentType;
    }

    public String getCommandEntryPointURIExtension() {
        return commandEntryPointURIExtension;
    }

    public void setCommandEntryPointURIExtension(String commandEntryPointURIExtension) {
        this.commandEntryPointURIExtension = commandEntryPointURIExtension;
    }

    public List<String > getExpectedUserProvidedInputs() {
        return expectedUserProvidedInputs;
    }

    public void setExpectedUserProvidedInputs(List<String >  expectedUserProvidedInputs) {
        this.expectedUserProvidedInputs = expectedUserProvidedInputs;
    }

    public String getCommandTemplate() {
        return commandTemplate;
    }

    public void setCommandTemplate(String commandTemplate) {
        this.commandTemplate = commandTemplate;
    }


    public void setCommandName(String commandName) {
        this.commandName = commandName;
    }

    public String getCommandName() {
        return  commandName;
    }

    public void setSystemAutoFillInputs(Map<String, String> systemAutoFillInputs) {
        this.systemAutoFillInputs = systemAutoFillInputs;
    }

    public Map<String, String> getSystemAutoFillInputs() {
        return  systemAutoFillInputs;
    }

    public void setSystemDefaultInputs(List<String> systemDefaultInputs) {
        this.systemDefaultInputs = systemDefaultInputs;
    }


    public String getEnvironmentCommandName() {
        return environmentCommandName;
    }

    public void setEnvironmentCommandName(String environmentCommandName) {
        this.environmentCommandName = environmentCommandName;
    }
}
