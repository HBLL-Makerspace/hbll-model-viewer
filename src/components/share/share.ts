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
import { settings_stlye } from "./share.css";

import { MDCList } from "@material/list";
import { MDCRipple } from "@material/ripple";
import { MDCDialog } from "@material/dialog";

var dialog;

export default class ShareDialog extends LitElement {
  @query(".mdc-dialog") readonly mdc_dialog?: HTMLElement;
  @query(".mdc-dialog .mdc-list") readonly mdc_list?: HTMLElement;
  @query("#embed-option") readonly embed_option?: any;
  @query("#website-option") readonly website_option?: HTMLElement;

  constructor() {
    super();
  }

  firstUpdated() {
    if (this.mdc_dialog !== undefined && this.mdc_list !== undefined) {
      dialog = new MDCDialog(this.mdc_dialog);
      const list = new MDCList(this.mdc_list);

      dialog.listen("MDCDialog:opened", () => {
        list.layout();
      });
      dialog.listen("MDCDialog:closed", (type) => {
        if (type.detail.action === "accept") {
          let event = new CustomEvent("copy", {
            detail: { embeded: this.embed_option?.checked },
            bubbles: true,
            composed: true,
          });
          this.dispatchEvent(event);
        }
      });
    }
  }

  static get styles() {
    return [settings_stlye, mat_styles];
  }

  render() {
    return html` <div class="share-button">
        <button
          class="mdc-icon-button material-icons mdc-menu-surface--anchor"
          @click=${(_) => {
            dialog?.open();
          }}
        >
          share
        </button>
      </div>
      <div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div
            class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content"
          >
            <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
            <h2
              class="mdc-dialog__title mdc-theme--on-surface"
              id="my-dialog-title"
            >
              How would you like to share?
            </h2>
            <div class="mdc-dialog__content" id="my-dialog-content">
              <ul class="mdc-list">
                <li class="mdc-list-item" tabindex="0">
                  <span class="mdc-list-item__graphic">
                    <div class="mdc-radio">
                      <input
                        class="mdc-radio__native-control"
                        type="radio"
                        id="website-option"
                        name="option"
                        checked
                      />
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                    </div>
                  </span>
                  <label
                    id="test-dialog-baseline-confirmation-radio-1-label"
                    for="website-option"
                    class="mdc-list-item__text"
                    >Website link</label
                  >
                </li>
                <li class="mdc-list-item" tabindex="1">
                  <span class="mdc-list-item__graphic">
                    <div class="mdc-radio">
                      <input
                        class="mdc-radio__native-control"
                        type="radio"
                        name="option"
                        id="embed-option"
                      />
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                    </div>
                  </span>
                  <label
                    id="test-dialog-baseline-confirmation-radio-1-label"
                    for="embed-option"
                    class="mdc-list-item__text"
                    >Embeded</label
                  >
                </li>
              </ul>
            </div>
            <div class="mdc-dialog__actions">
              <button
                type="button"
                id="cancel-btn"
                class="mdc-button mdc-dialog__button mdc-theme--secondary"
                data-mdc-dialog-action="close"
              >
                <span class="mdc-button__ripple"></span>
                <span class="mdc-button__label">Cancel</span>
              </button>
              <button
                type="button"
                id="copy-btn"
                class="mdc-button mdc-dialog__button mdc-theme--secondary"
                data-mdc-dialog-action="accept"
              >
                <span class="mdc-button__ripple"></span>
                <span class="mdc-button__label">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>`;
  }
}
