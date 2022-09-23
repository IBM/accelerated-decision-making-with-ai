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

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="data_push_output")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class DataPush extends Auditable<String> implements Serializable {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column(unique=true)
    private String name;

    @Column
    private String description;

    @Column(columnDefinition = "TEXT")
    private String hash;

    @JoinColumn(name = "datapush_information_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.ALL, targetEntity = MetadataDetails.class)
    private MetadataDetails metadataDetails;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHash() {
        return this.hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public MetadataDetails getMetadataDetails() {
        return this.metadataDetails;
    }

    public void setMetadataDetails(MetadataDetails metadataDetails) {
        this.metadataDetails = metadataDetails;
    }
}

