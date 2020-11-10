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
} from "./file-utils.js";
import { AnnotationData, Annotation } from "./types/annotations.js";
import { Marked } from "@ts-stack/markdown";
import { styles } from "./hbll-model-viewer-base.css.js";

console.log(Marked.parse("I am using __markdown__."));

const map_style = {
  height: "100vh",
  width: "100%",
};

export default class HbllModelViewerElementBase extends LitElement {
  @query("model-viewer") readonly modelViewer?: any;
  @query("a") readonly downloader?: any;
  @property({ type: String }) src: string | null = null;
  @property({ type: String }) annotation_src: string | null = null;
  @property({ type: String }) skybox_image: string | null = null;
  @property() annotations: AnnotationData | null = null;

  @internalProperty()
  cameraIsDirty: boolean;

  @internalProperty()
  currentAnnotation: Annotation | undefined;

  @internalProperty()
  buttonStyles: any;

  constructor() {
    super();
    this.cameraIsDirty = false;
    this.currentAnnotation = undefined;
  }

  async firstUpdated() {
    // Give the browser a chance to paint
    await new Promise((r) => setTimeout(r, 0));

    if (this.annotation_src != undefined) {
      let json = await getJsonFromUrl(this.annotation_src);
      console.log(json);
      this.annotations = JSON.parse(json || "");
    }
    console.log(this.annotations);
    this.addEventListener("drop", this.onDrop);
    this.addEventListener("dragover", this.onDragover);
  }

  private onDragover(event: DragEvent) {
    if (!event.dataTransfer) return;

    event.stopPropagation();
    event.preventDefault();
  }

  private async onDrop(event: DragEvent) {
    console.log(event);
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
        this.annotations = await jsonFromFile(file);
        console.log(this.annotations);
        // this.annotations = await jsonFromFile(file);
      }
      if (file.name.match(/\.(zip)$/i)) {
        console.log("Dropped a zipped file");
      }
    }
  }

  private handleClick(event: MouseEvent) {
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
      console.log(positionAndNormal);
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
    console.log(JSON.stringify(this.modelViewer.getCameraOrbit()));
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
    console.log(annotation);
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
            (index - 1) % this.annotations.annotations.length
          ]
        );
        this.shadowRoot
          ?.getElementById("hotspot-" + this.currentAnnotation?.name || "rand")
          ?.focus();
      }
    }
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <a id="download"></a>
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
            (i, index) => html` button[slot="hotspot-${i.name || "random"}"] {
            background: ${i.fill_color || "#FFFFFFFF"}; }`
          )};
        </style>
        ${this.annotations?.annotations?.map(
          (i, index) =>
            html`<button
              id="hotspot-${i.name || "rand"}"
              @click=${(e: Event) => {
                this.annotationClick(i);
                e.stopPropagation();
                e.preventDefault();
              }}
              slot="hotspot-${i.name || "rand"}"
              data-position="${i.position.x} ${i.position.y} ${i.position.z}"
              data-normal="${i.normal.x} ${i.normal.y} ${i.normal.z}"
              data-visibility-attribute="visible"
            >
              ${index + 1}
              <div class="HotspotAnnotation">
                <div class="annotation_label">${i.name}</div>
                <p class="annotation_description">${i.description}</p>
              </div>
            </button>`
        )}
        ${this.src == undefined && this.annotations == undefined
          ? html``
          : this.nav_label()}
        ${this.src == undefined ? this.no_model_msg() : html``}
      </model-viewer>
    `;
  }
}
