import {
  html,
  LitElement,
  property,
  css,
  query,
  internalProperty,
} from "lit-element";
import {
  urlFromUnzippedFile,
  jsonFromFile,
  getJsonFromUrl,
  gettextFromFile,
  jsonFromText,
  urlFromArrayBuffer,
  createSafeObjectURL,
} from "./file-utils";
import SettingsCard from "./components/settings/settings";
import { AnnotationData, Annotation, Manifest } from "./types/annotations";
import { Marked } from "@ts-stack/markdown";
import { styles } from "./hbll-model-viewer-base.css";
import { mat_styles } from "./material.css";
import { MDCRipple } from "@material/ripple";
import { ModelViewer } from "@google/model-viewer";
import * as THREE from "three";
import { uid } from "uid";
import JSZip, { files, JSZipObject } from "jszip";
import Showdown from "showdown";

const map_style = {
  height: "100vh",
  width: "100%",
};

const materials = {};

const converter = new Showdown.Converter({});

export default class HbllModelViewerElementBase extends LitElement {
  @query("model-viewer") readonly modelViewer?: ModelViewer;
  @query("settings-card") readonly settings?: SettingsCard;
  @query("a") readonly downloader?: any;
  @query(".mdc-drawer") readonly drawer_element?: any;
  @query("#fullscreen_btn") readonly fullscreen_btn?: any;
  @property({ type: String }) src: string | null = null;
  @property({ type: String }) annotation_src: string | null = null;
  @property({ type: String }) skybox_image: string | null = null;
  @property() annotations: AnnotationData | null = { annotations: [] };
  @property() edit: boolean | undefined = false;

  @internalProperty()
  cameraIsDirty: boolean;

  @internalProperty()
  currentAnnotation: Annotation | undefined;

  @internalProperty()
  buttonStyles: any;

  @internalProperty()
  files: Map<string, string>;

  @internalProperty()
  manifest: Manifest | null = null;

  @internalProperty()
  show_settings: boolean = false;

  @internalProperty()
  showAnnotations: boolean = true;

  @internalProperty()
  show_edit: boolean = false;

  @internalProperty()
  show_dimensions: boolean = false;

  @internalProperty()
  add_annotation_mode: boolean = false;

  @internalProperty()
  annotation_list: Array<Annotation> = [];

  @internalProperty()
  second_updated: boolean = false;

  @internalProperty()
  loading: boolean = false;

  @internalProperty()
  downloading: boolean = false;

