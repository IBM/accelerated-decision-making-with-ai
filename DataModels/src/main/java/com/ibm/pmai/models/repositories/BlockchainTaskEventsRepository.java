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



import com.ibm.pmai.models.core.BlockchainTaskEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the BlockchainEventEntity.
 */
@Repository
public interface BlockchainTaskEventsRepository extends JpaRepository<BlockchainTaskEvents,String> {

    String QUERY_FIND_CACHED_POST_EVENTS = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.event_type=:eventType "+
            "AND blockchain_task_events.previous_id=:previousId "+
            "AND blockchain_task_events.task_id=:taskId ";
    @Query(value = QUERY_FIND_CACHED_POST_EVENTS, nativeQuery = true)
    List<BlockchainTaskEvents> findByCachedPostTaskId(@Param("taskId") String taskId, @Param("previousId") String previousId, @Param("eventType") String eventType) ;


    String QUERY_FIND_BY_CORRELATION_ID = "SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.correlation_id=:correlationId ";
    @Query(value = QUERY_FIND_BY_CORRELATION_ID, nativeQuery = true)
    BlockchainTaskEvents findByCorrelationId(@Param("correlationId") String correlationId);

    String QUERY_FIND_EVENTS = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.blockchain_status=:BlockchainTaskEventstatus ";
    @Query(value = QUERY_FIND_EVENTS, nativeQuery = true)
    List<BlockchainTaskEvents> findByStatus(@Param("BlockchainTaskEventstatus") String BlockchainTaskEventstatus);


    String QUERY_FIND_BY_JOB_ID_EVENT_TYPE = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.task_Id=:taskId "+
            "AND blockchain_task_events.event_type=:eventType ";
    @Query(value = QUERY_FIND_BY_JOB_ID_EVENT_TYPE, nativeQuery = true)
    List<BlockchainTaskEvents> findByTaskIdAndEventType(@Param("taskId") String taskId, @Param("eventType") String eventType);

    String QUERY_FIND_BY_JOB_ID_EVENT_TYPE_STATUS = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.task_Id=:taskId "+
            "AND blockchain_task_events.event_type=:eventType "+
            "AND blockchain_task_events.event_status_code=:eventStatusCode ";
    @Query(value = QUERY_FIND_BY_JOB_ID_EVENT_TYPE_STATUS, nativeQuery = true)
    List<BlockchainTaskEvents> findByTaskIdAndEventTypeAndEventStatus(@Param("taskId") String taskId, @Param("eventType") String eventType,@Param("eventStatusCode") String eventStatusCode);


    String QUERY_FIND_READY_EVENTS = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.event_type=:eventType "+
            "AND blockchain_task_events.event_status_code=:eventStatusCode "+
            "AND blockchain_task_events.previous_status_code=:previousStatusCode ";
    @Query(value = QUERY_FIND_READY_EVENTS, nativeQuery = true)
    List<BlockchainTaskEvents> findReadyEvents(@Param("eventType") String eventType, @Param("eventStatusCode") String eventStatusCode, @Param("previousStatusCode") String previousStatusCode);


    String QUERY_FIND_CACHED_EVENTS = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.task_id=:taskId "+
            "AND blockchain_task_events.event_status_code=:eventStatusCode "+
            "AND blockchain_task_events.previous_status_code=:previousStatusCode ";
    @Query(value = QUERY_FIND_CACHED_EVENTS, nativeQuery = true)
    List<BlockchainTaskEvents> findByCachedEvents(@Param("taskId") String taskId, @Param("eventStatusCode") String eventStatusCode, @Param("previousStatusCode") String previousStatusCode);



    String QUERY_FIND_FAILED_EVENTS = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.event_type=:eventType "+
            "AND blockchain_task_events.event_status_code=:eventStatusCode "+
            "OR blockchain_task_events.event_status_code=:retryStatusCode ";
    @Query(value = QUERY_FIND_FAILED_EVENTS, nativeQuery = true)
    List<BlockchainTaskEvents> findFailedEvents(@Param("eventType") String eventType, @Param("eventStatusCode") String eventStatusCode, @Param("retryStatusCode") String retryStatusCode);

    String QUERY_FIND_NEXT_JOBS = " SELECT blockchain_task_events.* " +
            "FROM blockchain_task_events " +
            "WHERE blockchain_task_events.previous_id=:previousId "+
            "AND blockchain_task_events.event_status_code=:eventStatusCode ";
    @Query(value = QUERY_FIND_NEXT_JOBS, nativeQuery = true)
    List<BlockchainTaskEvents> findNextTasks(@Param("previousId") String previousId, @Param("eventStatusCode") String eventStatusCode);

}
