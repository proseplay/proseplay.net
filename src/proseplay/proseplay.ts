import "./proseplay.css";

import { Window } from "./window";
import { Choice } from "./choice";

type Token = {
  strings: string[]
  linkIndex?: number | null
};
type TokenizedLine = Token[];
type TokenizedText = TokenizedLine[];

const lineTemplate = document.createElement("div");
lineTemplate.classList.add("proseplay-line");

class ProsePlay {
  private el: HTMLElement;
  private windows: Window[];

  private mouse: {x: number, y: number};
  private isMouseDown: boolean;
  private draggedWindow: Window | null;
  private links: Window[][];

  constructor(el: HTMLElement) {
    this.el = el;
    this.el.classList.add("proseplay")
    this.windows = [];
    
    this.mouse = {x: 0, y: 0};
    this.isMouseDown = false;
    this.draggedWindow = null;
    this.links = [];

    this.el.addEventListener("click", this.handleClick);
    this.el.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  private static createInstance(): ProsePlay {
    const container = document.createElement("div");
    container.classList.add("proseplay");
    document.body.appendChild(container);
    const pp = new ProsePlay(container);
    return pp;
  }

  loadSample(name: "homophones" | "hypothetically" | "dickinson" | "carpenter"): ProsePlay {
    fetch(`/samples/${name}.txt`)
      .then(r => r.text())
      .then(text => this.parseText(text));
    return this;
  }

  static loadSample(name: "homophones" | "hypothetically" | "dickinson" | "carpenter"): ProsePlay {
    const pp = ProsePlay.createInstance();
    pp.loadSample(name);
    return pp;
  }

  parseText(str: string): ProsePlay {
    str = str.trim();
    console.log(str);
    let textTokens: TokenizedText = [];
    let lines = str.split("\n");
    lines.forEach(line => {
      const lineTokens: TokenizedLine = [];
      let m = line.matchAll(new RegExp(
        "\\(" + // open parentheses
          "(" + // start capturing group
            "[^(|)]+" + // first string
            "\\|" + // pipe
            "([^(|)]+\\|?)+" + // one or more strings, with optional pipe
          ")" + // end capturing group
        "\\)" + // close parentheses
        "(\\[(\\d)+\\])?" // link index
        , "g"));
      const stringsIndex = 1,
        linkIndex = 4;

      let currIndex = 0;
      for (const match of m) {
        const index = match.index as number;
        let isEscaped = line[index - 1] === "\\";

        let prevToken: Token = {strings: []},
          currentToken: Token = {strings: []};
        if (isEscaped) {
          prevToken.strings = [line.slice(currIndex, index - 1)];
          currentToken.strings = [line.slice(index, index + match[0].length)];
        } else {
          prevToken.strings = [line.slice(currIndex, index)];
          currentToken.strings = match[stringsIndex].split("|");
          if (match[linkIndex]) {
            currentToken.linkIndex = parseInt(match[linkIndex]);
          }
        }
        lineTokens.push(prevToken);
        lineTokens.push(currentToken);

        currIndex = index + match[0].length;
      }
      if (currIndex < line.length) {
        lineTokens.push({strings: [line.slice(currIndex)]});
      }
      textTokens.push(lineTokens);
    });
    console.log(textTokens);
  
    this.constructText(textTokens);

    return this;
  }

  static parseText(str: string): ProsePlay {
    const pp = ProsePlay.createInstance();
    pp.parseText(str);
    return pp;
  }
  
  private constructText(text: TokenizedText): void {
    this.el.innerHTML = "";
    text.forEach(line => {
      const lineEl = lineTemplate.cloneNode(true) as HTMLElement;
      this.el.appendChild(lineEl);
      line.forEach(token => {
        if (token.strings.length === 1) {
          lineEl.append(document.createTextNode(token.strings[0]));
        } else {
          const window = new Window(lineEl);
          if (token.linkIndex) {
            window.setLink(token.linkIndex);
            if (!this.links[token.linkIndex]) {
              this.links[token.linkIndex] = [];
            }
            this.links[token.linkIndex].push(window);
          }
          this.windows.push(window);
          token.strings.forEach(str => window.addChoice(new Choice(str)));
          window.activateChoice(window.choices[0]);
        }
      });
      if (line.length === 0) {
        lineEl.innerHTML = "&nbsp;";
      }
    });
  }

  generate() {
    this.windows.forEach(window => window.random());
    return this;
  }

  private handleClick = (e: MouseEvent): void => {
    if (this.draggedWindow) {
      e.preventDefault();
    }
  }

  private handleMouseDown = (e: MouseEvent): boolean => {
    e.preventDefault();

    this.isMouseDown = true;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    this.windows.forEach(window => {
      if (window.isDragged) {
        this.draggedWindow = window;
      }
    });

    if (this.draggedWindow) {
      this.windows.forEach(window => {
        window.isHoverable = false;
      });

      let windowsToDrag = [this.draggedWindow];
      if (this.draggedWindow.linkIndex) {
        windowsToDrag.push(...this.links[this.draggedWindow.linkIndex]);
      }
      windowsToDrag.forEach(window => window.el.classList.add("proseplay-hover"));
    }

    return false;
  }

  private handleMouseMove = (e: MouseEvent): boolean => {
    e.preventDefault();

    if (!this.isMouseDown) {
      let hasHover = false;
      this.windows.forEach(window => {
        if (window.isHovered) {
          hasHover = true;
        }
      });
      this.el.classList.toggle("proseplay-has-hover", hasHover);
      return false;
    }

    if (!this.draggedWindow) return false;
    let draggedListPos = this.draggedWindow.top;
    draggedListPos -= (this.mouse.y - e.clientY);
    this.mouse.y = e.clientY;

    let windowsToDrag = [this.draggedWindow];
    if (this.draggedWindow.linkIndex) {
      windowsToDrag.push(...this.links[this.draggedWindow.linkIndex]);
    }
    windowsToDrag.forEach(window => {
      window.slideTo(draggedListPos);
    });

    return false;
  }

  private handleMouseUp = (e: MouseEvent): boolean => {
    e.preventDefault();
    this.isMouseDown = false;
    this.el.classList.remove("proseplay-has-hover");
    this.windows.forEach(window => window.isHoverable = true);
    if (!this.draggedWindow) return false;

    let windowsToDrag = [this.draggedWindow];
    if (this.draggedWindow.linkIndex) {
      windowsToDrag.push(...this.links[this.draggedWindow.linkIndex]);
    }
    windowsToDrag.forEach(window => {
      window.handleMouseUp(e);
    });
    
    this.draggedWindow = null;
    return false;
  }
}

export { ProsePlay }