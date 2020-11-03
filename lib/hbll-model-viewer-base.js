var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement, property, css } from "lit-element";
const map_style = {
    height: "100vh",
    width: "100%",
};
export default class HbllModelViewerElementBase extends LitElement {
    constructor() {
        super();
        this.src = null;
        this.skybox_image = null;
        console.log("Created HbllModelViewerElement v10");
    }
    static get styles() {
        return css `
      model-viewer {
        width: 100%;
        height: 100vh;
      }
    `;
    }
    render() {
        return html `
      <model-viewer
        style=${map_style}
        src=${this.src}
        skybox-image=${this.skybox_image}
        camera-controls
      >
      </model-viewer>
    `;
    }
}
__decorate([
    property({ type: String })
], HbllModelViewerElementBase.prototype, "src", void 0);
__decorate([
    property({ type: String })
], HbllModelViewerElementBase.prototype, "skybox_image", void 0);
//# sourceMappingURL=hbll-model-viewer-base.js.map