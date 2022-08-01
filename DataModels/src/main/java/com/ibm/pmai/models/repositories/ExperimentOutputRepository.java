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

import com.ibm.pmai.models.core.ExperimentOutput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperimentOutputRepository extends JpaRepository<ExperimentOutput, String> {
    List<ExperimentOutput> getById(String id);

    List<ExperimentOutput> getByExperiment_Id(String experimentId);

    // List<ExperimentOutput> getByExperiment_Location_IdAndExperiment_Executor_Id(String locationId,String executorId);

    List<ExperimentOutput> getByExperiment_IdAndAndTypeOrderByUpdatedAt(String experimentId, String type);

    ExperimentOutput getByHashAndAndTypeAndExperiment_Id(String hash, String type,String experimentId);

    List<ExperimentOutput> getByExperiment_IdOrderByUpdatedAt(String experimentId);

    ExperimentOutput getByHashAndExperiment_Id(String hash, String experimentId);

    // List<ExperimentOutput> getByExperiment_AlgorithmIdAndAndTypeOrderByUpdatedAt(String algorithmId, String type);

    // List<ExperimentOutput> getByExperiment_ExperimentHashAndAndTypeOrderByUpdatedAt(String experimentHash, String type);
}
