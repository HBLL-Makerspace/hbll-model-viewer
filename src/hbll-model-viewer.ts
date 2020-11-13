import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";

import { MDCSwitch } from "@material/switch";
import { MDCRipple } from "@material/ripple";

let icon_button_element = document.querySelector(".mdc-icon-button");
if (icon_button_element != undefined) {
  const iconButtonRipple = new MDCRipple(icon_button_element);
  iconButtonRipple.unbounded = true;
}

let el = document.querySelector(".mdc-switch");
if (el != undefined) {
  const switchControl = new MDCSwitch(el);
}

export const HbllModelViewerElement = HbllModelViewerElementBase;

export type HbllModelViewerElement = InstanceType<
  typeof HbllModelViewerElement
>;

customElements.define("hbll-model-viewer", HbllModelViewerElement);

declare global {
  interface HTMLElementTagNameMap {
    "hbll-model-viewer": HbllModelViewerElement;
  }
}
