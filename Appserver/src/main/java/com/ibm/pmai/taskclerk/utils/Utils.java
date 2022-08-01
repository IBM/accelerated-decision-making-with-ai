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

package com.ibm.pmai.taskclerk.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;

import com.ibm.cloud.objectstorage.ClientConfiguration;
import com.ibm.cloud.objectstorage.SDKGlobalConfiguration;
import com.ibm.cloud.objectstorage.auth.AWSCredentials;
import com.ibm.cloud.objectstorage.auth.AWSStaticCredentialsProvider;
import com.ibm.cloud.objectstorage.client.builder.AwsClientBuilder;
import com.ibm.cloud.objectstorage.oauth.BasicIBMOAuthCredentials;
import com.ibm.cloud.objectstorage.services.s3.AmazonS3;
import com.ibm.cloud.objectstorage.services.s3.AmazonS3ClientBuilder;
import com.ibm.cloud.objectstorage.services.s3.model.ObjectMetadata;
import com.ibm.cloud.objectstorage.services.s3.model.PutObjectRequest;
import com.ibm.cloud.objectstorage.services.s3.model.PutObjectResult;
import com.ibm.cloud.objectstorage.services.s3.model.S3Object;
import com.ibm.cloud.objectstorage.services.s3.model.S3ObjectInputStream;
import com.ibm.pmai.models.core.Executor;
import com.ibm.pmai.models.core.Experiment;
import com.ibm.pmai.models.core.Task;

/**
 * This is used for keeping track of general utils that are used across the project.
 */
public class Utils {

    /**
     * Used to generate a hash of a given string input
     *
     * @param input
     * @return
     * @throws NoSuchAlgorithmException
     */
    public static String getSHA512Hash(String input) throws NoSuchAlgorithmException {

        // Get SHA instance
        MessageDigest digest = MessageDigest.getInstance("SHA-512");

        // Resets the digest for further use.
        digest.reset();

        // Updates the digest using the specified array of bytes.
        digest.update(input.getBytes(StandardCharsets.UTF_8));

        return String.format("%040x", new BigInteger(1, digest.digest()));
    }


    public static String  getDateTime(Date date){
        DateTime dt = new DateTime(date);
        org.joda.time.format.DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss");
       return dt.toString(dtf);

    }

    public static String getExperimentHash(Experiment experiment){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(experiment.getLocation().getId());
        stringBuilder.append(experiment.getSelectedPostExecutor().get(0).getId());
        return stringBuilder.toString();
    }

    public static String getExperimentHash(String locationId, String postExecutorId){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(locationId);
        stringBuilder.append(postExecutorId);
        return stringBuilder.toString();
    }


    public static boolean validateLocationData(String targetURL) {
        boolean locationDataExists = false;
        HttpURLConnection connection = null;

        try {
            //Create connection
            URL url = new URL(targetURL);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);
            connection.setUseCaches(false);
            connection.setDoOutput(true);

            //Get Response
            InputStream is = connection.getInputStream();
            BufferedReader rd = new BufferedReader(new InputStreamReader(is));
            int length = 0;
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                response.append(line);
                response.append('\r');
                length++;
            }
            rd.close();
            return length > 1;
        } catch (Exception e) {
            e.printStackTrace();
            return locationDataExists;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }


    /**
     * Used to combine task values for a hash
     * @param task
     * @param isNullAction is used cater for creating values for empty task which we call null actions. In these, the base input parameters are all set to nul
     * @return
     */
    public static String getTaskValuesCombination(Task task, boolean isNullAction){
        StringBuilder stringBuilder = new StringBuilder();

        // Env
        stringBuilder.append(task.getExecutor().getExecutionEnvironmentCommand().getExecutionEnvironment().getId());

        // Env action
        stringBuilder.append(task.getExecutor().getExecutionEnvironmentCommand().getId());

        // Null Action
        if (isNullAction) {
            stringBuilder.append(task.getTaskInputs().getAction().get("seed"));
        } else {
            // Task inputs
            stringBuilder.append(task.getTaskInputs().getAction());
        }

        stringBuilder.append(task.getName());

        // Executor
        if (task.getExecutor()!=null)
        stringBuilder.append(task.getExecutor().getId());

        // get user selected post executors
        List<Executor> userSelectedpostExecutorList=  task.getSelectedPostExecutor();
        StringBuilder stringBuilderPostExecutors = new StringBuilder();
        for (Executor executor:userSelectedpostExecutorList){
            stringBuilderPostExecutors.append(executor.getId());
        }
        stringBuilder.append(stringBuilderPostExecutors.toString());

        return stringBuilder.toString();
    }

    /**
     * download file from COS
     * @param apiKey
     * @param resourceInstanceId
     * @param endpointUrl
     * @param bucketName
     * @param bucketRegion
     * @param iamEndpoint
     * @param fileName
     * @return
     */
    public  static S3ObjectInputStream downloadFileFromCos(String apiKey, String resourceInstanceId, String endpointUrl,String bucketName, String bucketRegion,String iamEndpoint,String fileName){

        SDKGlobalConfiguration.IAM_ENDPOINT = iamEndpoint;

        AmazonS3 cos = createClient(apiKey, resourceInstanceId, endpointUrl, bucketRegion);

        S3Object returned = cos.getObject( // request the object by identifying
            bucketName, // the name of the bucket
            fileName // the name of the serialized object
        );
        S3ObjectInputStream s3Input = returned.getObjectContent(); // set the object stream

        return s3Input;

    }


    /**
     * download file from COS
     * @param apiKey
     * @param resourceInstanceId
     * @param endpointUrl
     * @param bucketName
     * @param bucketRegion
     * @param iamEndpoint
     * @param contentType
     * @return
     */
    public  static PutObjectResult putObject(String apiKey, String resourceInstanceId, String endpointUrl, String bucketName, String bucketRegion, String iamEndpoint, String contentType, InputStream targetFileStream, String key){

        SDKGlobalConfiguration.IAM_ENDPOINT = iamEndpoint;

        AmazonS3 cos = createClient(apiKey, resourceInstanceId, endpointUrl, bucketRegion);
        ObjectMetadata metaData = new ObjectMetadata();

        metaData.setContentType(contentType);
        try {
            metaData.setContentLength(targetFileStream.available());
        } catch (IOException e) {
            e.printStackTrace();
        }
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, targetFileStream,metaData);

        PutObjectResult putObjectResult=cos.putObject(putObjectRequest );

        return putObjectResult;

    }


    /**
     * Create COS client
     * @param apiKey
     * @param serviceInstanceId
     * @param endpointUrl
     * @param location
     * @return
     */
    public static AmazonS3 createClient(String apiKey, String serviceInstanceId, String endpointUrl, String location)
    {
        AWSCredentials basicIBMOAuthCredentials = new BasicIBMOAuthCredentials(apiKey, serviceInstanceId);
        ClientConfiguration clientConfig = new ClientConfiguration()
            .withRequestTimeout(5000)
            .withTcpKeepAlive(true);

        return AmazonS3ClientBuilder
            .standard()
            .withCredentials(new AWSStaticCredentialsProvider(basicIBMOAuthCredentials))
            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endpointUrl, location))
            .withPathStyleAccessEnabled(true)
            .withClientConfiguration(clientConfig)
            .build();
    }

    public static int randInt(int min, int max) {

        // Usually this can be a field rather than a method variable
        Random rand = new Random();

        // nextInt is normally exclusive of the top value,
        // so add 1 to make it inclusive
        int randomNum = rand.nextInt((max - min) + 1) + min;

        return randomNum;
    }
}
