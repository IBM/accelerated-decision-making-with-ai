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

package com.ibm.pmai.taskclerk.services.implimentations;

import java.io.IOException;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import com.ibm.pmai.models.request.JobDeploymentRequest;
import com.ibm.pmai.models.response.JobDeploymentResponse;
import com.ibm.pmai.models.response.JobDeploymentServiceStatusResponse;
import com.ibm.pmai.taskclerk.services.interfaces.ExperimentService;

@Service
public class ExperimentServiceImpl implements ExperimentService {

    @Autowired
    private RestTemplate restTemplate;

    // Logger
    private static final Logger logger = LoggerFactory.getLogger(ExperimentServiceImpl.class);

    @Override
    public ResponseEntity<JobDeploymentResponse> postJDS(JobDeploymentRequest jobDeploymentRequest, String jobDeploymentServiceUrl) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<JobDeploymentRequest> entity = new HttpEntity<>(jobDeploymentRequest, headers);
        restTemplate.setErrorHandler(new MyErrorHandler());
        return restTemplate.exchange(jobDeploymentServiceUrl, HttpMethod.POST, entity, JobDeploymentResponse.class);
    }

    private static class MyErrorHandler extends DefaultResponseErrorHandler {
        @Override
        public void handleError(ClientHttpResponse response) throws IOException {
            // your error handling here
            logger.error(response.toString());
        }
    }

    @Override
    public ResponseEntity<JobDeploymentServiceStatusResponse> jobStatus(String jobId, String jobDeploymentServiceUrl) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
        restTemplate.setErrorHandler(new MyErrorHandler());
        return restTemplate.exchange(jobDeploymentServiceUrl + jobId , HttpMethod.GET, entity, JobDeploymentServiceStatusResponse.class);
    }
}
