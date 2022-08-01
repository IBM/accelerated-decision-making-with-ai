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
@Table(name="location_data")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class LocationData extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    // One location can have more than one data sets e.g. for historical data
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name="location_data_information_id", referencedColumnName="id")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<MetadataDetails> metadataDetailsList;

    @JoinColumn(name = "location_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.ALL, targetEntity = Location.class,fetch = FetchType.LAZY)
    private Location location;

    @ManyToMany(cascade = CascadeType.MERGE, targetEntity = Executor.class,fetch = FetchType.LAZY)
    @JoinTable(
            name="location_data_executor_details",
            joinColumns=@JoinColumn(name="location_data_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="executor_id", referencedColumnName="id"))
    private List<Executor> executorList;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public List<MetadataDetails> getMetadataDetailsList() {
        return metadataDetailsList;
    }

    public void setMetadataDetailsList(List<MetadataDetails> metadataDetailsList) {
        this.metadataDetailsList = metadataDetailsList;
    }

    public List<Executor> getExecutorList() {
        return executorList;
    }

    public void setExecutorList(List<Executor> executorList) {
        this.executorList = executorList;
    }


    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
