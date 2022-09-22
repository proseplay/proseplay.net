import { setupSlips } from "./slips.js"
import { setupShortcuts } from "./shortcuts.js"

const viewButtons = document.querySelectorAll(".viewButton")

let view = "visual"

setupSlips()
setupShortcuts()

viewButtons.forEach(button => {
  button.addEventListener("input", handleViewChange)
})

function handleViewChange(e) {
  view = e.currentTarget.value
}