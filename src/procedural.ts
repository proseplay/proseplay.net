import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const text = `
(Thursday|Monday|Saturday). I'm sagging into the mild drudging pace of life
like an armchair doze on a Saturday afternoon
(and these days always feel like Saturday afternoon).
I'm melting into murals of buildings; I'm becoming passers-by
in someone else's selfies. At some point there was wildfire;
at some point there was a dragon. Now there is a pet curled before
a simmering hearth. I play little games to amuse it. In the momentum
of the commuting crowd I imagine myself a sea turtle coasting
along the East Australian Current. The flow is righteous, dude!
At an empty crosswalk I press the button just to walk when it says wait.
The red man, frozen in neon, shakes a raised fist at me.
My throat is lined with tea; a laugh bubbles up, warm and smooth.
`;
pp.parseText(text);