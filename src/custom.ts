import "./style.css";

import { ProsePlay } from "proseplay";

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const text = `
in the mo( |u)rning


(to those who are dreamt—  
do you know what you are?)

do you know that I dream about you?
you with (your strange dress|your familiar laugh)
you with (a face I couldn’t pick from a lineup|your body that my body remembers sitting near)
(last time|this time) (this year|last life)

what wakes in my s(l| )eep
so s( |l)eeps when day breaks
you with your dress and
that face in the chaff

you traipse and leave
but a trace or seed
in the mess of light and
feathers too hard by half

their names slip off my tongue like sil(k|t)
they all crumble by my eyes as sil(t|k)
oh, but I grieve
to (leave|love) my (love|leave) in a dream 
`;
pp.parseText(text);