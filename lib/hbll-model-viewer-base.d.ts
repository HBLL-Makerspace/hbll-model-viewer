import { LitElement } from "lit-element";
export default class HbllModelViewerElementBase extends LitElement {
    readonly modelViewer?: any;
    readonly downloader?: any;
    src: string | null;
    skybox_image: string | null;
    annotations: any | null;
    cameraIsDirty: boolean;
    hotspots: any[];
    constructor();
    firstUpdated(): Promise<void>;
    private onDragover;
    private onDrop;
    private handleClick;
    private cameraMoved;
    private saveAnnotations;
    static get styles(): import("lit-element").CSSResult;
    render(): import("lit-element").TemplateResult;
}
