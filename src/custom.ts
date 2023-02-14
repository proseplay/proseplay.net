import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const text = `
do you know that I dream about you?
you with (your strange dress|your familiar laugh)
you with (a face I couldn’t pick from a lineup|your body that my body remembers sitting near)
(last time|this time) (this year|last life)

what wakes in my s(l| )eep
so s( |l)eeps when day breaks
you with your dress and
that face you
so traipse and leave
but a trace or seed

your name slips off my tongue like silk
you crumble by my eyes like silt
oh, but I grieve, to leave my love( |s) in a dream 
`;
pp.parseText(text);