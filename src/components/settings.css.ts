import { css, CSSResult } from "lit-element";

export const settings_stlye = css`
  .disapear {
    transition: opacity 0.3s;
    opacity: 0;
    pointer-events: none;
  }
  .my-card {
    position: absolute !important;
    top: 10px;
    right: 10px;
    padding: 16px;
    width: 300px;
  }

  .mdc-switch {
    --mdc-theme-surface: #37474f;
  }
`;
