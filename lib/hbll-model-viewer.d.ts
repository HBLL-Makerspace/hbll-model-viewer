import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";
export declare const HbllModelViewerElement: typeof HbllModelViewerElementBase;
export declare type HbllModelViewerElement = InstanceType<typeof HbllModelViewerElement>;
declare global {
    interface HTMLElementTagNameMap {
        "hbll-model-viewer": HbllModelViewerElement;
    }
}
