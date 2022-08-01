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

import com.ibm.pmai.models.core.Experiment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperimentRepository extends JpaRepository<Experiment, String> {
    Experiment getById(String id);

    List<Experiment> getByExperimentHash(String experimentHash);

    List<Experiment> getByExperimentHashAndAlgorithmId(String experimentHash, String algorithm_id);

    List<Experiment> getByUserId(String user_id);

    List<Experiment> getByAlgorithmId(String algorithm_id);

    Experiment getByUserIdAndScenarioIdAndResolution(String user_id, String scenario_id , String resolution);

    String QUERY_FIND_BY_USER_IS_AND_TIMESTAMP = "SELECT experiments.* " +
            "FROM experiments " +
            "WHERE experiments.user_id = :user_id " +
            "AND experiments.timestamp > :timestamp ";
    @org.springframework.data.jpa.repository.Query(value = QUERY_FIND_BY_USER_IS_AND_TIMESTAMP, nativeQuery = true)
    List<Experiment> findByUserIdAndTimestamp(@Param("user_id") String user_id, @Param("timestamp") long timestamp);
}
