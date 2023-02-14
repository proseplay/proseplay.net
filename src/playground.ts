import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const input = document.querySelector("#input") as HTMLTextAreaElement,
  submit = document.querySelector("#submit") as HTMLElement;
submit.addEventListener("click", e => {
  e.preventDefault();
  pp.parseText(input.value);
});