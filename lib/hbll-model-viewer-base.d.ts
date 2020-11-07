import { LitElement } from "lit-element";
import { AnnotationData, Annotation } from "./types/annotations.js";
export default class HbllModelViewerElementBase extends LitElement {
    readonly modelViewer?: any;
    readonly downloader?: any;
    src: string | null;
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
    private annotationClick;
    static get styles(): import("lit-element").CSSResult;
    render(): import("lit-element").TemplateResult;
}
