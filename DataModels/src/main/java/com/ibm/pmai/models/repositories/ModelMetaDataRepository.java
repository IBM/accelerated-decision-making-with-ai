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

import com.ibm.pmai.models.core.ModelMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ModelMetaDataRepository extends JpaRepository<ModelMetaData, Long> {
    @Query(
            value = "select * from model_meta_data m where m.model_name = :model_name",
            nativeQuery = true)
    ModelMetaData getByModel_name(@Param("model_name") String model_name);

    @Query(
            value = "update model_meta_data m set m.onboarded = true where m.id = :id",
            nativeQuery = true)
    boolean setOnboarded(@Param("id") long id);
}
