import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

(new ProsePlay(document.querySelector(".title") as HTMLElement)).parseText("(Prose|Puzzle)(Play|Poetry)");
