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

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ibm.pmai.models.core.Executor;

@Repository
public interface ExecutorRepository extends JpaRepository<Executor, String> {
    List<Executor> getById(String id);

    @Query(
            value = "SELECT executor.* FROM executor WHERE executor.id in :ids ",
            nativeQuery = true
    )
    List<Executor> getByIds(@Param("ids") List<String> var1);

    List<Executor> getByIdAndExecutorType_Type(String id,String executorType);


    List<Executor> getByExecutorType_Type(String executorType);

}
