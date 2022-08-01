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

import { Injectable } from '@angular/core';

import {State} from '../../models/state';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private store: BehaviorSubject<State>;
  changes: Observable<State>;

  constructor() {
    this.store = new BehaviorSubject<State>(new State());
    this.changes = this.store.asObservable();
  }

  /**
   * Returns a snapshot of the current state of the store
   */
  get state(): State {
    return this.store.value;
  }

  /**
   * Replace the whole state of the store
   */
  set state(state: State) {
    this.store.next(state);
  }

  /**
   * Adds a new property to the store with a new value
   */
  add(prop: string, state: any) {
    this.state = Object.assign({}, this.state, { [prop]: state });
    localStorage.setItem(prop, JSON.stringify(state));
  }

  /**
   * Updates a property of the store with a new value
   */
  update(prop: string, state: any) {
    this.state = Object.assign({}, this.state, { [prop]: state });
    try {
      localStorage.setItem(prop, JSON.stringify(state));
    } catch (e) {

    }
  }

  /**
   * Deletes a property from the store
   */
  delete(prop: string) {
    this.state = Object.assign({}, this.state, { [prop]: null });
    localStorage.removeItem(prop);
  }

  /**
   * Clear the state of the store
   */
  clear() {
    this.store.next(new State());
    localStorage.clear();
  }
}
