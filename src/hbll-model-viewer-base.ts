import { html, LitElement, property, css } from "lit-element";

const map_style = {
  height: "100vh",
  width: "100%",
};

export default class HbllModelViewerElementBase extends LitElement {
  constructor() {
    super();
    console.log("Created HbllModelViewerElement v10");
  }

  @property({ type: String }) src: string | null = null;
  @property({ type: String }) skybox_image: string | null = null;

  static get styles() {
    return css`
      model-viewer {
        width: 100%;
        height: 100vh;
      }
    `;
  }

  render() {
    return html`
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
