import {
  html,
  LitElement,
  property,
  css,
  query,
  internalProperty,
  customElement,
  queryAll,
} from "lit-element";

import { mat_styles } from "../../material.css";
import { settings_stlye } from "./edit.css";

import { MDCList } from "@material/list";
import { MDCRipple } from "@material/ripple";
import { MDCCheckbox } from "@material/checkbox";
import { MDCSwitch } from "@material/switch";
import { AnnotationData, Annotation } from "../../types/annotations";
import Picker from "vanilla-picker";

import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

export default class EditCard extends LitElement {
  @query(".mdc-list") readonly list_element?: any;
  @query("#annotation_list") readonly annotation_list?: any;
  @queryAll(".mdc-switch") readonly switch_elements?: Array<any>;

  @property() annotations: Array<Annotation> | undefined = [];

  @internalProperty()
  switches: Map<string, MDCSwitch> = new Map<string, MDCSwitch>();

  @internalProperty()
  settings: Map<string, any> = new Map<string, any>([
    ["showAnnotations", true],
    ["showTextures", true],
  ]);

  @internalProperty()
  pickers: Map<number, Picker> = new Map<number, Picker>();

  // annotation_list_sortable: any;

  constructor() {
    super();
  }

  firstUpdated() {
    this.switch_elements?.forEach((s: HTMLElement) => {
      this.switches[s.id] = new MDCSwitch(s);
      if (this.settings[s.id] != null)
        this.switches[s.id].checked = this.settings.get(s.id);
    });

    const list = new MDCList(this.list_element);
    const listItemRipples = list.listElements.map(
      (listItemEl) => new MDCRipple(listItemEl)
    );
    // this.annotation_list_sortable = Sortable.create(this.annotation_list, {
    //   onEnd: (event) => {
    //     this.requestUpdate();
    //     // this.change_index(event.oldIndex, event.newIndex);
    //   },
    // });
  }

  updated(_) {
    console.log("Updated");
    this.annotations?.forEach((el) => {
      var name = this.shadowRoot?.getElementById(el.uid);
      if (name != undefined) name.innerHTML = el.name || "";
    });
  }

  private change_index(oldIndex: number, newIndex: number) {
    let myEvent = new CustomEvent("change-index", {
      detail: { oldIndex: oldIndex, newIndex: newIndex },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(myEvent);
  }

  static get styles() {
    return [settings_stlye, mat_styles];
  }

  private add_annotation_button() {
    return html`<li
      class="mdc-list-item"
      tabindex="0"
      @click=${(e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        let myEvent = new CustomEvent("edit-add-mode", {
          detail: {},
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(myEvent);
      }}
    >
      <span class="mdc-list-item__ripple"></span>
      <span class="mdc-list-item__text">Add Annotation</span>
      <span class="mdc-list-item__meta"> </span>
    </li>`;
  }

  private change_name(name: string | undefined, new_name: string) {
    let myEvent = new CustomEvent("change-name", {
      detail: { name: name || "null", new_name: new_name },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(myEvent);
  }

  private _anotation(annotation: Annotation, index: number) {
    // var picker = new Picker({
    //   parent: this.parentElement || new HTMLElement(),
    // });
    // this.pickers.set(index, picker);
    return html`<li class="mdc-list-item" tabindex="0" draggable="true" @dragstart=${(
      e
    ) => e.dataTransfer.setData("index", index)} @drop=${(e) =>
      this.change_index(e.dataTransfer.getData("index"), index)}>
      <span class="mdc-list-item__ripple"></span>
      <span class="mdc-list-item__text"
        ></div>
        ${index + 1}. <span id="${
      annotation.uid
    }" contenteditable="true" @focusout=${(e) => {
      this.change_name(
        annotation.name,
        e.target.innerText.replaceAll(/(\r\n|\n|\r)/gm, " ")
      );
    }}>${annotation.name}</span></span
      >
      <span class="mdc-list-item__meta"><span class="color-box" style="background-color: ${
        annotation.fill_color
      };" @click=${(e: Event) => {}}></span><span class="close" @click=${(
      e
    ) => {
      this.remove_annotation(index);
    }}></span></span>
    </li>`;
  }

  private remove_annotation(index: number) {
    let myEvent = new CustomEvent("remove-annotation", {
      detail: { index: index },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(myEvent);
  }

  private download_event() {
    let myEvent = new CustomEvent("download-request", {
      detail: {},
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(myEvent);
  }

  render() {
    console.log("rendered");
    // delete this.annotation_list_sortable;
    return html`<div class="mdc-card my-card">
      <div class="mdc-card__content">
        <h1 class="mdc-typography--headline4 mdc-theme--on-surface">
          Edit
          <span
            ><button
              class="mdc-icon-button material-icons"
              @click=${(e: Event) => {
                // this.download();
                e.stopPropagation();
                e.preventDefault();
                this.download_event();
              }}
            >
              download
            </button></span
          >
        </h1>
        <ul class="mdc-list annotation-list" id="annotation_list">
          ${this.annotations?.map((v, i) => {
            return this._anotation(v, i);
          })}
          ${this.add_annotation_button()}
        </ul>
      </div>
    </div>`;
  }
}
