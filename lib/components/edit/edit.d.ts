import { LitElement } from "lit-element";
import { MDCSwitch } from "@material/switch";
import { Annotation } from "../../types/annotations";
import Picker from "vanilla-picker";
export default class EditCard extends LitElement {
    readonly list_element?: any;
    readonly annotation_list?: any;
    readonly switch_elements?: Array<any>;
    annotations: Array<Annotation> | undefined;
    switches: Map<string, MDCSwitch>;
    settings: Map<string, any>;
    pickers: Map<number, Picker>;
    constructor();
    firstUpdated(): void;
    updated(_: any): void;
    private change_index;
    static get styles(): import("lit-element").CSSResult[];
    private add_annotation_button;
    private change_name;
    private _anotation;
    private remove_annotation;
    private download_event;
    render(): import("lit-element").TemplateResult;
}
