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

import com.ibm.pmai.models.core.ExecutionWorkflow;
import com.ibm.pmai.models.core.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.LockModeType;
import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExecutionWorkflowRepository extends JpaRepository<ExecutionWorkflow, String> {
    List<ExecutionWorkflow> getById(String id);

    List<ExecutionWorkflow> getByWorkflowStates_state(String state);
    List<ExecutionWorkflow> getByWorkflowStates_stateAndAndWorkProgress(String state,int workProgress);
    List<ExecutionWorkflow> getByWorkProgress(int workProgress);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value   ="0")})
    ExecutionWorkflow findById(String id);

}
