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
import org.hibernate.annotations.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="executor_requirement")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ExecutorRequirement extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String name;

    @Column
    private String category;

    @Column
    private String type;

    @Column
    private String defaults;

    @Column
    private String required;

    @Column
    private String hidden;

    @Column
    private String value;

    @Column
    private String readonly;

    @Column
    private String description;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ElementCollection
    @Column(name="executor_expected_options")
    @CollectionTable(name="executor_options", joinColumns=@JoinColumn(name="id"))
    private List<String> options;

    @OneToMany(cascade = CascadeType.MERGE, targetEntity = MetadataDetails.class, fetch = FetchType.LAZY)
    @JoinColumn(name="requirement_data_information_id", referencedColumnName="id")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<MetadataDetails> metadataDetailsList;

    @JoinColumn(name = "optimization_envelope", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.MERGE, targetEntity = OptimizationEnvelope.class,fetch = FetchType.LAZY)
    private OptimizationEnvelope optimizationEnvelope;

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDefaults() {
        return defaults;
    }

    public void setDefaults(String defaults) {
        this.defaults = defaults;
    }

    public String getRequired() {
        return required;
    }

    public void setRequired(String required) {
        this.required = required;
    }

    public String getHidden() {
        return hidden;
    }

    public void setHidden(String hidden) {
        this.hidden = hidden;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public List<MetadataDetails> getMetadataDetailsList() {
        return metadataDetailsList;
    }

    public void setMetadataDetailsList(List<MetadataDetails> metadataDetailsList) {
        this.metadataDetailsList = metadataDetailsList;
    }

    public String getValue() {
        return this.value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getReadonly() {
        return this.readonly;
    }

    public void setReadonly(String readonly) {
        this.readonly = readonly;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public OptimizationEnvelope getOptimizationEnvelope() {
        return this.optimizationEnvelope;
    }

    public void setOptimizationEnvelope(OptimizationEnvelope optimizationEnvelope) {
        this.optimizationEnvelope = optimizationEnvelope;
    }
}
