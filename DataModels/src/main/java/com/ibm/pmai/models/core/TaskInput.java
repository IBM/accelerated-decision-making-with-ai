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

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Entity
@Table(name="task_input")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class TaskInput extends Auditable<String> implements Serializable {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    // This is used to store values that will go to the template string e.g.
    // valuesMap.put("JOB_ID", "ec373037-1724-4436-8145-7d7b1fd6d667");
    // valuesMap.put("MODEL_NAME", "witsacza");
    @ElementCollection(fetch = FetchType.EAGER)
    @MapKeyColumn(name="action_key",columnDefinition = "TEXT")
    @Column(name="action_value",columnDefinition = "TEXT")
    @CollectionTable(name="action_input", joinColumns=@JoinColumn(name="id"))
    private Map<String,String> action;

    @Column
    private String name;

    @Schema(hidden = true)
    @Column
    private String type;

    @Column
    private String description;

    // Captures base input parameter --> Formerly known as base64 --> First input to the model
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name="data_information_id", referencedColumnName="id")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<MetadataDetails> metadataDetails;


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


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public List<MetadataDetails> getMetadataDetails() {
        return metadataDetails;
    }

    public void setMetadataDetails(List<MetadataDetails> metadataDetails) {
        this.metadataDetails = metadataDetails;
    }

    public Map<String, String> getAction() {
        return action;
    }

    public void setAction(Map<String, String> action) {
        this.action = action;
    }

    public String getId() {
        return id;
    }
}
