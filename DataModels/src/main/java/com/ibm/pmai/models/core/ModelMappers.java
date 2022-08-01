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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModel;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name="model_mappers")
@ApiModel("ModelMappers")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ModelMappers extends BaseModel {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column(unique=true)
    private String executor_id;

    @Column(name="mapper_json_string", columnDefinition="TEXT")
    private String mapper_json_string;

    @Column
    private String file_type;

    public String getExecutor_id() {
        return executor_id;
    }

    public void setExecutor_id(String executor_id) {
        this.executor_id = executor_id;
    }

    public String getMapper_json_string() {
        return mapper_json_string;
    }

    public void setMapper_json_string(String mapper_json_string) {
        this.mapper_json_string = mapper_json_string;
    }

    public String getFile_type() {
        return file_type;
    }

    public void setFile_type(String file_type) {
        this.file_type = file_type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
