import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";
import SettingsCard from "./components/settings";

import { MDCSwitch } from "@material/switch";

let el = document.querySelector(".mdc-switch");
if (el != undefined) {
  const switchControl = new MDCSwitch(el);
}

export const HbllModelViewerElement = HbllModelViewerElementBase;
export const SettingsCardElement = SettingsCard;

export type HbllModelViewerElement = InstanceType<
  typeof HbllModelViewerElement
>;
export type SettingsCardElement = InstanceType<typeof SettingsCardElement>;

customElements.define("hbll-model-viewer", HbllModelViewerElement);
customElements.define("settings-card", SettingsCardElement);

declare global {
  interface HTMLElementTagNameMap {
    "hbll-model-viewer": HbllModelViewerElement;
    "settings-card": SettingsCardElement;
  }
}
