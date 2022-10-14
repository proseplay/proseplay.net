const text = document.querySelector(".text")
const lines = document.querySelectorAll(".line")
const slips = document.querySelectorAll(".slip")
const showRegexBtn = document.querySelector("#showRegexBtn")

let currentLine = null

function initShortcuts() {
  lines.forEach(line => {
    line.addEventListener("mousedown", handleMouseDown)
  })

  text.addEventListener("keydown", handleKeyDown)
}

function handleMouseDown(e) {
  currentLine = e.currentTarget
}

function handleKeyDown(e) {
  if (e.key === "/" && e.metaKey) {
    toggleComment()
    return
  }

  // if (e.key === "ArrowUp") {
  //   const index = lines.indexOf(currentLine)
  //   if (index > 0) {
  //     currentLine = lines[index - 1]
  //   }
  // }

  // if (e.key === "ArrowDown") {
  //   const index = Array.from(lines).indexOf(currentLine)
  //   if (index < lines.length - 1) {
  //     currentLine = lines[index + 1]
  //   }
  // }
}

function toggleComment() {
  if (!currentLine) return

  const isComment = currentLine.classList.toggle("comment")
  if (isComment) {
    const before = document.createElement("span")
    before.classList.add("comment-wrapper")
    before.innerText = "("
    currentLine.insertBefore(before, currentLine.firstChild)

    const after = document.createElement("span")
    after.classList.add("comment-wrapper")
    after.innerText = ")?"
    currentLine.appendChild(after)
  } else {
    const parens = currentLine.querySelectorAll(".comment-wrapper")
    parens.forEach(paren => paren.remove())
  }

  slips.forEach(slip => {
    const current = slip.querySelector(".current")
    if (showRegexBtn.checked) {
      slip.style.width = "auto"
    } else {
      slip.style.width = `${current.offsetWidth}px`
    }
  })
}

export { initShortcuts }