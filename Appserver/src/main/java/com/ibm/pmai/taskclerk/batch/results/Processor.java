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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.annotation.BeforeStep;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ibm.pmai.models.core.ResultsRequest;
import com.ibm.pmai.models.core.ResultsResponse;
import com.ibm.pmai.models.repositories.ResultsRequestRepository;
import com.ibm.pmai.taskclerk.utils.Constants;
import com.ibm.pmai.taskclerk.utils.Utils;

public class Processor implements ItemProcessor<String, String> {

    private String resultRequestId;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(Processor.class);

    private ResultsRequestRepository resultsRequestRepository;

    @Autowired
    public Processor(ResultsRequestRepository resultsRequestRepository) {
        this.resultsRequestRepository = resultsRequestRepository;
    }

    private Gson gson = new Gson();


    @BeforeStep
    public void beforeStep(final StepExecution stepExecution) {
        JobParameters jobParameters = stepExecution.getJobParameters();
        resultRequestId = jobParameters.getString("resultRequestId");

    }

    @Override
    public String process(String data) throws Exception {
        logger.info("PROCESSOR: " + System.currentTimeMillis());

        if (data != null && data.length()>0) {
            JsonArray jsonValueArray = JsonParser.parseString(data).getAsJsonArray();


            ResultsRequest resultsRequest = resultsRequestRepository.getById(resultRequestId);

            resultsRequest.setStatus(true);

            resultsRequest.setTimeCompleted(Utils.getDateTime(new Date()));


            List<ResultsResponse> resultsResponseList = new ArrayList<>();

            for (int y=0;y<jsonValueArray.size();y++){
               JsonObject jsonObject= jsonValueArray.get(y).getAsJsonObject();

                ResultsResponse resultsResponse = new ResultsResponse();
                resultsResponse.setExecutorId(jsonObject.get("executorId").getAsString());
                if (jsonObject.has("locationId"))
                resultsResponse.setLocationId(jsonObject.get("locationId").getAsString());
                resultsResponse.setResultId(jsonObject.get("resultId").getAsString());

                JsonArray actions = jsonObject.get("actions").getAsJsonArray();
                List<Map<String, Object>> dataList= new ArrayList<>();
                for (int k=0;k<actions.size();k++){
                    JsonObject jsonObject1 = actions.get(k).getAsJsonObject();
                    Map map = gson.fromJson(jsonObject1, Map.class);
                    dataList.add(map);

                }
                resultsResponse.setActions(dataList);


                if(jsonObject.get("outputType").getAsString().equalsIgnoreCase(Constants.TASK_OUTPUTS_TYPES.TASK_EXECUTION_REWARD_RESPONSE.toString())){
                    JsonObject rewards = jsonObject.get("rewards").getAsJsonObject();
                    List<Map<String, Object>> rewardsList= new ArrayList<>();
                    Map map = gson.fromJson(rewards, Map.class);
                    rewardsList.add(map);
                    resultsResponse.setRewards(rewardsList);
                } else if(jsonObject.get("outputType").getAsString().equalsIgnoreCase(Constants.TASK_OUTPUTS_TYPES.TASK_EXECUTION_OUTPUT_RESPONSE.toString())){
                    JsonArray rewards = jsonObject.get("rewards").getAsJsonArray();

                    List<Map<String, Object>> rewardsList= new ArrayList<>();
                    for (int k=0;k<rewards.size();k++){
                        JsonObject jsonObject1 = rewards.get(k).getAsJsonObject();
                        Map map = gson.fromJson(jsonObject1, Map.class);
                        rewardsList.add(map);

                    }
                    resultsResponse.setRewards(rewardsList);
                } else {
                    JsonArray rewards = jsonObject.get("rewards").getAsJsonArray();

                    List<Map<String, Object>> rewardsList= new ArrayList<>();
                    for (int k=0;k<rewards.size();k++){
                        JsonObject jsonObject1 = rewards.get(k).getAsJsonObject();
                        Map map = gson.fromJson(jsonObject1, Map.class);
                        rewardsList.add(map);

                    }
                    resultsResponse.setRewards(rewardsList);
                }

                resultsResponseList.add(resultsResponse);

            }
            logger.info("=====jsonValueArray==== COMPLETED");
            resultsRequest.setResults(resultsResponseList);

            resultsRequestRepository.save(resultsRequest);

            return "Completed";

        } else return "Not Completed";
    }
}
