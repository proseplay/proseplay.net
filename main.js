import { setupSlips } from "./slips.js"
import { setupShortcuts } from "./shortcuts.js"

const text = document.querySelector(".text")
const showRegexButton = document.querySelector(".showRegexButton")

const transitionTime = 15

let isShowingRegex = false

setupSlips()
setupShortcuts()

showRegexButton.addEventListener("input", handleViewChange)
handleViewChange()

function handleViewChange(e) {
  isShowingRegex = showRegexButton.checked
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
          slip.style.height = `${current.offsetHeight}px`
        }
      }
    })
  }, transitionTime);
}