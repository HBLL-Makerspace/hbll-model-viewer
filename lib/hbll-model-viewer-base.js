var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement, property, query, internalProperty, } from "lit-element";
import { urlFromUnzippedFile, jsonFromFile, getJsonFromUrl, } from "./file-utils.js";
import { Marked } from "@ts-stack/markdown";
import { styles } from "./hbll-model-viewer-base.css.js";
console.log(Marked.parse("I am using __markdown__."));
const map_style = {
    height: "100vh",
    width: "100%",
};
export default class HbllModelViewerElementBase extends LitElement {
    constructor() {
        super();
        this.src = null;
        this.annotation_src = null;
        this.skybox_image = null;
        this.annotations = null;
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
    saveCameraOrbit() {
        console.log(JSON.stringify(this.modelViewer.getCameraOrbit()));
        let blob = new Blob([JSON.stringify(this.modelViewer.getCameraOrbit())], {
            type: "text/plain;charset=utf-8",
        }), url = window.URL.createObjectURL(blob);
        this.downloader.href = url;
        this.downloader.download = "camera_orbit.json";
        this.downloader.click();
        window.URL.revokeObjectURL(url);
    }
    annotationClick(annotation) {
        console.log(annotation);
        this.currentAnnotation = annotation;
        if (annotation == undefined)
            return;
        this.modelViewer.cameraTarget = `${annotation.position.x || "auto"}m ${annotation.position.y || "auto"}m ${annotation.position.z || "auto"}m`;
        this.modelViewer.cameraOrbit = `${annotation.cameraOrbit.theta}rad ${annotation.cameraOrbit.phi}rad ${annotation.cameraOrbit.radius}m`;
        this.requestUpdate();
    }
    no_model_msg() {
        return html `<div slot="poster" class="drag_drop_text unselectable">
      Drag and drop a model here!<br />
      <small class="unselectable">Add an HDR for environment</small>
    </div>`;
    }
    nav_label() {
        var _a;
        return html `<div class="label_nav grid-container">
      <div @click=${(e) => {
            this.previousAnnotaion();
            e.stopPropagation();
            e.preventDefault();
        }} class="round nav_arrow nav_prev unselectable">&#8249;</div>
      <div class="annotation_label unselectable nav_center">
        ${((_a = this.currentAnnotation) === null || _a === void 0 ? void 0 : _a.name) || "Select an annotion"}
        </div>
        <div @click=${(e) => {
            this.nextAnnotaion();
            e.stopPropagation();
            e.preventDefault();
        }} class="round nav_arrow nav_next unselectable">&#8250;</div>
      </div>
    </div>`;
    }
    nextAnnotaion() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.currentAnnotation == undefined) {
            this.annotationClick((_a = this.annotations) === null || _a === void 0 ? void 0 : _a.annotations[0]);
            (_e = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById("hotspot-" + ((_d = (_c = this.annotations) === null || _c === void 0 ? void 0 : _c.annotations[0]) === null || _d === void 0 ? void 0 : _d.name) || "rand")) === null || _e === void 0 ? void 0 : _e.focus();
        }
        else {
            if (this.annotations != undefined) {
                let index = this.annotations.annotations.indexOf(this.currentAnnotation);
                this.annotationClick(this.annotations.annotations[(index + 1) % this.annotations.annotations.length]);
                (_h = (_f = this.shadowRoot) === null || _f === void 0 ? void 0 : _f.getElementById("hotspot-" + ((_g = this.currentAnnotation) === null || _g === void 0 ? void 0 : _g.name) || "rand")) === null || _h === void 0 ? void 0 : _h.focus();
            }
        }
    }
    previousAnnotaion() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.currentAnnotation == undefined) {
            this.annotationClick((_a = this.annotations) === null || _a === void 0 ? void 0 : _a.annotations[0]);
            (_e = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById("hotspot-" + ((_d = (_c = this.annotations) === null || _c === void 0 ? void 0 : _c.annotations[0]) === null || _d === void 0 ? void 0 : _d.name) || "rand")) === null || _e === void 0 ? void 0 : _e.focus();
        }
        else {
            if (this.annotations != undefined) {
                let index = this.annotations.annotations.indexOf(this.currentAnnotation);
                this.annotationClick(this.annotations.annotations[(index - 1) % this.annotations.annotations.length]);
                (_h = (_f = this.shadowRoot) === null || _f === void 0 ? void 0 : _f.getElementById("hotspot-" + ((_g = this.currentAnnotation) === null || _g === void 0 ? void 0 : _g.name) || "rand")) === null || _h === void 0 ? void 0 : _h.focus();
            }
        }
    }
    static get styles() {
        return styles;
    }
    render() {
        var _a, _b, _c, _d;
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
              id="hotspot-${i.name || "rand"}"
              @click=${(e) => {
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
        ${this.src == undefined && this.annotations == undefined
            ? html ``
            : this.nav_label()}
        ${this.src == undefined ? this.no_model_msg() : html ``}
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
], HbllModelViewerElementBase.prototype, "annotation_src", void 0);
__decorate([
    property({ type: String })
], HbllModelViewerElementBase.prototype, "skybox_image", void 0);
__decorate([
    property()
], HbllModelViewerElementBase.prototype, "annotations", void 0);
__decorate([
    internalProperty()
], HbllModelViewerElementBase.prototype, "cameraIsDirty", void 0);
__decorate([
    internalProperty()
], HbllModelViewerElementBase.prototype, "currentAnnotation", void 0);
__decorate([
    internalProperty()
], HbllModelViewerElementBase.prototype, "buttonStyles", void 0);
//# sourceMappingURL=hbll-model-viewer-base.js.map