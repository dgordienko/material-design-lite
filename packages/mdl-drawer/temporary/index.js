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
import MDLTemporaryDrawerFoundation from './foundation';

export default class MDLTemporaryDrawer extends MDLComponent {
  static buildDom() {
    const {ROOT: CSS_ROOT} = MDLTemporaryDrawerFoundation.cssClasses;

    const root = document.createElement('aside');
    root.classList.add(CSS_ROOT);
    root.innerHTML = `<nav class="${CSS_ROOT}__drawer"></nav>`;

    return root;
  }

  static attachTo(root) {
    return new MDLTemporaryDrawer(root);
  }

  /* Remap touch events to pointer events, if the browser supports them. */
  static remapEvent(eventName) {
    if (this.usePointerEvents_ === undefined) {
      this.usePointerEvents_ = Boolean(window.PointerEvent);
    }

    if (this.usePointerEvents_) {
      switch (eventName) {
        case 'touchstart':
          return 'pointerdown';
        case 'touchmove':
          return 'pointermove';
        case 'touchend':
          return 'pointerup';
        default:
          return eventName;
      }
    }

    return eventName;
  }

  static get transformPropertyName() {
    if (this.transformPropertyName_ === undefined) {
      const el = document.createElement('div');
      this.transformPropertyName_ = ('transform' in el.style ? 'transform' : '-webkit-transform');
    }
    return this.transformPropertyName_;
  }

  static get supportsCSSCustomProperties() {
    if (this.supportsCSSCustomProperties_ === undefined) {
      this.supportsCSSCustomProperties_ = CSS.supports('(--color: red)');
    }
    return this.supportsCSSCustomProperties_;
  }

  get open() {
    return this.foundation_.isOpen();
  }

  set open(value) {
    if (value) {
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  /* Return the drawer element inside the component. */
  get drawer() {
    return this.root_.querySelector(MDLTemporaryDrawerFoundation.strings.DRAWER_SELECTOR);
  }

  getDefaultFoundation() {
    const {FOCUSABLE_ELEMENTS, OPACITY_VAR_NAME, TAB_DATA, TAB_DATA_HANDLED} = MDLTemporaryDrawerFoundation.strings;

    return new MDLTemporaryDrawerFoundation({
      addClass: className => this.root_.classList.add(className),
      removeClass: className => this.root_.classList.remove(className),
      hasClass: className => this.root_.classList.contains(className),
      hasNecessaryDOM: () => Boolean(this.drawer),
      registerComponentInteractionHandler: (evt, handler) =>
          this.root_.addEventListener(MDLTemporaryDrawer.remapEvent(evt), handler),
      deregisterComponentInteractionHandler: (evt, handler) =>
          this.root_.removeEventListener(MDLTemporaryDrawer.remapEvent(evt), handler),
      registerDrawerInteractionHandler: (evt, handler) =>
          this.drawer.addEventListener(MDLTemporaryDrawer.remapEvent(evt), handler),
      deregisterDrawerInteractionHandler: (evt, handler) =>
          this.drawer.removeEventListener(MDLTemporaryDrawer.remapEvent(evt), handler),
      registerTransitionEndHandler: handler => this.drawer.addEventListener('transitionend', handler),
      deregisterTransitionEndHandler: handler => this.drawer.removeEventListener('transitionend', handler),
      getDrawerWidth: () => this.drawer.offsetWidth,
      setTranslateX: value => this.drawer.style.setProperty(
          MDLTemporaryDrawer.transformPropertyName, `translateX(${value}px)`),
      updateComponentBackground: value => {
        if (MDLTemporaryDrawer.supportsCSSCustomProperties) {
          this.root_.style.setProperty(OPACITY_VAR_NAME, value);
        }
      },
      getFocusableElements: () => Array.from(this.drawer.querySelectorAll(FOCUSABLE_ELEMENTS)),
      saveElementTabState: el => {
        if (el.hasAttribute('tabindex')) {
          el.setAttribute(TAB_DATA, el.getAttribute('tabindex'));
        }
        el.setAttribute(TAB_DATA_HANDLED, true);
      },
      restoreElementTabState: el => {
        // Only modify elements we've already handled, in case anything was dynamically added since we saved state.
        if (el.hasAttribute(TAB_DATA_HANDLED)) {
          if (el.hasAttribute(TAB_DATA)) {
            el.setAttribute('tabindex', el.getAttribute(TAB_DATA));
            el.removeAttribute(TAB_DATA);
          } else {
            el.removeAttribute('tabindex');
          }
          el.removeAttribute(TAB_DATA_HANDLED);
        }
      },
      makeElementUntabbable: el => el.setAttribute('tabindex', -1),
      isRightSide: () => getComputedStyle(this.root_).direction === 'rtl'
    });
  }
}
