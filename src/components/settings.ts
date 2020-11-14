import {
  html,
  LitElement,
  property,
  css,
  query,
  internalProperty,
  customElement,
} from "lit-element";

import { mat_styles } from "../material.css";
import { settings_stlye } from "./settings.css";

import { MDCList } from "@material/list";
import { MDCRipple } from "@material/ripple";
import { MDCCheckbox } from "@material/checkbox";
import { MDCSwitch } from "@material/switch";

export default class SettingsCard extends LitElement {
  @query("#show-annotation-switch") readonly annotation_switch_element?: any;
  @query(".mdc-list") readonly list_element?: any;

  @internalProperty()
  showAnnotations: boolean = true;

  @internalProperty()
  annotation_checkbox: MDCSwitch | null = null;

  constructor() {
    super();
  }

  firstUpdated() {
    this.annotation_checkbox = new MDCSwitch(this.annotation_switch_element);

    const list = new MDCList(this.list_element);
    const listItemRipples = list.listElements.map(
      (listItemEl) => new MDCRipple(listItemEl)
    );

    this.showAnnotations = true;
    this.annotation_checkbox.checked = true;
  }

  static get styles() {
    return [settings_stlye, mat_styles];
  }

  private async handleShowAnnotationClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.showAnnotations = !this.showAnnotations;
    let myEvent = new CustomEvent("show-annotations", {
      detail: { showAnnotations: this.showAnnotations },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(myEvent);

    await this.updateComplete;
    if (this.annotation_checkbox != null) {
      this.annotation_checkbox.checked = this.showAnnotations;
    }
  }

  render() {
    return html`<div class="mdc-card my-card">
      <div class="mdc-card__content">
        <h1 class="mdc-typography--headline4">Settings</h1>
        <ul class="mdc-list">
          <li
            class="mdc-list-item"
            tabindex="0"
            @click=${this.handleShowAnnotationClick}
          >
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">Show annotations</span>
            <span class="mdc-list-item__meta">
              <div
                class="mdc-switch ${this.showAnnotations
                  ? "mdc-switch--checked"
                  : ""}"
                id="show-annotation-switch"
              >
                <div class="mdc-switch__track"></div>
                <div class="mdc-switch__thumb-underlay">
                  <div class="mdc-switch__thumb"></div>
                  <input
                    type="checkbox"
                    id="basic-switch"
                    class="mdc-switch__native-control"
                    role="switch"
                    aria-checked="false"
                  />
                </div>
              </div>
            </span>
          </li>
        </ul>
      </div>
    </div>`;
  }
}
