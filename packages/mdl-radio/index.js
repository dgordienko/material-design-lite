/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDLComponent from 'mdl-base';
import MDLRipple, {MDLRippleFoundation} from 'mdl-ripple';

import MDLRadioFoundation from './foundation';

export {MDLRadioFoundation};

export default class MDLRadio extends MDLComponent {
  // TODO buildDom

  static attachTo(root) {
    return new MDLRadio(root);
  }

  constructor() {
    super(...arguments);
    this.ripple_ = this.initRipple_();
  }

  initRipple_() {
    // TODO
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  getDefaultFoundation() {
    return new MDLRadioFoundation({
      getNativeControl: () => this.root_.querySelector(MDLRadioFoundation.strings.NATIVE_CONTROL_SELECTOR)
    });
  }
}
