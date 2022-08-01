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
import io.swagger.annotations.ApiModelProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;


@Entity
@Table(name = "action_range")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ActionRange extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(name = "id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column(name = "intervention_name")
    private String interventionName;

    @Column(name = "coverage_min")
    private String coverageMin;

    @Column(name = "coverage_max")
    private String coverageMax;

    @Column(name = "coverage_step")
    private String coverageStep;

    @Column(name = "min_date")
    private String minDate;

    @Column(name = "max_date")
    private String maxDate;

    @Column(name = "date_step")
    private String dateStep;

    @Column(name = "number_of_episodes")
    private String numberOfEpisodes;

    public String getInterventionName() {
        return interventionName;
    }

    public void setInterventionName(String interventionName) {
        this.interventionName = interventionName;
    }

    public String getCoverageMin() {
        return coverageMin;
    }

    public void setCoverageMin(String coverageMin) {
        this.coverageMin = coverageMin;
    }

    public String getCoverageMax() {
        return coverageMax;
    }

    public void setCoverageMax(String coverageMax) {
        this.coverageMax = coverageMax;
    }

    public String getCoverageStep() {
        return coverageStep;
    }

    public void setCoverageStep(String coverageStep) {
        this.coverageStep = coverageStep;
    }

    public String getMinDate() {
        return minDate;
    }

    public void setMinDate(String minDate) {
        this.minDate = minDate;
    }

    public String getMaxDate() {
        return maxDate;
    }

    public void setMaxDate(String maxDate) {
        this.maxDate = maxDate;
    }

    public String getDateStep() {
        return dateStep;
    }

    public void setDateStep(String dateStep) {
        this.dateStep = dateStep;
    }

    public String getNumberOfEpisodes() {
        return numberOfEpisodes;
    }

    public void setNumberOfEpisodes(String numberOfEpisodes) {
        this.numberOfEpisodes = numberOfEpisodes;
    }
}
