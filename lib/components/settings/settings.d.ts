import { LitElement } from "lit-element";
import { MDCSwitch } from "@material/switch";
export default class SettingsCard extends LitElement {
    readonly list_element?: any;
    readonly switch_elements?: Array<any>;
    switches: Map<string, MDCSwitch>;
    settings: Map<string, any>;
    constructor();
    firstUpdated(): void;
    static get styles(): import("lit-element").CSSResult[];
    private setting_switch;
    render(): import("lit-element").TemplateResult;
}
