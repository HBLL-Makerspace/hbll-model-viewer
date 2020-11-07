var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement, property, css, query } from "lit-element";
import { urlFromUnzippedFile, jsonFromFile } from "./file-utils.js";
const map_style = {
    height: "100vh",
    width: "100%",
};
export default class HbllModelViewerElementBase extends LitElement {
    constructor() {
        super();
        this.src = null;
        this.skybox_image = null;
        this.annotations = null;
        this.cameraIsDirty = false;
        this.currentAnnotation = undefined;
    }
    async firstUpdated() {
        // Give the browser a chance to paint
        await new Promise((r) => setTimeout(r, 0));
        console.log("First updated");
        this.addEventListener("drop", this.onDrop);
        this.addEventListener("dragover", this.onDragover);
    }
    onDragover(event) {
        if (!event.dataTransfer)
            return;
        event.stopPropagation();
        event.preventDefault();
    }
    async onDrop(event) {
        console.log(event);
        event.stopPropagation();
        event.preventDefault();
        if (event.dataTransfer && event.dataTransfer.items[0].kind === "file") {
            const file = event.dataTransfer.items[0].getAsFile();
            if (!file)
                return;
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
    handleClick(event) {
        if (!this.cameraIsDirty) {
            if (!this.modelViewer) {
                throw new Error("Model Viewer doesn't exist");
            }
            const rect = this.modelViewer.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const positionAndNormal = this.modelViewer.positionAndNormalFromPoint(x, y);
            console.log(positionAndNormal);
            this.requestUpdate();
            if (!positionAndNormal) {
                throw new Error("invalid click position");
            }
        }
        else
            this.cameraIsDirty = false;
    }
    cameraMoved() {
        this.cameraIsDirty = true;
    }
    saveAnnotations() {
        let blob = new Blob([JSON.stringify(this.annotations)], {
            type: "text/plain;charset=utf-8",
        }), url = window.URL.createObjectURL(blob);
        this.downloader.href = url;
        this.downloader.download = "annotations.json";
        this.downloader.click();
        window.URL.revokeObjectURL(url);
    }
    annotationClick(annotation) {
        this.currentAnnotation = annotation;
        this.requestUpdate();
    }
    static get styles() {
        return css `
      model-viewer {
        width: 100%;
        height: 100vh;
      }
      button {
        background: #fff;
        border-radius: 32px;
        border: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        box-sizing: border-box;
        cursor: pointer;
        height: 24px;
        padding-top: 2px;
        padding-left: 6px;
        padding-right: 6px;
        font-size: 15px;
        position: relative;
        min-width: 24px;
      }

      button:not([data-visible]) {
        background: transparent;
        border: 4px solid #fff;
        box-shadow: none;
        pointer-events: none;
        height: 32px;
        min-width: 32px;
      }

      button:focus {
        border: 4px solid rgb(0, 128, 200);
        height: 32px;
        outline: none;
        min-width: 32px;
      }

      button:focus .HotspotAnnotation {
        transition: opacity 0.3s;
        opacity: 1;
      }

      button .HotspotAnnotation {
        opacity: 0;
        pointer-events: none;
      }

      .HotspotAnnotation {
        background: rgb(0, 0, 0, 0.8);
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        color: rgba(0, 0, 0, 0.8);
        display: block;
        font-size: 12px;
        font-weight: 200;
        left: calc(100% + 1em);
        max-width: 250px;
        padding: 0.5em;
        position: absolute;
        top: 50%;
        width: max-content;
      }

      .annotation_label {
        font-size: 14px;
        font-weight: 300;
        text-align: center;
        color: white;
      }

      .annotation_description {
        color: white;
        font-size: 12px;
        font-weight: 200;
        text-align: left;
      }

      .label_nav {
        position: absolute;
        left: 50%;
        bottom: 10px;
        padding: 6px;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        width: 200px;
        background: rgb(0, 0, 0, 0.8);
        border-radius: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }

      /* This keeps child nodes hidden while the element loads */
      :not(:defined) > * {
        display: none;
      }

      #download {
        display: none;
      }
    `;
    }
    render() {
        var _a, _b, _c, _d, _e;
        return html `
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
          ${(_b = (_a = this.annotations) === null || _a === void 0 ? void 0 : _a.annotations) === null || _b === void 0 ? void 0 : _b.map((i, index) => html ` button[slot="hotspot-${i.name || "random"}"] {
            background: ${i.fill_color || "#FFFFFFFF"}; }`)};
        </style>
        ${(_d = (_c = this.annotations) === null || _c === void 0 ? void 0 : _c.annotations) === null || _d === void 0 ? void 0 : _d.map((i, index) => html `<button
              @click=${(e) => {
            console.log(i);
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
            </button>`)}
        <div class="label_nav">
          <div class="annotation_label">
            ${((_e = this.currentAnnotation) === null || _e === void 0 ? void 0 : _e.name) || "Select an annotion"}
          </div>
        </div>
      </model-viewer>
    `;
    }
}
__decorate([
    query("model-viewer")
], HbllModelViewerElementBase.prototype, "modelViewer", void 0);
__decorate([
    query("a")
], HbllModelViewerElementBase.prototype, "downloader", void 0);
__decorate([
    property({ type: String })
], HbllModelViewerElementBase.prototype, "src", void 0);
__decorate([
    property({ type: String })
], HbllModelViewerElementBase.prototype, "skybox_image", void 0);
__decorate([
    property()
], HbllModelViewerElementBase.prototype, "annotations", void 0);
//# sourceMappingURL=hbll-model-viewer-base.js.map