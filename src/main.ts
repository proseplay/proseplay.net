import "./style.css";

import { ProsePlay } from "proseplay";

(document.querySelectorAll(".play") as NodeListOf<HTMLElement>).forEach(el => {
  el.classList.remove("play");
  let text = el.innerText;
  (new ProsePlay(el)).parseText(text);
});