import { setupSlips } from "./slips.js"

const slips = document.querySelectorAll(".slip")
const viewButtons = document.querySelectorAll(".viewButton")

let view = "visual"

setupSlips()

viewButtons.forEach(button => {
  button.addEventListener("input", handleViewChange)
})

function handleViewChange(e) {
  view = e.currentTarget.value
}