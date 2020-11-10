import { LitElement } from "lit-element";
import { AnnotationData, Annotation } from "./types/annotations.js";
export default class HbllModelViewerElementBase extends LitElement {
    readonly modelViewer?: any;
    readonly downloader?: any;
    src: string | null;
    annotation_src: string | null;
    skybox_image: string | null;
    annotations: AnnotationData | null;
    cameraIsDirty: boolean;
    currentAnnotation: Annotation | undefined;
    buttonStyles: any;
    constructor();
    firstUpdated(): Promise<void>;
    private onDragover;
    private onDrop;
    private handleClick;
    private cameraMoved;
    private saveAnnotations;
    private saveCameraOrbit;
    private annotationClick;
    private no_model_msg;
    private nav_label;
    private nextAnnotaion;
    private previousAnnotaion;
    static get styles(): import("lit-element").CSSResult;
    render(): import("lit-element").TemplateResult;
}
