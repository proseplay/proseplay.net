import { initSlips } from "./slips.js"
import { initShortcuts } from "./shortcuts.js"

const text = document.querySelector(".text")
const showRegexBtn = document.querySelector("#showRegexBtn")
const linkingBtn = document.querySelector("#linkingBtn")
const resetLinksBtn = document.querySelector("#resetLinksBtn")

const transitionTime = 15

let isShowingRegex = false

// linking
const links = []
let isLinking = false
let isMouseDown = false

document.addEventListener("DOMContentLoaded", () => {
  initSlips(addToLink, getLinks)
  initShortcuts()
  addEvents()
})

function addEvents() {
  // regex
  showRegexBtn.addEventListener("input", handleViewChange)
  handleViewChange()

  // linking
  linkingBtn.addEventListener("click", toggleLinking)

  // reset
  resetLinksBtn.addEventListener("click", resetLinks)
}

function handleMouseDown(e) {
  if (e.target.classList.contains("option")) return
  isMouseDown = true
}

function handleMouseMove(e) {
  if (!isMouseDown) return
}

function handleMouseUp(e) {
  if (!isMouseDown) return
  isMouseDown = false
}

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
    if (links.length > 0) {
      resetLinksBtn.classList.remove("hidden")
      if (links[links.length - 1].length === 0) {
        links.splice(links[links.length - 1], 1)
      }
    }
  }

  // toggle body class
  document.body.classList.toggle("is-linking", isLinking)

  // toggle other controls
  showRegexBtn.disabled = isLinking
  document.querySelector("#generateBtn").disabled = isLinking
  resetLinksBtn.disabled = isLinking

  // change text on button
  linkingBtn.textContent = isLinking ? "Done" : "Create link"
}

function addToLink(slip) {
  links[links.length - 1].push(slip)
  
  // add superscript
  const sup = document.createElement("sup")
  sup.classList.add("link-ref")
  sup.textContent = links.length
  slip.insertAdjacentElement("afterend", sup)
  
  // add data
  slip.setAttribute("data-link", links.length)
}

function getLinks() {
  return links
}

function resetLinks() {
  text.querySelectorAll("sup").forEach(slip => slip.remove())
  text.querySelectorAll("[data-link]").forEach(slip => slip.removeAttribute("data-link"))
  links.splice(0, links.length)
  resetLinksBtn.classList.add("hidden")
}