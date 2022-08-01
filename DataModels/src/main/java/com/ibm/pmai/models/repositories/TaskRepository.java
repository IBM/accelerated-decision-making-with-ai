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

import com.ibm.pmai.models.core.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> getById(String id);

    Task getByTaskHash(String taskHash);

    List<Task> getByWorkProgress(int workProgress);

    List<Task>  getByTaskHashAndWorkProgressAndType(String taskHash,int workProgress,String type);

    List<Task>  getByNullActionHashAndWorkProgressAndType(String nullActionHash,int workProgress,String type);

    Task  getByNullActionHashAndType(String nullActionHash,String type);

    Task getByTaskHashAndType(String taskHash,String type);

    List<Task> findByType(String type);

    List<Task> getByUser_UserName(String userName);

    List<Task> findByExecutor_IdAndLocation_IdAndWorkProgress(String executorId, String locationId,int workProgressworkProgress);

    List<Task> findByExecutor_IdAndWorkProgress(String executorId,int workProgressworkProgress);

    List<Task> getByExperimentId(String experiment_id);
}
