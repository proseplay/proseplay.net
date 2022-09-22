const text = document.querySelector(".text")
const slips = document.querySelectorAll(".slip")
const showRegexButton = document.querySelector(".showRegexButton")

let isComment = false

function setupShortcuts() {
  text.addEventListener("keydown", handleKeyDown)
}

function handleKeyDown(e) {
  if (e.key === "/" && e.metaKey) {
    toggleComment()
  }
}

function toggleComment() {
  isComment = !isComment
  const line = text.querySelector(".line")
  line.classList.toggle("comment", isComment)
  if (isComment) {
    const before = document.createElement("span")
    before.classList.add("comment-before")
    before.innerText = "("
    line.insertBefore(before, line.firstChild)

    const after = document.createElement("span")
    after.classList.add("comment-after")
    after.innerText = ")?"
    line.appendChild(after)
  } else {
    const parens = line.querySelectorAll(".comment-before, .comment-after")
    parens.forEach(paren => paren.remove())
  }

  slips.forEach(slip => {
    const current = slip.querySelector(".current")
    if (showRegexButton.checked) {
      slip.style.width = "auto"
    } else {
      slip.style.width = `${current.offsetWidth}px`
    }
  })
}

export { setupShortcuts }