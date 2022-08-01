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

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.annotation.BeforeStep;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;

import com.ibm.pmai.models.repositories.ResultsRequestRepository;

public class Writer implements ItemWriter<String> {

    private String resultRequestId;

    /**
     * Logger declaration
    */
    private static final Logger logger = LoggerFactory.getLogger(Writer.class);

    @Autowired
    private ResultsRequestRepository resultsRequestRepository;


    @BeforeStep
    public void beforeStep(final StepExecution stepExecution) {
        JobParameters jobParameters = stepExecution.getJobParameters();
        resultRequestId= jobParameters.getString("resultRequestId");
    }


    @Override
    public void write(List<? extends String> list) throws Exception {
        logger.info("WRITER: " + System.currentTimeMillis());
        System.out.println("Writing the data " + list);
    }
}
