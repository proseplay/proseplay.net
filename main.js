import { setupCards } from "./cards.js"

const cards = document.querySelectorAll(".card")
const viewButtons = document.querySelectorAll(".viewButton")

let view = "visual"

setupCards()

viewButtons.forEach(button => {
  button.addEventListener("input", handleViewChange)
})

function handleViewChange(e) {
  view = e.currentTarget.value
}