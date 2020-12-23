import {
  html,
  LitElement,
  property,
  css,
  query,
  internalProperty,
  customElement,
  queryAll,
} from "lit-element";

import { mat_styles } from "../../material.css";
import { settings_stlye } from "./settings.css";

import { MDCList } from "@material/list";
import { MDCRipple } from "@material/ripple";
import { MDCCheckbox } from "@material/checkbox";
import { MDCSwitch } from "@material/switch";

export default class SettingsCard extends LitElement {
  @query(".mdc-list") readonly list_element?: any;
  @queryAll(".mdc-switch") readonly switch_elements?: Array<any>;

  @internalProperty()
  switches: Map<string, MDCSwitch> = new Map<string, MDCSwitch>();

  @internalProperty()
  settings: Map<string, any> = new Map<string, any>([
    ["showAnnotations", true],
    ["showTextures", true],
    ["showDimenions", false],
  ]);

  constructor() {
    super();
  }

  firstUpdated() {
    this.switch_elements?.forEach((s: HTMLElement) => {
      this.switches[s.id] = new MDCSwitch(s);
      if (this.settings[s.id] != null)
        this.switches[s.id].checked = this.settings.get(s.id);
    });

    const list = new MDCList(this.list_element);
    const listItemRipples = list.listElements.map(
      (listItemEl) => new MDCRipple(listItemEl)
    );
  }

  static get styles() {
    return [settings_stlye, mat_styles];
  }

  private setting_switch(label: string, setting_id: string) {
    let checked = this.settings.get(setting_id);
    return html`<li
      class="mdc-list-item"
      tabindex="0"
      @click=${(e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        this.settings.set(setting_id, !this.settings.get(setting_id));

        let myEvent = new CustomEvent("settings-update", {
          detail: { settings: this.settings },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(myEvent);
        this.requestUpdate();
      }}
    >
      <span class="mdc-list-item__ripple"></span>
      <span class="mdc-list-item__text">${label}</span>
      <span class="mdc-list-item__meta">
        <div
          class="mdc-switch ${checked ? "mdc-switch--checked" : ""}"
          id="${setting_id}"
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
              ?checked=${checked}
            />
          </div>
        </div>
      </span>
    </li>`;
  }

  render() {
    return html`<div class="mdc-card my-card">
      <div class="mdc-card__content">
        <h1 class="mdc-typography--headline4 mdc-theme--on-surface">
          Settings
        </h1>
        <ul class="mdc-list">
          ${this.setting_switch("Show annotations", "showAnnotations")}
          ${this.setting_switch("Show textures", "showTextures")}
          ${this.setting_switch("Show dimensions", "showDimensions")}
        </ul>
      </div>
    </div>`;
  }
}
