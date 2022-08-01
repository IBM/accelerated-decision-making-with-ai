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

package com.ibm.pmai.taskclerk.interceptors;

import java.util.WeakHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * Used to intercept requests for authentication validation
 */
@Component
public class AuthenticationInterceptor extends HandlerInterceptorAdapter {

    /**
     * Logger declaration
     */
    private Logger logger = LoggerFactory.getLogger(AuthenticationInterceptor.class);

    /**
     * A WeakHashMap to cache a token for a session
     */
    public WeakHashMap<String, String> session = new WeakHashMap<>();

    /**
     * Constructor class
     * @param parser
     */
    @Autowired
    public AuthenticationInterceptor() {
    }

    /**
     * Request prehandle for validations of all incoming requests
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return true;
    }
}
