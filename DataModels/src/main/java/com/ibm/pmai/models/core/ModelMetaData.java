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

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModel;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name="model_meta_data")
@ApiModel("ModelMetaData")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ModelMetaData extends BaseModel {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column(unique = true)
    private String model_name;

    @Column
    private String model_version;

    @Column
    private String version_date;

    @Column
    private String version_author;

    @Column
    private String model_code_github;

    @Column
    private String executable_type;

    @Column
    private String model_variables;

    @Column
    private String model_run_command;

    @Column
    private boolean onboarded;

    private String executor_id;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(targetEntity = ModelInput.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "model_meta_data_id")
    private List<ModelInput> model_input;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(targetEntity = ModelOutput.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "model_meta_data_id")
    private List<ModelOutput> model_output;

    public String getModel_name() {
        return model_name;
    }

    public void setModel_name(String model_name) {
        this.model_name = model_name;
    }

    public String getModel_version() {
        return model_version;
    }

    public void setModel_version(String model_version) {
        this.model_version = model_version;
    }

    public String getVersion_date() {
        return version_date;
    }

    public void setVersion_date(String version_date) {
        this.version_date = version_date;
    }

    public String getVersion_author() {
        return version_author;
    }

    public void setVersion_author(String version_author) {
        this.version_author = version_author;
    }

    public String getModel_code_github() {
        return model_code_github;
    }

    public void setModel_code_github(String model_code_github) {
        this.model_code_github = model_code_github;
    }

    public String getExecutable_type() {
        return executable_type;
    }

    public void setExecutable_type(String executable_type) {
        this.executable_type = executable_type;
    }

    public String getModel_variables() {
        return model_variables;
    }

    public void setModel_variables(String model_variables) {
        this.model_variables = model_variables;
    }

    public String getModel_run_command() {
        return model_run_command;
    }

    public void setModel_run_command(String model_run_command) {
        this.model_run_command = model_run_command;
    }

    public List<ModelInput> getModel_input() {
        return model_input;
    }

    public void setModel_input(List<ModelInput> model_input) {
        this.model_input = model_input;
    }

    public List<ModelOutput> getModel_output() {
        return model_output;
    }

    public void setModel_output(List<ModelOutput> model_output) {
        this.model_output = model_output;
    }

    public boolean isOnboarded() {
        return onboarded;
    }

    public void setOnboarded(boolean onboarded) {
        this.onboarded = onboarded;
    }

    public String getExecutor_id() {
        return executor_id;
    }

    public void setExecutor_id(String executor_id) {
        this.executor_id = executor_id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
