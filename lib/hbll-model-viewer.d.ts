import "@google/model-viewer";
import HbllModelViewerElementBase from "./hbll-model-viewer-base";
import SettingsCard from "./components/settings/settings";
import EditCard from "./components/edit/edit";
import ShareDialog from "./components/share/share";
export declare const HbllModelViewerElement: typeof HbllModelViewerElementBase;
export declare const SettingsCardElement: typeof SettingsCard;
export declare const EditCardElement: typeof EditCard;
export declare const ShareDialogElement: typeof ShareDialog;
export declare type HbllModelViewerElement = InstanceType<typeof HbllModelViewerElement>;
export declare type SettingsCardElement = InstanceType<typeof SettingsCardElement>;
export declare type EditCardElement = InstanceType<typeof EditCardElement>;
export declare type ShareDialogElement = InstanceType<typeof ShareDialogElement>;
declare global {
    interface HTMLElementTagNameMap {
        "hbll-model-viewer": HbllModelViewerElement;
        "settings-card": SettingsCardElement;
        "edit-card": EditCardElement;
        "share-dialog": ShareDialogElement;
    }
}
