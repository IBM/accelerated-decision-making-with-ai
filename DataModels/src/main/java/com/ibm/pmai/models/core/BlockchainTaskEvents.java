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



import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name="blockchain_task_events",
        indexes = {
                @Index(name="id_idx", columnList="id" ),
                @Index(name="next_id_idx", columnList="next_id" ),
                @Index(name="task_id_idx", columnList="task_id" ),
                @Index(name="event_type_idx", columnList="event_type" ),
                @Index(name="event_status_code_idx", columnList="event_status_code" ),
                @Index(name="previous_status_code_idx", columnList="previous_status_code" ),
                @Index(name="previous_id_idx", columnList="previous_id" )
        }
        )
public class BlockchainTaskEvents extends Auditable<String>  implements Serializable {


    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Schema(hidden = true)
    @Column(name = "event_status_code",nullable = true)
    private  String eventStatusCode;

    @Schema(hidden = true)
    @Column(nullable = true,columnDefinition = "TEXT")
    private String errorType;

    @Schema(hidden = true)
    @Column(nullable = true,columnDefinition = "TEXT")
    private String errorCode;

    @Schema(hidden = true)
    @Column(name = "next_id",nullable = true)
    private String nextId;

    @Schema(hidden = true)
    @Column(name = "previous_id",nullable = true)
    private String previousId;

    @Schema(hidden = true)
    @Column(name = "previous_status_code",nullable = true)
    private  String previousStatusCode;

    @Schema(hidden = true)
    @Column(nullable = true)
    private String correlationId;

    @Schema(hidden = true)
    @Column(name = "event_type",nullable = true)
    private String eventType;

    @Schema(hidden = true)
    @Column(nullable = true,columnDefinition = "TEXT")
    private String errorMessage;

    @Schema(hidden = true)
    @Column(nullable = true,columnDefinition = "TEXT")
    private String requestPayload;

    @JoinColumn(name = "task_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.ALL, targetEntity = Task.class,fetch = FetchType.LAZY)
    private Task task;





    public BlockchainTaskEvents() {
    }


    public BlockchainTaskEvents(Task task, String eventType, String eventStatusCode, String correlationId, String errorMessage, String errorType, String errorCode, String requestPayload) {
        this.eventType =eventType;
        this.eventStatusCode =eventStatusCode;
        this.correlationId =correlationId;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.errorType = errorType;
        this.requestPayload = requestPayload;
        this.task =task;
    }


    @Basic
    @Column(name = "event_status_code", nullable = true)
    public String getEventStatusCode() {
        return eventStatusCode;
    }

    public void setEventStatusCode(String eventStatusCode) {
        this.eventStatusCode = eventStatusCode;
    }


    @Basic
    @Column(name = "error_type", nullable = true)
    public String getErrorType() {
        return this.errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    @Basic
    @Column(name = "error_code", nullable = true)
    public String getErrorCode() {
        return this.errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }


    @Basic
    @Column(name = "correlation_id", nullable = true)
    public String getCorrelationId() {
        return this.correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    @Basic
    @Column(name = "event_type", nullable = true)
    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    @Basic
    @Column(name = "error_message", columnDefinition = "TEXT",nullable = true)
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Basic
    @Column(name = "request_payload", columnDefinition = "TEXT",nullable = true)
    public String getRequestPayload() {
        return requestPayload;
    }

    public void setRequestPayload(String requestPayload) {
        this.requestPayload = requestPayload;
    }

    @Basic
    @Column(name = "task_id", nullable = true)
    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    @Basic
    @Column(name = "next_id", nullable = true)
    public String getNextId() {
        return nextId;
    }

    public void setNextId(String nextId) {
        this.nextId = nextId;
    }

    @Basic
    @Column(name = "previous_id", nullable = true)
    public String getPreviousId() {
        return previousId;
    }

    public void setPreviousId(String previousId) {
        this.previousId = previousId;
    }

    @Basic
    @Column(name = "previous_status_code", nullable = true)
    public String getPreviousStatusCode() {
        return previousStatusCode;
    }

    public void setPreviousStatusCode(String previousStatusCode) {
        this.previousStatusCode = previousStatusCode;
    }

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        } else if (o != null && this.getClass() == o.getClass()) {
            BlockchainTaskEvents that = (BlockchainTaskEvents)o;
            return this.id == that.id  && this.eventStatusCode == that.eventStatusCode && Objects.equals(this.correlationId, that.correlationId) && Objects.equals(this.errorMessage, that.errorMessage) && Objects.equals(this.errorType, that.errorType) && Objects.equals(this.errorCode, that.errorCode);
        } else {
            return false;
        }
    }

    public int hashCode() {
        return Objects.hash(new Object[]{this.id,   this.eventStatusCode,  this.correlationId, this.errorMessage, this.errorType, this.errorCode});
    }

    public String toString() {
        return "BlockchainEventEntity{id=" + this.id + ", eventType=" + eventType + ", eventStatusCode=" + this.eventStatusCode +", correlationId='" + this.correlationId + '\'' + ", errorMessage='" + this.errorMessage + '\'' + ", errorType='" + this.errorType + '\'' + ", errorCode='" + this.errorCode + '\'' + ", requestPayload='" + this.requestPayload + '\'' + '}';
    }


    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}
