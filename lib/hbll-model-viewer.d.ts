import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";
import SettingsCard from "./components/settings/settings";
import EditCard from "./components/edit/edit";
export declare const HbllModelViewerElement: typeof HbllModelViewerElementBase;
export declare const SettingsCardElement: typeof SettingsCard;
export declare const EditCardElement: typeof EditCard;
export declare type HbllModelViewerElement = InstanceType<typeof HbllModelViewerElement>;
export declare type SettingsCardElement = InstanceType<typeof SettingsCardElement>;
export declare type EditCardElement = InstanceType<typeof EditCardElement>;
declare global {
    interface HTMLElementTagNameMap {
        "hbll-model-viewer": HbllModelViewerElement;
        "settings-card": SettingsCardElement;
        "edit-card": EditCardElement;
    }
}
