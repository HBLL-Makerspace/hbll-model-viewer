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
} from "./file-utils";
import SettingsCard from "./components/settings/settings";
import { AnnotationData, Annotation, Manifest } from "./types/annotations";
import { Marked } from "@ts-stack/markdown";
import { styles } from "./hbll-model-viewer-base.css";
import { mat_styles } from "./material.css";
import { MDCRipple } from "@material/ripple";
import { ModelViewer } from "@google/model-viewer";
import * as THREE from "three";

const map_style = {
  height: "100vh",
  width: "100%",
};

const materials = {};

export default class HbllModelViewerElementBase extends LitElement {
  @query("model-viewer") readonly modelViewer?: ModelViewer;
  @query("settings-card") readonly settings?: SettingsCard;
  @query("a") readonly downloader?: any;
  @query(".mdc-drawer") readonly drawer_element?: any;
  @query("#fullscreen_btn") readonly fullscreen_btn?: any;
  @property({ type: String }) src: string | null = null;
  @property({ type: String }) annotation_src: string | null = null;
  @property({ type: String }) skybox_image: string | null = null;
  @property() annotations: AnnotationData | null = null;
  @property() manifest_src: string | null = null;

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

  async firstUpdated() {
    // Give the browser a chance to paint
    await new Promise((r) => setTimeout(r, 0));

    if (this.annotation_src != undefined) {
      this.annotations = await getJsonFromUrl(this.annotation_src);
    }

    if (this.manifest_src != undefined) {
      this.manifest = await getJsonFromUrl(this.manifest_src);
      if (this.manifest?.entries != undefined)
        for (let i = 0; i < this.manifest?.entries.length || 0; i++) {
          let text = await gettextFromFile(this.manifest?.entries[i].url);
          if (text != undefined)
            this.files.set(this.manifest?.entries[i].name, text);
        }
    }
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
      if (file.name.match(/\.(json)$/i)) {
        if (file.name === "manifest.json") {
          this.manifest = await jsonFromFile(file);
        }
        this.annotations = await jsonFromFile(file);
        // console.log(this.annotations);
      }
      if (file.name.match(/\.(zip)$/i)) {
        console.log("Dropped a zipped file");
      }
    }
  }

  private handleClick(event: MouseEvent) {
    this.modelViewer.cameraTarget = `auto auto auto`;
    this.currentAnnotation = undefined;
    if (!this.cameraIsDirty) {
      if (!this.modelViewer) {
        throw new Error("Model Viewer doesn't exist");
      }
      const rect = this.modelViewer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const positionAndNormal = this.modelViewer.positionAndNormalFromPoint(
        x,
        y
      );
      this.requestUpdate();
      if (!positionAndNormal) {
        throw new Error("invalid click position");
      }
    } else this.cameraIsDirty = false;
  }

  private cameraMoved() {
    this.cameraIsDirty = true;
  }

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
    // console.log(annotation);
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
      Drag and drop a model here!<br />
      <small class="unselectable">Add an HDR for environment</small>
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
      this.annotationClick(this.annotations?.annotations[0]);
      this.shadowRoot
        ?.getElementById(
          "hotspot-" + this.annotations?.annotations[0]?.name || "rand"
        )
        ?.focus();
    } else {
      if (this.annotations != undefined) {
        let index = this.annotations.annotations.indexOf(
          this.currentAnnotation
        );
        this.annotationClick(
          this.annotations.annotations[
            (index + 1) % this.annotations.annotations.length
          ]
        );
        this.shadowRoot
          ?.getElementById("hotspot-" + this.currentAnnotation?.name || "rand")
          ?.focus();
      }
    }
  }

  private previousAnnotaion() {
    if (this.currentAnnotation == undefined) {
      this.annotationClick(this.annotations?.annotations[0]);
      this.shadowRoot
        ?.getElementById(
          "hotspot-" + this.annotations?.annotations[0]?.name || "rand"
        )
        ?.focus();
    } else {
      if (this.annotations != undefined) {
        let index = this.annotations.annotations.indexOf(
          this.currentAnnotation
        );
        this.annotationClick(
          this.annotations.annotations[
            index - 1 < 0 ? this.annotations.annotations.length - 1 : index - 1
          ]
        );
        this.shadowRoot
          ?.getElementById("hotspot-" + this.currentAnnotation?.name || "rand")
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
        ? this.files.get(annotation.descriptionFileName)
        : annotation.description;

    return html`${(annotation.markdown || false) == true
      ? html`${this.stringToHtml(Marked.parse(text || ""))}`
      : text}`;
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

  render() {
    return html`
      <a id="download"></a>
      <div id="container">
        <model-viewer
          style=${map_style}
          src=${this.src || ""}
          skybox-image=${this.skybox_image || ""}
          camera-controls
          @click="${this.handleClick},"
          @camera-change=${this.cameraMoved}
        >
          <style>
            ${this.annotations?.annotations?.map(
              (i, index) => html` .annotation[slot="hotspot-${i.name ||
              "random"}"]
              { background: ${i.fill_color || "#FFFFFFFF"}; }`
            )};
          </style>
          ${this.showAnnotations
            ? this.annotations?.annotations?.map(
                (i, index) =>
                  html`<button
                    class="annotation"
                    id="hotspot-${i.name || "rand"}"
                    @click=${(e: Event) => {
                      this.annotationClick(i);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    slot="hotspot-${i.name || "rand"}"
                    data-position="${i.position.x} ${i.position.y} ${i.position
                      .z}"
                    data-normal="${i.normal.x} ${i.normal.y} ${i.normal.z}"
                    data-visibility-attribute="visible"
                  >
                    ${index + 1}
                    <div class="HotspotAnnotation">
                      <div class="mdc-card mdc-theme--on-surface">
                        ${this.getAnnotationDescription(i)}
                      </div>
                    </div>
                  </button>`
              )
            : html``}
          ${this.src == undefined && this.annotations == undefined
            ? html``
            : this.nav_label()}
          ${this.annotations == undefined && this.src == undefined
            ? this.no_model_msg()
            : html``}
          <div class="fullscreen">
            <button
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
            </button>
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
              this.showAnnotations = e.detail.settings.get("showAnnotations");
              this.modelViewer.model.materials[0].pbrMetallicRoughness[
                "baseColorTexture"
              ].texture.source.setURI();
              console.log(
                this.modelViewer.model.materials[0].pbrMetallicRoughness
              );
              this.modelViewer.model["materials"][0] = materials["wireframe"];
              console.log(this.modelViewer.model);
              // this.modelViewer.model.materials[0] = materials["wireframe"];
              // this.modelViewer.model.materials[0].needsUpdate = true;
            }}
          ></settings-card>

          <edit-card
            class="${this.show_edit ? "" : "disapear"}"
            @settings-update=${(e) => {}}
          ></edit-card>
        </model-viewer>
      </div>
    `;
  }
}
