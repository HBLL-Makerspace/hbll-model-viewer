import { LitElement } from "lit-element";
export default class ShareDialog extends LitElement {
    readonly mdc_dialog?: HTMLElement;
    readonly mdc_list?: HTMLElement;
    readonly embed_option?: any;
    readonly website_option?: HTMLElement;
    constructor();
    firstUpdated(): void;
    static get styles(): import("lit-element").CSSResult[];
    render(): import("lit-element").TemplateResult;
}
