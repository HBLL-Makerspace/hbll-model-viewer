import { html, LitElement, property, css, query } from "lit-element";
import { urlFromUnzippedFile, jsonFromFile } from "./file-utils.js";

const map_style = {
  height: "100vh",
  width: "100%",
};

export default class HbllModelViewerElementBase extends LitElement {
  @query("model-viewer") readonly modelViewer?: any;
  @query("a") readonly downloader?: any;
  @property({ type: String }) src: string | null = null;
  @property({ type: String }) skybox_image: string | null = null;
  @property() annotations: any | null = null;

  cameraIsDirty: boolean;
  hotspots: any[];

  constructor() {
    super();
    this.cameraIsDirty = false;
    this.hotspots = [];
  }

  async firstUpdated() {
    // Give the browser a chance to paint
    await new Promise((r) => setTimeout(r, 0));
    console.log("First updated");
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
      this.hotspots.push(positionAndNormal);
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
    let blob = new Blob([JSON.stringify(this.hotspots)], {
        type: "text/plain;charset=utf-8",
      }),
      url = window.URL.createObjectURL(blob);
    this.downloader.href = url;
    this.downloader.download = "annotations.txt";
    this.downloader.click();
    window.URL.revokeObjectURL(url);
  }

  static get styles() {
    return css`
      model-viewer {
        width: 100%;
        height: 100vh;
      }

      button {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        border: none;
        background-color: blue;
        box-sizing: border-box;
      }

      button[slot="hotspot-hand"] {
        --min-hotspot-opacity: 0;
        background-color: red;
      }

      button[slot="hotspot-foot"]:not([data-visible]) {
        background-color: transparent;
        border: 3px solid blue;
      }

      #annotation {
        background-color: #888888;
        position: absolute;
        transform: translate(10px, 10px);
        border-radius: 10px;
        padding: 10px;
      }
      /* This keeps child nodes hidden while the element loads */
      :not(:defined) > * {
        display: none;
      }

      .download {
        display: none;
      }
    `;
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
        <button @click=${this.saveAnnotations}>
          <div id="annotation">Save annotations</div>
        </button>
        ${this.hotspots.map(
          (i) =>
            html`<button
              slot="hotspot-${i.position.x}-${i.position.y}-${i.position.z}"
              data-position="${i.position.x} ${i.position.y} ${i.position.z}"
              data-normal="${i.normal.x} ${i.normal.y} ${i.normal.z}"
            ></button>`
        )}
      </model-viewer>
    `;
  }
}
