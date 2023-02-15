import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

(new ProsePlay(document.querySelector(".title") as HTMLElement)).parseText("(Prose|Puzzle)(Play|Poetry)");

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const input = document.querySelector("#input") as HTMLTextAreaElement,
  submit = document.querySelector("#submit") as HTMLElement;
input.value = `this is (my|your|our)[1]
very (lovely|cool|weird)[1]
(poem|experience)`;
submit.addEventListener("click", e => {
  e.preventDefault();
  pp.parseText(input.value);
});
submit.click();