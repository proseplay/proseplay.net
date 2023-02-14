const text = document.querySelector(".text");
const lines = document.querySelectorAll(".line");
const slips = document.querySelectorAll(".slip");
const showRegexBtn = document.querySelector("#showRegexBtn") as HTMLInputElement;

let currentLine: HTMLElement;

function initShortcuts(): void {
  lines.forEach(line => {
    (line as HTMLElement).addEventListener("mousedown", handleMouseDown);
  });

  (text as HTMLElement).addEventListener("keydown", handleKeyDown);
}

function handleMouseDown(e: MouseEvent): void {
  currentLine = e.currentTarget as HTMLElement;
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === "/" && e.metaKey) {
    toggleComment();
    return;
  }

  // if (e.key === "ArrowUp") {
  //   const index = lines.indexOf(currentLine);
  //   if (index > 0) {
  //     currentLine = lines[index - 1];
  //   }
  // }

  // if (e.key === "ArrowDown") {
  //   const index = Array.from(lines).indexOf(currentLine);
  //   if (index < lines.length - 1) {
  //     currentLine = lines[index + 1];
  //   }
  // }
}

function toggleComment(): void {
  if (!currentLine) return;

  const isComment = currentLine.classList.toggle("comment");
  if (isComment) {
    const before = document.createElement("span");
    before.classList.add("comment-wrapper");
    before.innerText = "(";
    currentLine.insertBefore(before, currentLine.firstChild);

    const after = document.createElement("span");
    after.classList.add("comment-wrapper");
    after.innerText = ")?";
    currentLine.appendChild(after);
  } else {
    const parens = currentLine.querySelectorAll(".comment-wrapper");
    parens.forEach(paren => paren.remove());
  }

  slips.forEach(slip => {
    const current = slip.querySelector(".current");
    if (showRegexBtn.checked) {
      (slip as HTMLElement).style.width = "auto";
    } else {
      (slip as HTMLElement).style.width = `${(current as HTMLElement).offsetWidth}px`;
    }
  });
}

export { initShortcuts }