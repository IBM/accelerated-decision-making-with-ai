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
from flask import Flask, Blueprint, render_template, request, escape, jsonify
from flask_swagger import swagger
from swagger_ui_bundle import swagger_ui_path
from flask_restx import Api, Resource
from werkzeug.datastructures import FileStorage
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.utils import secure_filename
import utils


app = Flask(__name__)
api = Api(app)

upload_parser = api.parser()
upload_parser.add_argument('file', type=FileStorage, location='files',required=True)
upload_parser.add_argument('data_repository_configuration_ID', type=str,required=True)

path = os.getcwd()
# file Upload
UPLOAD_FOLDER = os.path.join(path, 'pushed_datasets')

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'csv', 'json'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

 

@api.route('/datapush')
@api.expect(upload_parser)
class CollectData(Resource):
    def post(self):
        args = upload_parser.parse_args()
        file = args.get('file')
        data_repository_configuration_ID = args.get('data_repository_configuration_ID')

        # appendNewname = "monthly-data"
        appendNewname = os.path.splitext(file.filename)[0].lower()

        url=os.path.join(UPLOAD_FOLDER,appendNewname)

        # check if the post request has the file part
        if 'file' not in request.files:
            response = api.make_response({'Failed': 'No file part.... :)'}, 400)
        file = request.files['file']
        if file.filename == '':
            response = api.make_response({'Failed': 'No file selected for uploading.... :)'}, 400)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], appendNewname))
            response = api.make_response({'File': file_name + ' successfully uploaded.... :)'}, 200)
        else:
            response = api.make_response({'Failed': 'Allowed file types are csv.... :)'}, 400)
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Platform, Version'
        response.headers['Access-Control-Allow-Methods'] = 'OPTIONS, TRACE, GET, HEAD, POST, PUT, DELETE'

        utils.dbpush(url, data_repository_configuration_ID, appendNewname)
        return response

# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == "__main__":
    port = int(os.getenv('PORT', 8090))
    app.run(host="0.0.0.0", port=port)
