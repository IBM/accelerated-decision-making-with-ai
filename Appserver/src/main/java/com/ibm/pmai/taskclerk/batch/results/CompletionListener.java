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

package com.ibm.pmai.taskclerk.batch.results;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;

public class CompletionListener extends JobExecutionListenerSupport {

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(CompletionListener.class);


    @Override
    public void afterJob(JobExecution jobExecution) {
        logger.info("COMPLETION: " + System.currentTimeMillis());
        if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
            logger.info("BATCH JOB COMPLETED SUCCESSFULLY"+jobExecution.getJobParameters());
            System.out.println("BATCH JOB COMPLETED SUCCESSFULLY");
        }
    }

}
