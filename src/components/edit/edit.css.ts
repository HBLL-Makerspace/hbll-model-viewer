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

  .color-box {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .color-box:hover {
    border-color: #000000bb;
    box-sizing: border-box;
    border-style: solid;
  }

  .annotation-list {
    overflow-y: auto;
    max-height: 500px;
  }

  /* width */
  .annotation-list::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  .annotation-list::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  .annotation-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }

  /* Handle on hover */
  .annotation-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  [contenteditable="true"]:active,
  [contenteditable="true"]:focus {
    border: none;
    outline: none;
  }

  /* Style the close button (span) */
  .close {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 4px;
    opacity: 0.3;
    margin-left: 5px;
  }

  .close:hover {
    opacity: 1;
  }

  .close:before,
  .close:after {
    content: " ";
    height: 20px;
    width: 2px;
    background-color: rgb(255, 255, 255);
    position: absolute;
    margin-left: 10px;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }
`;
