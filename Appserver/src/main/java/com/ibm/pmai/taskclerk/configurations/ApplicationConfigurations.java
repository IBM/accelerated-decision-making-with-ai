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

package com.ibm.pmai.taskclerk.configurations;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPublicKeySpec;

import javax.sql.DataSource;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;

/**
 * Used to set application beans and configurations. In addition its used to expose application variables in property files.
 */

@Configuration
public class ApplicationConfigurations {
    
    // authentication base64 key for token authentication
    @Value("${authentication.key.base64E}")
    private String authenticationKeyBase64E;

    // authentication base64 key for token authentication
    @Value("${authentication.key.base64N}")
    private String authenticationKeyBase64N;

    @Value("${authentication.encryption.key}")
    private String authenticationEncryptionKey;

    @Value("${app.hostname}")
    private String appHostName;

    @Value("${app.default_data_repo}")
    private String defaultDataRepo;

    @Value("${app.default_environment_command_name}")
    private String environmentCommandName;

    @Value("${spring.datasource.jdbc-url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${app.job_batch_timeout}")
    private float jobBatchTimeout;


    /**
     * Constructor
     */
    public ApplicationConfigurations() {
    }


    /**
     * Datasource bean for database integrations.
     * @return
     */
    @Primary
    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }


    /**
     * Creates a new RSAPublicKeySpec.
     *
     * @param modulus the modulus
     * @param publicExponent the public exponent
     */
    /**
     * JWT parser bean initialization to be used to validate tokens in the project
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    @Bean
    public JwtParser parser() throws NoSuchAlgorithmException, InvalidKeySpecException {

        // decoded keys and set RSAPublicKeySpec modulus and public exponent values
        BigInteger modulus = new BigInteger(1, Base64.decodeBase64(authenticationKeyBase64N));
        BigInteger exponent = new BigInteger(1, Base64.decodeBase64(authenticationKeyBase64E));

        // Generate RSA public key
        PublicKey publicKey = KeyFactory
            .getInstance("RSA").generatePublic(new RSAPublicKeySpec(modulus, exponent));

        // Assign key and return JwtParser
        return Jwts.parser().setSigningKey(publicKey);

    }
    /**
     * Creates rest template that is used to invoke other services
     *
     * @return
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }


    /**
     * Object mapper bean used to serialize objects to JSON and vice-versa
     * @return
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    /**
     * Create webclient bean
     * @return
     */
    @Bean
    WebClient webClient() {
        return WebClient.create();
    }

    public String getAuthenticationEncryptionKey() {
        return authenticationEncryptionKey;
    }

    public void setAuthenticationEncryptionKey(String authenticationEncryptionKey) {
        this.authenticationEncryptionKey = authenticationEncryptionKey;
    }

    public String getAppHostName() {
        return appHostName;
    }

    public void setAppHostName(String appHostName) {
        this.appHostName = appHostName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDefaultDataRepo() {
        return defaultDataRepo;
    }

    public void setDefaultDataRepo(String defaultDataRepo) {
        this.defaultDataRepo = defaultDataRepo;
    }


    public String getEnvironmentCommandName() {
        return environmentCommandName;
    }

    public void setEnvironmentCommandName(String environmentCommandName) {
        this.environmentCommandName = environmentCommandName;
    }

    public float getJobBatchTimeout() {
        return jobBatchTimeout;
    }

    public void setJobBatchTimeout(float jobBatchTimeout) {
        this.jobBatchTimeout = jobBatchTimeout;
    }
}
