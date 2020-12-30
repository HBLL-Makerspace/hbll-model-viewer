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
    display: inline-block;
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
    border-radius: 4px;
    opacity: 0.3;
    margin-left: 5px;
    margin-right: 5px;
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

  .color-box {
    border-radius: 4px;
  }

  .pickr > button {
    background-color: transparent;
    color: white;
    border: none;
    outline: none;
    padding: 0.5em 0.75em;
    cursor: pointer;
    border-radius: 0.1em;
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }

  .lds-spinner {
    color: official;
    display: inline-block;
    position: relative;
    width: 20px;
    height: 15px;
    margin-left: 15px;
  }
  .lds-spinner div {
    transform-origin: center;
    animation: lds-spinner 1.2s linear infinite;
  }
  .lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 10px;
    left: 8px;
    width: 3px;
    height: 8px;
    border-radius: 20%;
    background: #ffffff;
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
`;
