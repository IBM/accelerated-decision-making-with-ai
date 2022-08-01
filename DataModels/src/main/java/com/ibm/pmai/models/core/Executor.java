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
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="executor")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Executor extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String uri;

    @Column
    private String title;

    @Column
    private String name;

    @Column
    private String version;

    @Column
    private Date versionDate;

    @Column
    private String versionAuthor;

    @Column
    private String githubLink;

    @Column
    private String runCommand;

    @Column
    private String alias;


    @Column
    private boolean isVerified;

    @Column
    private boolean isActive;


    @Column
    private boolean counterFactualComparison;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ElementCollection
    @Column(name="executor_expected_actions")
    @CollectionTable(name="executor_actions", joinColumns=@JoinColumn(name="id"))
    private List<String> actions;


    // An executor can have more than post executors e.g. reward functions
    @Schema(hidden = true)
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name="default_post_executor_id", referencedColumnName="id")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Executor> defaultPostExecutor;

    @Schema(hidden = true)
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = Organization.class,fetch = FetchType.LAZY)
    private Organization organization;

    @Schema(hidden = true)
    @JoinColumn(name = "executor_type_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.ALL, targetEntity = ExecutorType.class,fetch = FetchType.LAZY)
    private ExecutorType executorType;

    @Schema(hidden = true)
    @JoinColumn(name = "data_repository_configuration_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = DataRepositoryConfiguration.class,fetch = FetchType.LAZY)
    private DataRepositoryConfiguration dataRepositoryConfiguration;

    @Schema(hidden = true)
    @JoinColumn(name = "execution_environment_action_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = ExecutionEnvironmentCommand.class,fetch = FetchType.LAZY)
    private ExecutionEnvironmentCommand executionEnvironmentCommand;

    @ManyToMany(cascade = CascadeType.MERGE, targetEntity = ExecutorDomain.class, fetch = FetchType.LAZY)
    @JoinTable(
            name="executor_executor_domain",
            joinColumns=@JoinColumn(name="executor_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="executor_domain_id", referencedColumnName="id"))
    private List<ExecutorDomain> executorDomain;

    @ManyToMany(cascade = CascadeType.MERGE, targetEntity = ExecutorRequirement.class, fetch = FetchType.LAZY)
    @JoinTable(
            name="executor_executor_requirement_details",
            joinColumns=@JoinColumn(name="executor_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="executor_requirement_id", referencedColumnName="id"))
    private List<ExecutorRequirement> executorRequirement;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }


    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public ExecutorType getExecutorType() {
        return executorType;
    }

    public void setExecutorType(ExecutorType executorType) {
        this.executorType = executorType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DataRepositoryConfiguration getDataRepositoryConfiguration() {
        return dataRepositoryConfiguration;
    }

    public void setDataRepositoryConfiguration(DataRepositoryConfiguration dataRepositoryConfiguration) {
        this.dataRepositoryConfiguration = dataRepositoryConfiguration;
    }


    public boolean isCounterFactualComparison() {
        return counterFactualComparison;
    }

    public void setCounterFactualComparison(boolean counterFactualComparison) {
        this.counterFactualComparison = counterFactualComparison;
    }


    /**
     * Used to retrieve values from this object based on the specified parameter
     * @param parameter
     * @return
     */
    public String getParameterValue(String parameter){
        String returnValue="";
        if (parameter.equalsIgnoreCase("title"))
            returnValue=getTitle();
        else if (parameter.equalsIgnoreCase("uri"))
            returnValue=getUri();
        else if (parameter.equalsIgnoreCase("name"))
            returnValue=getName();
        else if (parameter.equalsIgnoreCase("fileName"))
            returnValue=getName();
        return returnValue;
    }


    public List<Executor> getDefaultPostExecutor() {
        return defaultPostExecutor;
    }

    public void setDefaultPostExecutor(List<Executor> defaultPostExecutor) {
        this.defaultPostExecutor = defaultPostExecutor;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Date getVersionDate() {
        return versionDate;
    }

    public void setVersionDate(Date versionDate) {
        this.versionDate = versionDate;
    }

    public String getVersionAuthor() {
        return versionAuthor;
    }

    public void setVersionAuthor(String versionAuthor) {
        this.versionAuthor = versionAuthor;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }

    public String getRunCommand() {
        return runCommand;
    }

    public void setRunCommand(String runCommand) {
        this.runCommand = runCommand;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public ExecutionEnvironmentCommand getExecutionEnvironmentCommand() {
        return executionEnvironmentCommand;
    }

    public void setExecutionEnvironmentCommand(ExecutionEnvironmentCommand executionEnvironmentCommand) {
        this.executionEnvironmentCommand = executionEnvironmentCommand;
    }


    public List<String> getActions() {
        return actions;
    }

    public void setActions(List<String> actions) {
        this.actions = actions;
    }

    public List<ExecutorDomain> getExecutorDomain() {
        return executorDomain;
    }

    public void setExecutorDomain(List<ExecutorDomain> executorDomain) {
        this.executorDomain = executorDomain;
    }

    public List<ExecutorRequirement> getExecutorRequirement() {
        return executorRequirement;
    }

    public void setExecutorRequirement(List<ExecutorRequirement> executorRequirement) {
        this.executorRequirement = executorRequirement;
    }
}

