import { property, LitElement, html } from "lit-element";

export default class HbllModelViewerElementBase extends LitElement {
  constructor() {
    super();
    console.log("Created HbllModelViewerElement");
  }

  @property({ type: String }) src: string | null = null;

  render() {
    return html`
      <div>
        <p>A paragraph</p>
      </div>
    `;
  }
}
