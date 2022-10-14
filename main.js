import { initSlips } from "./slips.js"
import { initShortcuts } from "./shortcuts.js"

const text = document.querySelector(".text")
const showRegexBtn = document.querySelector(".showRegexBtn")

const transitionTime = 15

let isShowingRegex = false

document.addEventListener("DOMContentLoaded", () => {
  initSlips()
  initShortcuts()
  
  showRegexBtn.addEventListener("input", handleViewChange)
  handleViewChange()
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