#  Copyright 2022 IBM Corporation
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

import os
import uuid
from flask import Flask, Blueprint, render_template, request, escape, jsonify
from flask_swagger import swagger
from swagger_ui_bundle import swagger_ui_path
from multiprocessing import Process

import k8s

swaggerapi = Blueprint('swagger_ui', __name__, static_url_path='', static_folder=swagger_ui_path, template_folder=swagger_ui_path)

SWAGGER_UI_CONFIG = {
    "openapi_spec_url": "/spec"
}

app = Flask(__name__)

@swaggerapi.route('/')
def swagger_ui_index():
    return render_template('index.j2', **SWAGGER_UI_CONFIG)

@app.route("/spec")
def spec():
    swag = swagger(app)
    swag['info']['version'] = "0.1"
    swag['info']['title'] = "JobSubmission API"
    return jsonify(swag)

@app.route("/check/<job_run_id>", methods=["GET"])
def status_check(job_run_id):
    """
        Checks whether a given jobid is currently running.
        ---
        parameters:
          - name: job_run_id
            in: path
            type: string
            required: true
            description: String representing the id of the job submitted.
        responses:
            200:
                description: Valid response from server (contains payload with actual status).
            404:
                description: Not Found.
            405:
                description: Method not allowed.
    """
    job_run_id = escape(job_run_id)

    status_all = []
    state_all = []
    msg_all = []

    k8s_state = k8s.job_status(job_run_id)

    for row in k8s_state:
        status = 200
        state = "NA"
        msg = "NA"

        jid, state = row[0], row[1]
        try:
            if state == "active":
                msg = f"Job {jid} is running."
                status = 200
            elif state == "succeeded":
                msg = f"Job {jid} has finished successfully."
                status = 200
            elif state == "failed":
                msg = f"Job {jid} has failed. Check the logs."
                status = 200
            elif state == "not_found":
                status = 404
                msg = f"Job for model run ID {jid} not found. It has been deleted or never submitted."
            else:
                status = 405
                msg = f"Unsupported job state {state}. Check the logs."
        except Exception as e:
            status = 500
            msg = e

        status_all.append(status)
        state_all.append(state)
        msg_all.append(msg)

    resp = {"status": status_all, "state": state_all, "message": msg_all}
    return resp, 200


@app.route("/submit", methods=["POST"])
def submit():
    """
        Creates a new job to perform action for the given arguments.
        ---
        parameters:
          - in: body
            name: body
            schema:
              id: JobRequestObject
              required:
                  - type
              properties:
                 type:
                   type: string
                   description: The type of job which is being requested.
                 args:
                   type: object
                   description: The dictionary of environment variables defining the job.

        responses:
            200:
                description: Valid response from server (contains payload with actual status).
            404:
                description: Not Found.
            405:
                description: Method not allowed.
    """
    metadata = request.json
    job_id = str(uuid.uuid4())+"-"+metadata["type"]

    status = 202
    msg = f"Attempting to create Job ID {job_id} for request {metadata['args']}."

    check = status_check(job_id)
    if check[0] and check[0]["status"] and check[0]["status"][0] == 404:
        job = Process(
            target=k8s.run_job, args=(job_id, metadata["args"]), daemon=True
        )
        job.start()
    else:
        status, msg = 404, "already running a job for the given id"

    resp = {
        "status": status,
        "job_id": job_id,
        "message": msg,
        "request": metadata,
    }
    return resp, status

app.register_blueprint(swaggerapi, url_prefix = "/ui")

if __name__ == "__main__":
    port = int(os.getenv('PORT', 8089))
    app.run(host="0.0.0.0", port=port)
