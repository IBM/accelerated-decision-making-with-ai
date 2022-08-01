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

import com.ibm.pmai.models.repositories.ExecutorRepository;
import com.ibm.pmai.models.repositories.ExperimentOutputRepository;
import com.ibm.pmai.models.repositories.ExperimentRepository;
import com.ibm.pmai.models.repositories.ResultsRequestRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.utils.PBEEncryption;
import com.ibm.pmai.taskclerk.utils.Sha256DocumentHasher;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.launch.support.SimpleJobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;

@Configuration
public class ResultsConfiguration {

    @Autowired
    public JobBuilderFactory jobBuilderFactory;

    @Autowired
    public StepBuilderFactory stepBuilderFactory;

    @Autowired
    public ExecutorRepository executorRepository;

    /**
     * Task repository declaration
     */
    @Autowired
    private ExperimentRepository experimentRepository;

    /**
     * ExperimentOutput repository declaration
     */
    @Autowired
    private ExperimentOutputRepository experimentOutputRepository;

    /**
     * Encryption key
     */
    @Autowired
    private PBEEncryption pbeEncryption;

        /**
     * Hashing util
     */
    @Autowired
    private Sha256DocumentHasher sha256DocumentHasher;

    @Autowired
    private ResultsRequestRepository resultsRequestRepository;

    /**
     * Application configurations to access property values
     */
    @Autowired
    private ApplicationConfigurations applicationConfigurations;

    @Autowired
    JobRepository jobRepository;


    @Bean(name = "myJobLauncher")
    public JobLauncher simpleJobLauncher() throws Exception {
        SimpleJobLauncher jobLauncher = new SimpleJobLauncher();
        jobLauncher.setJobRepository(jobRepository);
        jobLauncher.setTaskExecutor(new SimpleAsyncTaskExecutor());
        jobLauncher.afterPropertiesSet();
        return jobLauncher;
    }

    @Bean
    public Job fetchTaskExecutionResult() {
        return jobBuilderFactory.get("fetchTaskExecutionResult")
            .incrementer(new RunIdIncrementer())
            .listener(listener())
            .flow(startExecutionSteps())
            .end()
            .build();
    }

    @Bean
    public Step startExecutionSteps() {
        return stepBuilderFactory.get("startExecutionSteps").<String, String>chunk(1)
            .reader(new Reader(resultsRequestRepository,applicationConfigurations,pbeEncryption,experimentOutputRepository,experimentRepository,sha256DocumentHasher))
            .processor( new Processor(resultsRequestRepository))
            .writer(new Writer())
            .build();
    }

    @Bean
    public JobExecutionListener listener() {
        return new CompletionListener();
    }

}
