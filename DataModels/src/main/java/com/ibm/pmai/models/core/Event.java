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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="event")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Event extends Auditable<String> implements Serializable {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    @Column(name="id", columnDefinition = "VARCHAR(255)", insertable = false, updatable = false, nullable = false)
    private String id;

    @Column
    private String event;

    @Column
    private String description;

    // Many or more than one events belong to one task
    @JoinColumn(name = "task_id", referencedColumnName = "id", nullable = true)
    @ManyToOne(cascade = CascadeType.MERGE, targetEntity = Task.class)
    private Task taskEvents;

    // Many or more than one events belong to one user
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = true)
    @ManyToOne(cascade = CascadeType.MERGE, targetEntity = User.class)
    private User userEvents;

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Task getTaskEvents() {
        return taskEvents;
    }

    public void setTaskEvents(Task taskEvents) {
        this.taskEvents = taskEvents;
    }

    public User getUserEvents() {
        return userEvents;
    }

    public void setUserEvents(User userEvents) {
        this.userEvents = userEvents;
    }

}
