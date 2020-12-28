import { LitElement } from "lit-element";
import { MDCSwitch } from "@material/switch";
import { Annotation } from "../../types/annotations";
import "@simonwep/pickr/dist/themes/nano.min.css";
import Pickr from "@simonwep/pickr";
export default class EditCard extends LitElement {
    readonly list_element?: any;
    readonly annotation_list?: HTMLElement | undefined;
    readonly switch_elements?: Array<any>;
    annotations: Array<Annotation> | undefined;
    downloading: boolean | undefined;
    switches: Map<string, MDCSwitch>;
    settings: Map<string, any>;
    pickrs: Map<string, Pickr>;
    constructor();
    firstUpdated(): void;
    updated(_: any): void;
    private change_index;
    static get styles(): import("lit-element").CSSResult[];
    private add_annotation_button;
    private change_name;
    private _pickr;
    private _anotation;
    private change_annotation_color;
    private remove_annotation;
    private download_event;
    render(): import("lit-element").TemplateResult;
}
