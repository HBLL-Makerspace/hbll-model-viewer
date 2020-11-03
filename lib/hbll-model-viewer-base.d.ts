import { LitElement } from "lit-element";
export default class HbllModelViewerElementBase extends LitElement {
    constructor();
    src: string | null;
    skybox_image: string | null;
    static get styles(): import("lit-element").CSSResult;
    render(): import("lit-element").TemplateResult;
}
