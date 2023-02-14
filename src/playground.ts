import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

(new ProsePlay(document.querySelector(".title") as HTMLElement)).parseText("(Prose|Puzzle)(Play|Poetry)");

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const input = document.querySelector("#input") as HTMLTextAreaElement,
  submit = document.querySelector("#submit") as HTMLElement;
input.value = `this is (my|your|our)
very (lovely|cool|weird)
(poem|experience)`;
submit.addEventListener("click", e => {
  e.preventDefault();
  pp.parseText(input.value);
});
submit.click();