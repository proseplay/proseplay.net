import "./style.css";

import { ProsePlay } from "proseplay";

const textEl = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(textEl);
pp.loadSample("homophones");