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


/**
 * Used to store constants in the project
 */
public class Constants {


    /**
     * Task execution states
     */
    public enum EXECUTOR_TYPES {
        BLACK_BOX_MODEL,
        WHITE_BOX_MODEL,
        GREY_BOX_MODEL,
        ALGORITHM,
        REWARD_FUNCTION,
        ENVIRONMENT,
    }


    /**
     * 0 = Posted
     * 1 = Submitted
     * 2 = In progress
     * 3 = Output_available
     * 4 = Completed
     * 99 = FAILED
     * -1 = PENDING
     * Task execution states
     */
    public enum TASK_EXECUTION_STATUS {
        POSTED,
        PENDING,
        SUBMITTED,
        IN_PROGRESS,
        OUTPUT_AVAILABLE,
        COMPLETED,
        FAILED
    }

    /**
     * Pass state
     * @param status
     * @return
     */
    public static int getExecutionStatusIntValue(TASK_EXECUTION_STATUS status){
        int stateValue=404;
        if (status.equals(TASK_EXECUTION_STATUS.PENDING)){
            stateValue=-1;
        } else if (status.equals(TASK_EXECUTION_STATUS.SUBMITTED)){
            stateValue=1;
        }else if (status.equals(TASK_EXECUTION_STATUS.IN_PROGRESS)){
            stateValue=2;
        }else if (status.equals(TASK_EXECUTION_STATUS.OUTPUT_AVAILABLE)){
            stateValue=3;
        }else if (status.equals(TASK_EXECUTION_STATUS.COMPLETED)){
            stateValue=4;
        }else if (status.equals(TASK_EXECUTION_STATUS.FAILED)){
            stateValue=99;
        }else if (status.equals(TASK_EXECUTION_STATUS.POSTED)){
            stateValue=0;
        }

        return stateValue;
    }

    /**
     * TASK TYPES
     */
    public enum TASK_TYPES {
        MAIN_TASK,
        NULL_ACTION_TASK,
    }
    /**
     * TASK TYPES INPUTS
     */
    public enum TASK_TYPES_INPUTS {
        MAIN_TASK_INPUTS,
        NULL_ACTION_TASK_INPUTS,
    }

    /**
     * TASK TYPES OUTPUTS
     */
    public enum TASK_TYPES_OUTPUTS {
        MAIN_TASK_OUTPUTS,
        NULL_ACTION_TASK_OUTPUTS,
    }

    /**
     * TASK OUTPUT TYPES
     */
    public enum TASK_OUTPUTS_TYPES {
        TASK_POST_RESPONSE,
        TASK_EXECUTION_RESPONSE,
        TASK_EXECUTION_OUTPUT_RESPONSE,
        TASK_EXECUTION_REWARD_RESPONSE,
    }


    /**
     * TASK BOUNDARY TYPES
     */
    public enum TASK_BOUNDARY_TYPES {
        _DATA_BOUNDARY_ONE,
        _DATA_BOUNDARY_TWO,
    }


    public static final String FILE_CSV = "csv";
    public static final String FILE_JSON = "json";
    public static final String FILE_TXT = "txt";
    public static final String FILE_XML = "xml";
    public static final String XML_START_CHARS = "<?xml version=";
    public static final String INVALID_JSON_STRING = "invalid json string";
    public static final String UNSUPPORTED_INPUT_FILE_TYPE = "unsupported input file type";
    public static final String INVALID_MODEL_NAME = "model name already exists";
    public static final String TOKEN_LABEL = "token";
    public static final String GIT_REPO_ERROR = "git repo could not be accessed";
    public static final String NAME_MISSING = "provide name";
    public static final String GIT_URL_MISSING = "provide repo url";
    public static final String EXECUTABLE_TYPE_MISSING = "provide executable type";
    public static final String COMMAND_MISSING = "provide model run command";
}
