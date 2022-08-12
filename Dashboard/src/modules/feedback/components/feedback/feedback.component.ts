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

import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { FEEDBACK_CONSTANTS } from 'src/modules/common';
import { Feedback } from 'src/modules/common/models/custom';
import { ApiService } from 'src/modules/common/services/api/api.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedBackForm: FormGroup;
  token: string;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.feedBackForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose(
        [Validators.email, Validators.required])),
      feedback: new FormControl('', Validators.required)

    });
  }

  get name() { return this.feedBackForm.get('name'); }
  get email() { return this.feedBackForm.get('email'); }
  get feedback() { return this.feedBackForm.get('feedback'); }
  onSubmitFeedbackForm() {
    const value = this.feedBackForm.value;
    value['timestamp'] = Date.now();
    const feedback: Feedback = {contact: value['name'] + ' ' + value['email'], feedback: value['feedback'], user: null};
    this.apiService.postFeedback(feedback).subscribe(response => {
      alert(FEEDBACK_CONSTANTS.FEEDBACK_SUBMITTED);
      this.feedback.reset();
    }, error => {
      alert(FEEDBACK_CONSTANTS.FEEDBACK_SUBMISSION_FAILED);
    });
  }

}
