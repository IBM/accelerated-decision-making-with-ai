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

package com.ibm.pmai.models.repositories;

import com.ibm.pmai.models.core.ModelMappers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ModelMappersRepository extends JpaRepository<ModelMappers, String> {

    @Query(
            value = "select * from model_mappers m where m.scenario_id = :scenario_id",
            nativeQuery = true)
    ModelMappers getByscenario_id(@Param("scenario_id") String scenario_id);

    @Query(
            value = "select * from model_mappers m where m.executor_id = :executor_id",
            nativeQuery = true)
    ModelMappers getByExecutor_id(@Param("executor_id") String executor_id);
}
