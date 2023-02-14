# ProsePlay

A tool for exploring alternate word choices, worlds, and possibilities.

*under construction*

## Development

```
npm install
npm run dev
```

## Usage

First, import the library.

```js
import { ProsePlay } from "./proseplay/proseplay";
```

The fastest way to see what this library does is to load up a sample text.

```js
ProsePlay.loadSample("dickinson");
```

Making sure that we've run `npm run dev`, we can go to the specified server (open `localhost:5173` in a browser) and see an interactive poem.

Let's try something more creative! ProsePlay can take your formatted poem and turn it into the same kind of interactive experience.

<i>Note: There are two main approaches to calling ProsePlay—the static method and the non-static method. These examples will focus on the static methods for brevity, but the non-static methods are given in comments in case you want to control where the poem goes on the page.</i>

```js
const poem = `this is (my|your|our)
very (lovely|cool|weird)
(poem|experience)`;
ProsePlay.parseText(poem);

// // non-static
// const container = document.querySelector(".text");
// const pp = new ProsePlay(container);
// pp.parseText(poem);
```

Opening the page, you should see how the parentheses and vertical bars have allowed ProsePlay to transform the poem.

You can now add your own CSS styles to position and shape the container, as well as change things like font family, font size, and line height. Beyond those properties, it may take some trial and error to get the intended effects.

<i>Note: the auto-reloading functionality of the framework used here means that spacing issues can sometimes be fixed if you give the page a quick reload.</i>

You can also have multiple ProsePlay poems running on the page, like this:

```js
const poem1 = `this is (my|your|our)
(lovely|cool|weird)
(poem|experience)`;
const poem2 = `let us (read|write|play)`;
ProsePlay.parseText(poem1);
ProsePlay.parseText(poem2);

// // non-static
// const poems = [poem1, poem2];
// const containers = document.querySelectorAll(".text");
// containers.forEach((container, i) => {
//   const pp = new ProsePlay(container);
//   pp.parseText(poems[i]);
// });
```

## Syntax

A window is denoted by a pair of parentheses that contains two or more choices within, delimited by a vertical bar, or pipe. In the line `this is (my|your|our)`, there are three choices: "my", "your", and "our". The choices can be multi-word strings containing spaces (but not line breaks), such as `(foundering faces|gentle spaces)`, which are the two choices "foundering faces" and "gentle spaces". You can also include an empty choice. For example: `my dream job is (poet|artist|astronaut| )`, which breaks out into "poet", "artist", "astronaut", and an empty choice denoted by the space. 

The first item in the list is the default choice—i.e. the one that shows before you begin interacting with the window.

To escape a window (i.e. to leave it as text and not make it interactive), insert a backslash before the opening parentheses. For example, to escape the window in the string `this is (my|your|our)`, write `this is \(my|your|our)`.