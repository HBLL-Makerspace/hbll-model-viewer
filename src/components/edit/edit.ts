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

import "@simonwep/pickr/dist/themes/nano.min.css";
import Pickr from "@simonwep/pickr";

import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

export default class EditCard extends LitElement {
  @query(".mdc-list") readonly list_element?: any;
  @query("#annotation_list") readonly annotation_list?: HTMLElement | undefined;
  @queryAll(".mdc-switch") readonly switch_elements?: Array<any>;

  @property() annotations: Array<Annotation> | undefined = [];
  @property() downloading: boolean | undefined;

  @internalProperty()
  switches: Map<string, MDCSwitch> = new Map<string, MDCSwitch>();

  @internalProperty()
  settings: Map<string, any> = new Map<string, any>([
    ["showAnnotations", true],
    ["showTextures", true],
  ]);

  pickrs: Map<string, Pickr> = new Map<string, Pickr>();

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
  }

  updated(_) {
    this.annotations?.forEach((el) => {
      var name = this.shadowRoot?.getElementById(el.uid);
      if (name != undefined) name.innerHTML = el.name || "";

      // this.pickrs.set(el.uid, undefined);
    });
    console.log("Downloading: " + this.downloading);
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

  private _pickr(annotation: Annotation, index: number) {
    var color_box = document.createElement("span");
    color_box.setAttribute("class", "color-box");
    color_box.setAttribute(
      "style",
      "background-color: " +
        (annotation.fill_color == undefined ? "#ffffff" : annotation.fill_color)
    );

    var color_picker = document.createElement("span");
    color_picker.setAttribute("id", annotation.uid + "-color-picker");
    color_picker.setAttribute("class", "color-picker");

    color_box.appendChild(color_picker);

    var pickr = Pickr.create({
      el: color_picker,
      theme: "nano", // or 'monolith', or 'nano'

      swatches: [
        "rgba(244, 67, 54, 1)",
        "rgba(233, 30, 99, 1)",
        "rgba(156, 39, 176, 1)",
        "rgba(103, 58, 183, 2)",
        "rgba(63, 81, 181, 1)",
        "rgba(33, 150, 243, 1)",
        "rgba(3, 169, 244, 1)",
        "rgba(0, 188, 212, 1)",
        "rgba(0, 150, 136, 1)",
        "rgba(76, 175, 80, 1)",
        "rgba(139, 195, 74, 1)",
        "rgba(205, 220, 57, 1)",
        "rgba(255, 235, 59, 1)",
        "rgba(255, 193, 7, 1)",
      ],

      components: {
        // Main components
        preview: true,
        // opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          input: true,
          save: true,
        },
      },
    });

    pickr.on("save", (color, instance: Pickr) => {
      this.change_annotation_color(index, color.toHEXA().toString());
      if (
        this.annotations != undefined &&
        this.annotations[index].fill_color !== color.toHEXA().toString()
      )
        instance.hide();
    });
    pickr.on("show", (color, instance: Pickr) => {
      instance.setColor(annotation.fill_color || "#ffffff");
    });

    return color_box;
  }

  private _anotation(annotation: Annotation, index: number) {
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
      <span class="mdc-list-item__meta">${this._pickr(
        annotation,
        index
      )}<span class="close" @click=${(e) => {
      this.remove_annotation(index);
    }}></span></span>
    </li>`;
  }

  private change_annotation_color(index: number, color: string) {
    // if (this.annotations != undefined)
    // this.annotations[index].fill_color = color;
    let myEvent = new CustomEvent("change-annotation-color", {
      detail: { index: index, color: color },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(myEvent);
    // this.requestUpdate();
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
    // delete this.annotation_list_sortable;
    return html`<div class="mdc-card my-card">
      <div class="mdc-card__content">
        <h1 class="mdc-typography--headline4 mdc-theme--on-surface">
          Edit
          <span
            >${this.downloading != undefined || this.downloading != null
              ? html`<div class="lds-spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>`
              : html`<button
                  class="mdc-icon-button material-icons"
                  @click=${(e: Event) => {
                    // this.download();
                    e.stopPropagation();
                    e.preventDefault();
                    this.download_event();
                  }}
                >
                  download
                </button>`}</span
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
