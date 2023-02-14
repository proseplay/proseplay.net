// const text = document.querySelector(".proseplay");
// const lines = document.querySelectorAll(".proseplay-line");
// const slips = document.querySelectorAll(".proseplay-slip");

// let currentLine: HTMLElement;

// function initShortcuts(): void {
//   lines.forEach(line => {
//     (line as HTMLElement).addEventListener("mousedown", handleMouseDown);
//   });

//   (text as HTMLElement).addEventListener("keydown", handleKeyDown);
// }

// function handleMouseDown(e: MouseEvent): void {
//   currentLine = e.currentTarget as HTMLElement;
// }

// function handleKeyDown(e: KeyboardEvent): void {
//   if (e.key === "/" && e.metaKey) {
//     toggleComment();
//     return;
//   }

//   // if (e.key === "ArrowUp") {
//   //   const index = lines.indexOf(currentLine);
//   //   if (index > 0) {
//   //     currentLine = lines[index - 1];
//   //   }
//   // }

//   // if (e.key === "ArrowDown") {
//   //   const index = Array.from(lines).indexOf(currentLine);
//   //   if (index < lines.length - 1) {
//   //     currentLine = lines[index + 1];
//   //   }
//   // }
// }

// function toggleComment(): void {
//   if (!currentLine) return;

//   const isComment = currentLine.classList.toggle("proseplay-comment");
//   if (isComment) {
//     const before = document.createElement("span");
//     before.classList.add("proseplay-comment-wrapper");
//     before.innerText = "(";
//     currentLine.insertBefore(before, currentLine.firstChild);

//     const after = document.createElement("span");
//     after.classList.add("proseplay-comment-wrapper");
//     after.innerText = ")?";
//     currentLine.appendChild(after);
//   } else {
//     const parens = currentLine.querySelectorAll(".proseplay-comment-wrapper");
//     parens.forEach(paren => paren.remove());
//   }

//   slips.forEach(slip => {
//     const current = slip.querySelector(".proseplay-current");
//     (slip as HTMLElement).style.width = `${(current as HTMLElement).offsetWidth}px`;
//   });
// }

// export { initShortcuts }
export {}