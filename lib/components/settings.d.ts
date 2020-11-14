import { LitElement } from "lit-element";
import { MDCSwitch } from "@material/switch";
export default class SettingsCard extends LitElement {
    readonly annotation_switch_element?: any;
    readonly list_element?: any;
    showAnnotations: boolean;
    annotation_checkbox: MDCSwitch | null;
    constructor();
    firstUpdated(): void;
    static get styles(): import("lit-element").CSSResult[];
    private handleShowAnnotationClick;
    render(): import("lit-element").TemplateResult;
}
