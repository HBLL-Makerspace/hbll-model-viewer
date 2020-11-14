import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";
import SettingsCard from "./components/settings";
export declare const HbllModelViewerElement: typeof HbllModelViewerElementBase;
export declare const SettingsCardElement: typeof SettingsCard;
export declare type HbllModelViewerElement = InstanceType<typeof HbllModelViewerElement>;
export declare type SettingsCardElement = InstanceType<typeof SettingsCardElement>;
declare global {
    interface HTMLElementTagNameMap {
        "hbll-model-viewer": HbllModelViewerElement;
        "settings-card": SettingsCardElement;
    }
}
