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

package com.ibm.pmai.taskclerk;

import java.util.Collections;

import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

/**
 * TaskClerkMainApplication is the entry point of the application which starts the whole application via spring boot
 */
@SpringBootApplication
@EnableAsync
@EnableJpaRepositories({"com.ibm.pmai.models.*"})
@EntityScan("com.ibm.pmai.models.*")
@ComponentScan({"com.ibm.pmai.taskclerk.*","com.ibm.pmai.models.*"})
@EnableWebMvc
@EnableScheduling
@EnableJpaAuditing
@EnableBatchProcessing
public class TaskClerkMainApplication extends SpringBootServletInitializer implements ServletContextAware {

    // Logger declarations
    private static final Logger logger = LoggerFactory.getLogger(TaskClerkMainApplication.class);

    /**
     * Main
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(TaskClerkMainApplication.class, args);
    }

    /**
     * sets servlet context
     * @param servletContext
     */
    @Override
    public void setServletContext(ServletContext servletContext) {
    }

    /**
     * Set spring application builder
     * @param application
     * @return
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(TaskClerkMainApplication.class);
    }

    /**
     * Used to set OpenAPI configurations
     * @param appVersion
     * @return
     */
    @Bean
    public OpenAPI openAPI(@Value("${app.version}") String appVersion) {
        return new OpenAPI()
            .servers(Collections.singletonList(new Server().url("")))
            .info(new Info().title("ADMAI APIs").version(appVersion)
                .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
