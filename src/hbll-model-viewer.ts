import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";
import SettingsCard from "./components/settings/settings";
import EditCard from "./components/edit/edit";
import ShareDialog from "./components/share/share";

import { MDCSwitch } from "@material/switch";
import { customElement } from "lit-element";

let el = document.querySelector(".mdc-switch");
if (el != undefined) {
  const switchControl = new MDCSwitch(el);
}

export const HbllModelViewerElement = HbllModelViewerElementBase;
export const SettingsCardElement = SettingsCard;
export const EditCardElement = EditCard;
export const ShareDialogElement = ShareDialog;

export type HbllModelViewerElement = InstanceType<
  typeof HbllModelViewerElement
>;
export type SettingsCardElement = InstanceType<typeof SettingsCardElement>;
export type EditCardElement = InstanceType<typeof EditCardElement>;
export type ShareDialogElement = InstanceType<typeof ShareDialogElement>;

customElements.define("hbll-model-viewer", HbllModelViewerElement);
customElements.define("settings-card", SettingsCardElement);
customElements.define("edit-card", EditCardElement);
customElements.define("share-dialog", ShareDialogElement);

declare global {
  interface HTMLElementTagNameMap {
    "hbll-model-viewer": HbllModelViewerElement;
    "settings-card": SettingsCardElement;
    "edit-card": EditCardElement;
    "share-dialog": ShareDialogElement;
  }
}
