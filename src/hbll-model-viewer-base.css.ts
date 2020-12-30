import { css, CSSResult } from "lit-element";

export const styles: CSSResult = css`
  ::host {
    width: 100%;
    height: 100%;
  }
  .disapear {
    transition: opacity 0.3s;
    opacity: 0;
    pointer-events: none;
  }
  model-viewer {
    width: 100%;
    height: 100vh;
  }
  .annotation {
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

  .annotation:not([data-visible]) {
    background: transparent;
    border: 4px solid #fff;
    box-shadow: none;
    pointer-events: none;
    height: 32px;
    min-width: 32px;
  }

  .annotation:focus-within {
    border: 4px solid var(--mdc-theme-secondary, rgb(0, 128, 200));
    height: 32px;
    outline: none;
    min-width: 32px;
    z-index: 1000000 !important;
  }

  .annotation:focus-within .HotspotAnnotation {
    transition: opacity 0.3s;
    opacity: 1;
    pointer-events: initial;
    z-index: 1000000 !important;
  }

  .annotation .HotspotAnnotation {
    opacity: 0;
    pointer-events: none;
  }

  .annotation:not(:focus-within) {
    z-index: -1;
  }

  .HotspotAnnotation {
    display: block;
    font-size: 12px;
    font-weight: 200;
    left: calc(100% + 1em);
    max-width: 250px;
    position: absolute;
    top: 50%;
    width: max-content;
    max-height: 400px;
    overflow-y: auto;
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
    font-family: Arial, Helvetica, sans-serif;
    left: 50%;
    bottom: 0px;
    padding: 6px;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    width: 200px;
    background: var(--mdc-theme--surface, rgb(0, 0, 0, 0.8));
    border-radius: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .fullscreen {
    position: absolute;
    font-family: Arial, Helvetica, sans-serif;
    bottom: 6px;
    right: 10px;
    white-space: nowrap;
  }

  /* This keeps child nodes hidden while the element loads */
  :not(:defined) > * {
    display: none;
  }

  #download {
    display: none;
  }

  .drag_drop_text {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20pt;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .drag_drop_text small {
    font-size: 12pt;
  }

  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .round {
    border-radius: 50%;
  }

  .nav_arrow {
    text-decorations: none;
    color: white;
    font-size: 15px;
    cursor: pointer;
  }

  .nav_prev {
    grid-column: 1 / span 1;
  }

  .nav_next {
    grid-column: 6 / span 1;
  }

  .nav_center {
    grid-column: 2 / span 4;
  }

  .grid-container {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto;
    padding: 6px;
  }

  /* width */
  .HotspotAnnotation::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  .HotspotAnnotation::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  .HotspotAnnotation::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }

  /* Handle on hover */
  .HotspotAnnotation::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .rounded {
    border-radius: 200px;
  }

  .card-padded {
    padding-left: 15px;
    padding-right: 15px;
    text-align: left;
    white-space: pre-wrap;
  }

  [contenteditable="true"]:active,
  [contenteditable="true"]:focus,
  div {
    border: none;
    outline: none;
  }

  :not(:defined) > * {
    display: none;
  }

  .dot {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    background: #fff;
    --min-hotspot-opacity: 0;
  }

  .dim {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    color: rgba(0, 0, 0, 0.8);
    display: block;
    font-family: Futura, Helvetica Neue, sans-serif;
    font-size: 18px;
    font-weight: 700;
    max-width: 128px;
    overflow-wrap: break-word;
    padding: 0.5em 1em;
    position: absolute;
    width: max-content;
    height: max-content;
    transform: translate3d(-50%, -50%, 0);
    --min-hotspot-opacity: 0;
  }

  .show {
    --min-hotspot-opacity: 1;
  }

  .hide {
    display: none;
  }

  .hide-enforce {
    display: none !important;
  }

  .lds-spinner {
    color: official;
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-spinner div {
    transform-origin: 40px 40px;
    animation: lds-spinner 1.2s linear infinite;
  }
  .lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 37px;
    width: 6px;
    height: 18px;
    border-radius: 20%;
    background: #333333;
  }
  .lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  .lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  .lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  .lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  .lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  .lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  .lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  .lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  .lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  .lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  .lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  .lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  #lazy-load-poster {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  #button-load {
    background-color: #212121dd;
    width: 80px;
    height: 80px;
    color: white;
    cursor: pointer;
    border-radius: 50%;
    display: inline-block;
    font-weight: 500;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2), 0 0 4px rgba(0, 0, 0, 0.25);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 100;
  }
  #button-load:after {
    position: absolute;
    top: calc(50% - 20px);
    left: calc(50% - 11px);
    display: block;
    content: "";
    box-sizing: border-box;
    border-color: transparent transparent transparent rgb(255, 255, 255);
    border-style: solid;
    border-width: 20px 0px 20px 30px;
  }
  #button-load:hover {
    background-color: #414141dd;
  }
`;
