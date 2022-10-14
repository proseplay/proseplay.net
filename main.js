import { initSlips } from "./slips.js"
import { initShortcuts } from "./shortcuts.js"

const text = document.querySelector(".text")
const showRegexBtn = document.querySelector(".showRegexBtn")
const linkingBtn = document.querySelector(".linkingBtn")

const transitionTime = 15

let isShowingRegex = false

// linking
const linkSymbols = ["*", "†", "‡", "§", "||", "#"]
const links = []
let isLinking = false

document.addEventListener("DOMContentLoaded", () => {
  initSlips(addToLink, getLinks)
  initShortcuts()
  
  showRegexBtn.addEventListener("input", handleViewChange)
  handleViewChange()

  linkingBtn.addEventListener("click", toggleLinking)
})

function handleViewChange(e) {
  isShowingRegex = showRegexBtn.checked
  text.classList.toggle("view-regex", isShowingRegex)
  text.classList.toggle("view-visual", !isShowingRegex)
  setTimeout(() => {
    const regexes = text.querySelectorAll(".regex")
    regexes.forEach(regex => {
      regex.style.display = isShowingRegex ? "inline-block" : "none"
    })

    const slips = text.querySelectorAll(".slip")
    slips.forEach(slip => {
      const current = slip.querySelector(".current")
      const slipType = slip.classList.contains("slip-words") ? "words" : "lines"
      if (isShowingRegex) {
        slip.style.width = "auto"
      } else {
        slip.style.width = `${current.offsetWidth}px`
        if (slipType === "lines") {
          // slip.style.height = `${current.offsetHeight}px`
          slip.style.height = `1.3em`
        }
      }
    })
  }, transitionTime);
}

function toggleLinking() {
  isLinking = !isLinking
  if (isLinking) {
    links.push([])
  } else {
    console.log(links)
  }

  // toggle body class
  document.body.classList.toggle("is-linking", isLinking)

  // toggle other controls
  showRegexBtn.disabled = isLinking
  document.querySelector("#generateBtn").disabled = isLinking

  // change text on button
  linkingBtn.textContent = isLinking ? "Done" : "Link choices"
}

function addToLink(slip) {
  links[links.length - 1].push(slip)

  const sup = document.createElement("sup")
  sup.classList.add("link-symbol")
  sup.textContent = linkSymbols[links.length - 1]
  slip.insertAdjacentElement("afterend", sup)
}

function getLinks(slip) {
  let returnLink = []
  links.forEach(link => {
    if (link.includes(slip)) {
      returnLink = link
    }
  })
  return returnLink
}