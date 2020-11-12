import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";
// import { MDCSwitch } from "@material/switch";

// let el = document.querySelector(".mdc-switch");
// let switchControl;
// if (el != null) {
//   switchControl = new MDCSwitch(el);
// }

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