  constructor() {
    super();
    this.cameraIsDirty = false;
    this.currentAnnotation = undefined;
    this.files = new Map<string, string>();

    materials["lambert"] = new THREE.MeshLambertMaterial({
      color: 0xdddddd,
    });
    materials["phong"] = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      specular: 0x009900,
      shininess: 30,
    });
    materials["basic"] = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    materials["wireframe"] = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
  }

  // This is a lit element function that is acalled when the element has finished an update.
  updated(changedProperties) {
    // This is to fix a wierd bug where when removing a annotation all following annotaions do not show up on the skull.
    // The HTML exists for the annotations, yet they do not render. This is fixed by disabling all annotations then reshowing them.
    // There might be a more elegant solution, however this works fine at the present.
    if (this.second_updated) {
      this.second_updated = false;
      this.showAnnotations = true;
    }
  }

  async firstUpdated() {
    // Give the browser a chance to paint
    await new Promise((r) => setTimeout(r, 0));

    if (this.annotation_src != undefined) {
      this.annotations = await getJsonFromUrl(this.annotation_src);
      if (this.annotations != undefined) {
        this.annotation_list = this.annotations?.annotations;
        if (this.annotation_list != undefined) {
          var index_last = this.annotation_src.lastIndexOf("/");
          var path = this.annotation_src.slice(0, index_last) + "/";
          this.annotation_list.forEach(async (ann) => {
            if (ann.descriptionFileName != undefined)
              this.files.set(
                ann.descriptionFileName,
                await (await fetch(path + ann.descriptionFileName)).text()
              );
          });
        }
      }
    }

    // if (this.manifest_src != undefined) {
    //   this.manifest = await getJsonFromUrl(this.manifest_src);
    //   if (this.manifest?.entries != undefined)
    //     for (let i = 0; i < this.manifest?.entries.length || 0; i++) {
    //       let text = await gettextFromFile(this.manifest?.entries[i].url);
    //       if (text != undefined)
    //         this.files.set(this.manifest?.entries[i].name, text);
    //     }
    // }
    this.addEventListener("drop", this.onDrop);
    this.addEventListener("dragover", this.onDragover);

    if (this.fullscreen_btn != undefined) {
      const iconButtonRipple = new MDCRipple(this.fullscreen_btn);
      iconButtonRipple.unbounded = true;
    }
  }

  private onDragover(event: DragEvent) {
    if (!event.dataTransfer) return;

    event.stopPropagation();
    event.preventDefault();
  }

  private async onDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (event.dataTransfer && event.dataTransfer.items[0].kind === "file") {
      const file = event.dataTransfer.items[0].getAsFile();
      if (!file) return;
      if (file.name.match(/\.(glb)$/i)) {
        this.src = await urlFromUnzippedFile(file);
      }
      if (file.name.match(/\.(hdr|png|jpg|jpeg)$/i)) {
        this.skybox_image = await urlFromUnzippedFile(file);
      }
      if (file.name.match(/\.(zip)$/i)) {
        var zip = await JSZip.loadAsync(file);
        zip.forEach(async (name, file_data: JSZipObject) => {
          if (name.match(/\.(glb)$/i)) {
            this.loading = true;
            this.src = urlFromArrayBuffer(
              await file_data.async("arraybuffer")
            ).unsafeUrl;
            this.loading = false;
          }
          if (name.match(/\.(md)$/i)) {
            this.files.set(name, await file_data.async("text"));
          }
          if (name.match(/\.(hdr)$/i)) {
            this.skybox_image =
              createSafeObjectURL(await file_data.async("blob")).unsafeUrl +
              "#.hdr";
          }
          if (name.match(/\.(json)$/i)) {
            this.annotations = await jsonFromText(
              await file_data.async("text")
            );
            if (this.annotations?.annotations != undefined)
              this.annotation_list = this.annotations?.annotations;
            // console.log(this.annotations);
          }
        });
      }
    }
  }

  private async handleClick(event: MouseEvent) {
    this.modelViewer.cameraTarget = `auto auto auto`;
    this.currentAnnotation = undefined;
    if (!this.cameraIsDirty) {
      if (!this.modelViewer) {
        throw new Error("Model Viewer doesn't exist");
      }
      if (this.add_annotation_mode) {
        const rect = this.modelViewer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const positionAndNormal = this.modelViewer.positionAndNormalFromPoint(
          x,
          y
        );
        if (!positionAndNormal) {
          throw new Error("invalid click position");
        }

        var uid_ = uid(32).toString() + ".md";
        this.files.set(
          uid_,
          "### This is a test \n\nClick on the edit button on the top of this popup to edit this text. Edited text will be done in markdown."
        );

        this.add_annotation_mode = false;
        await this.updateComplete;

        this.annotation_list = this.annotation_list.concat({
          position: positionAndNormal.position,
          normal: positionAndNormal.normal,
          cameraOrbit: this.modelViewer.getCameraOrbit(),
          name: `${this.annotation_list.length + 1}`,
          description: `${this.annotation_list.length + 1}`,
          descriptionFileName: uid_,
          markdown: true,
          uid: uid(32),
        });
        await this.requestUpdate();
      }
    } else this.cameraIsDirty = false;
  }

  // private cameraMoved() {
  //   this.cameraIsDirty = true;
  // }

  private saveAnnotations() {
    let blob = new Blob([JSON.stringify(this.annotations)], {
        type: "text/plain;charset=utf-8",
      }),
      url = window.URL.createObjectURL(blob);
    this.downloader.href = url;
    this.downloader.download = "annotations.json";
    this.downloader.click();
    window.URL.revokeObjectURL(url);
  }

  private saveCameraOrbit() {
    // console.log(JSON.stringify(this.modelViewer.getCameraOrbit()));
    let blob = new Blob([JSON.stringify(this.modelViewer.getCameraOrbit())], {
        type: "text/plain;charset=utf-8",
      }),
      url = window.URL.createObjectURL(blob);
    this.downloader.href = url;
    this.downloader.download = "camera_orbit.json";
    this.downloader.click();
    window.URL.revokeObjectURL(url);
  }

  private annotationClick(annotation: Annotation | undefined) {
    this.currentAnnotation = annotation;
    if (annotation == undefined) return;
    this.modelViewer.cameraTarget = `${annotation.position.x || "auto"}m ${
      annotation.position.y || "auto"
    }m ${annotation.position.z || "auto"}m`;
    this.modelViewer.cameraOrbit = `${annotation.cameraOrbit.theta}rad ${annotation.cameraOrbit.phi}rad ${annotation.cameraOrbit.radius}m`;
    this.requestUpdate();
  }

  private no_model_msg() {
    return html`<div slot="poster" class="drag_drop_text unselectable">
      ${this.loading
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
        : html`Drag and drop a model here!<br />
            <small class="unselectable">Add an HDR for environment</small>`}
    </div>`;
  }

  private nav_label() {
    return html`<div class="label_nav grid-container">
      <div @click=${(e) => {
        this.previousAnnotaion();
        e.stopPropagation();
        e.preventDefault();
      }} class="round nav_arrow nav_prev unselectable">&#8249;</div>
      <div class="annotation_label unselectable nav_center">
        ${this.currentAnnotation?.name || "Select an annotion"}
        </div>
        <div @click=${(e) => {
          this.nextAnnotaion();
          e.stopPropagation();
          e.preventDefault();
        }} class="round nav_arrow nav_next unselectable">&#8250;</div>
      </div>
    </div>`;
  }

  private nextAnnotaion() {
    if (this.currentAnnotation == undefined) {
      this.annotationClick(this.annotation_list[0]);
      this.shadowRoot
        ?.getElementById("hotspot-" + this.annotation_list[0]?.uid || "rand")
        ?.focus();
    } else {
      if (this.annotations != undefined) {
        let index = this.annotation_list.indexOf(this.currentAnnotation);
        this.annotationClick(
          this.annotation_list[(index + 1) % this.annotation_list.length]
        );
        this.shadowRoot
          ?.getElementById("hotspot-" + this.currentAnnotation?.uid || "rand")
          ?.focus();
      }
    }
  }

  private previousAnnotaion() {
    if (this.currentAnnotation == undefined) {
      this.annotationClick(this.annotation_list[0]);
      this.shadowRoot
        ?.getElementById("hotspot-" + this.annotation_list[0]?.uid || "rand")
        ?.focus();
    } else {
      if (this.annotations != undefined) {
        let index = this.annotation_list.indexOf(this.currentAnnotation);
        this.annotationClick(
          this.annotation_list[
            index - 1 < 0 ? this.annotation_list.length - 1 : index - 1
          ]
        );
        this.shadowRoot
          ?.getElementById("hotspot-" + this.currentAnnotation?.uid || "rand")
          ?.focus();
      }
    }
  }

  static get styles() {
    return [styles, mat_styles];
  }

  private stringToHtml(str: string) {
    var frag = document.createRange().createContextualFragment(`${str}`);
    return frag;
  }

  private getAnnotationDescription(annotation: Annotation) {
    let text =
      annotation.descriptionFileName != undefined
        ? this.files.get(annotation.descriptionFileName)?.trim()
        : annotation.description?.trim();

    let marked = converter.makeHtml(text || "");

    return html`${(annotation.markdown || false) == true && !this.show_edit
      ? // ? html`${this.stringToHtml(Marked.parse(text?.trim() || ""))}`
        html`${this.stringToHtml(marked)}`
      : this.show_edit
      ? html`<div
          contenteditable="true"
          @focusout=${(e) => {
            this.files.set(
              annotation?.descriptionFileName || "null",
              e.target.innerText.trim()
            );
          }}
        >
          ${text?.trim()}
        </div>`
      : text?.trim()}`;
  }

  private async toggleFullscreen() {
    if (!this.isFullscreen()) {
      let elem = this.modelViewer;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        await elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }

    this.requestUpdate();
  }

  private isFullscreen(): boolean {
    return window.innerHeight == screen.height;
  }

  private change_name(name: string, new_name: string) {
    var found = this.annotation_list.find((e) => e.name == name);
    if (found != undefined) found.name = new_name;
    this.requestUpdate("annotation_list", this.annotation_list);
  }

  render() {
    console.log("Edit: " + this.edit);
    return html`
      <a id="download"></a>
      <div id="container">
        <model-viewer
          style=${map_style}
          src=${this.src || ""}
          skybox-image=${this.skybox_image || ""}
          camera-controls
          @click="${this.handleClick},"
          @load=${(e) => {
            this.on_model_load(e);
          }}
        >
          <style>
            ${this.annotation_list?.map(
              (i, index) => html` .annotation[slot="hotspot-${i.uid ||
              "random"}"]
              { background: ${i.fill_color || "#FFFFFFFF"}; }`
            )};
          </style>
          ${this.render_dimensions(this.show_dimensions ? "" : "hide-enforce")}
          ${this.showAnnotations
            ? this.annotation_list?.map(
                (i, index) =>
                  html`<button
                    class="annotation"
                    id="hotspot-${i.uid || "rand"}"
                    @click=${(e: Event) => {
                      this.annotationClick(i);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    slot="hotspot-${i.uid || "rand"}"
                    data-position="${i.position.x} ${i.position.y} ${i.position
                      .z}"
                    data-normal="${i.normal.x} ${i.normal.y} ${i.normal.z}"
                    data-visibility-attribute="visible"
                  >
                    ${index + 1}
                    <div class="HotspotAnnotation">
                      <div class="mdc-card mdc-theme--on-surface card-padded">
                        ${this.getAnnotationDescription(i)}
                      </div>
                    </div>
                  </button>`
              )
            : html``}
          ${this.src == undefined && this.annotations == undefined
            ? html``
            : this.nav_label()}
          ${this.src == undefined || this.src === ""
            ? this.no_model_msg()
            : html``}
          <div class="fullscreen">
            ${this.edit !== false
              ? html`<button
                  class="mdc-icon-button material-icons ${this.show_edit
                    ? "mdc-theme--surface mdc-theme--secondary rounded"
                    : ""}"
                  @click=${(e: Event) => {
                    this.show_edit = !this.show_edit;
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  edit
                </button>`
              : html``}
            <button
              class="mdc-icon-button material-icons ${this.show_settings
                ? "mdc-theme--surface mdc-theme--secondary rounded"
                : ""}"
              @click=${(e: Event) => {
                this.show_settings = !this.show_settings;
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              settings
            </button>
            <button
              class="mdc-icon-button material-icons mdc-menu-surface--anchor"
              id="fullscreen_btn"
              @click=${(_) => {
                this.toggleFullscreen();
              }}
            >
              ${this.isFullscreen() ? "fullscreen_exit" : "fullscreen"}
            </button>
          </div>

          <settings-card
            class="${this.show_settings ? "" : "disapear"}"
            @settings-update=${(e) => {
              this.show_dimensions = e.detail.settings.get("showDimensions");
              this.showAnnotations = e.detail.settings.get("showAnnotations");
            }}
          ></settings-card>

          <edit-card
            class="${this.show_edit ? "" : "disapear"}"
            @settings-update=${(e) => {}}
            .annotations="${this.annotation_list}"
            @edit-add-mode=${(e) => {
              this.add_annotation_mode = true;
              this.cameraIsDirty = false;
            }}
            @change-name=${(e) => {
              this.change_name(e.detail.name, e.detail.new_name);
            }}
            @change-index=${(e) => {
              this.change_index(e.detail.oldIndex, e.detail.newIndex);
            }}
            @download-request=${(e) => this.download_project()}
            @remove-annotation=${(e) => this.remove_annotation(e.detail.index)}
            @change-annotation-color=${(e) =>
              this.change_annotation_color(e.detail.index, e.detail.color)}
            ?downloading="${this.downloading}"
          ></edit-card>
        </model-viewer>
      </div>
    `;
  }

  private change_annotation_color(index: number, color: string) {
    if (this.annotation_list[index].fill_color !== color) {
      // this.annotation_list[index].fill_color = color;
      this.annotation_list = this.annotation_list.filter((e, index_) => {
        if (index_ === index) e.fill_color = color;
        return true;
      });
      // this.requestUpdate();
    }
  }

  private remove_annotation(index_: number) {
    this.annotation_list = this.annotation_list.filter(
      (e, index) => index != index_
    );
    this.showAnnotations = false;
    this.second_updated = true;
  }

  private async download_project() {
    this.downloading = true;
    var zip = JSZip();
    const glTF = await this.modelViewer.exportScene();
    zip.file("model.glb", glTF);
    if (this.annotations != undefined)
      this.annotations.annotations = this.annotation_list;
    zip.file("annotations.json", JSON.stringify(this.annotations));
    this.annotations?.annotations.forEach((el) => {
      zip.file(
        el.descriptionFileName || "null",
        this.files.get(el.descriptionFileName || "null") || ""
      );
    });
    if (this.skybox_image != null) {
      zip.file("sky_box.hdr", (await fetch(this.skybox_image)).blob());
    }

    var blob = await zip.generateAsync({ type: "blob" });
    var url = window.URL.createObjectURL(blob);
    this.downloader.href = url;
    this.downloader.download = "model.zip";
    this.downloader.click();
    window.URL.revokeObjectURL(url);
    this.downloading = false;
  }

  private change_index(oldIndex: number, newIndex: number) {
    const movedItem = this.annotation_list[oldIndex];
    const remainingItems = this.annotation_list.filter(
      (item, index) => index != oldIndex
    );

    if (remainingItems != undefined && movedItem != undefined)
      this.annotation_list = [
        ...remainingItems.slice(0, newIndex),
        movedItem,
        ...remainingItems.slice(newIndex),
      ];

    this.requestUpdate();
  }

  private on_model_load(e: Event) {
    const center = this.modelViewer.getCameraTarget();
    const size = this.modelViewer.getDimensions();
    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    this.modelViewer.updateHotspot({
      name: "hotspot-dot+X-Y+Z",
      position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
    });

    this.modelViewer.updateHotspot({
      name: "hotspot-dim+X-Y",
      position: `${center.x + x2} ${center.y - y2} ${center.z}`,
    });
    this.modelViewer.querySelector(
      'div[slot="hotspot-dim+X-Y"]'
    ).textContent = `${(size.z * 100).toFixed(0)} cm`;

    this.modelViewer.updateHotspot({
      name: "hotspot-dot+X-Y-Z",
      position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
    });

    this.modelViewer.updateHotspot({
      name: "hotspot-dim+X-Z",
      position: `${center.x + x2} ${center.y} ${center.z - z2}`,
    });
    this.modelViewer.querySelector(
      'div[slot="hotspot-dim+X-Z"]'
    ).textContent = `${(size.y * 100).toFixed(0)} cm`;

    this.modelViewer.updateHotspot({
      name: "hotspot-dot+X+Y-Z",
      position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
    });

    this.modelViewer.updateHotspot({
      name: "hotspot-dim+Y-Z",
      position: `${center.x} ${center.y + y2} ${center.z - z2}`,
    });
    this.modelViewer.querySelector(
      'div[slot="hotspot-dim+Y-Z"]'
    ).textContent = `${(size.x * 100).toFixed(0)} cm`;

    this.modelViewer.updateHotspot({
      name: "hotspot-dot-X+Y-Z",
      position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
    });

    this.modelViewer.updateHotspot({
      name: "hotspot-dim-X-Z",
      position: `${center.x - x2} ${center.y} ${center.z - z2}`,
    });
    this.modelViewer.querySelector(
      'div[slot="hotspot-dim-X-Z"]'
    ).textContent = `${(size.y * 100).toFixed(0)} cm`;

    this.modelViewer.updateHotspot({
      name: "hotspot-dot-X-Y-Z",
      position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
    });

    this.modelViewer.updateHotspot({
      name: "hotspot-dim-X-Y",
      position: `${center.x - x2} ${center.y - y2} ${center.z}`,
    });
    this.modelViewer.querySelector(
      'div[slot="hotspot-dim-X-Y"]'
    ).textContent = `${(size.z * 100).toFixed(0)} cm`;

    this.modelViewer.updateHotspot({
      name: "hotspot-dot-X-Y+Z",
      position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
    });
  }

  private render_dimensions(insert: string) {
    return html`<div
        slot="hotspot-dot+X-Y+Z"
        class="dot ${insert}"
        data-position="1 -1 1"
        data-normal="1 0 0"
      ></div>
      <div
        slot="hotspot-dim+X-Y"
        class="dim ${insert}"
        data-position="1 -1 0"
        data-normal="1 0 0"
      ></div>
      <div
        slot="hotspot-dot+X-Y-Z"
        class="dot ${insert}"
        data-position="1 -1 -1"
        data-normal="1 0 0"
      ></div>
      <div
        slot="hotspot-dim+X-Z"
        class="dim ${insert}"
        data-position="1 0 -1"
        data-normal="1 0 0"
      ></div>
      <div
        slot="hotspot-dot+X+Y-Z"
        class="dot show ${insert}"
        data-position="1 1 -1"
        data-normal="0 1 0"
      ></div>
      <div
        slot="hotspot-dim+Y-Z"
        class="dim show ${insert}"
        data-position="0 -1 -1"
        data-normal="0 1 0"
      ></div>
      <div
        slot="hotspot-dot-X+Y-Z"
        class="dot show ${insert}"
        data-position="-1 1 -1"
        data-normal="0 1 0"
      ></div>
      <div
        slot="hotspot-dim-X-Z"
        class="dim ${insert}"
        data-position="-1 0 -1"
        data-normal="-1 0 0"
      ></div>
      <div
        slot="hotspot-dot-X-Y-Z"
        class="dot ${insert}"
        data-position="-1 -1 -1"
        data-normal="-1 0 0"
      ></div>
      <div
        slot="hotspot-dim-X-Y"
        class="dim ${insert}"
        data-position="-1 -1 0"
        data-normal="-1 0 0"
      ></div>
      <div
        slot="hotspot-dot-X-Y+Z"
        class="dot ${insert}"
        data-position="-1 -1 1"
        data-normal="-1 0 0"
      ></div>`;
  }
}
