import { initSlips, addSlip } from "./slips.js"
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

// variants
const addVariantBtn = document.querySelector("#addVariantBtn")
let selectionRange = null

// snapshots
const snapshotBtn = document.querySelector("#snapshotBtn")
let numSnapshots = 1

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

  // selections
  // text.addEventListener("select", handleSelection)
  text.addEventListener("mousedown", handleMouseDown)
  text.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
  document.addEventListener("selectionchange", handleSelection)

  // snapshots
  snapshotBtn.addEventListener("click", snapshot)
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

function handleSelection(e) {
  const selection = document.getSelection()
  const range = selection.getRangeAt(0)
  if (rangeIsValid(range)) {
    selectionRange = range
    // range.startContainer.parentElement.appendChild(addVariantContainer)
    addVariantBtn.style.top = `${range.startContainer.parentElement.offsetTop}px`
    addVariantBtn.style.left = `${range.startContainer.parentElement.offsetLeft}px`
    addVariantBtn.classList.remove("hidden")

    addVariantBtn.addEventListener("click", addVariant)
  } else {
    selectionRange = null
    addVariantBtn.classList.add("hidden")
  }
}

function rangeIsValid(range) {
  const startContainer = range.startContainer
  if (!startContainer.parentElement.classList.contains("line")) return false

  const endContainer = range.endContainer
  if (!endContainer.parentElement.classList.contains("line")) return false
  if (startContainer !== endContainer) return false

  const startOffset = range.startOffset
  const endOffset = range.endOffset
  const rangeVal = startContainer.textContent.slice(startOffset, endOffset)
  if (!rangeVal) return false

  return true
}

function addVariant() {
  const text = selectionRange.startContainer.textContent
  const start = selectionRange.startOffset
  const end = selectionRange.endOffset
  const split = [
    text.slice(0, start),
    text.slice(start, end),
    text.slice(end, text.length),
  ]
  const prev = document.createTextNode(split[0])
  split[0] = prev
  const next = document.createTextNode(split[2])
  split[2] = next

  const slip = document.createElement("div")
  slip.classList.add("slip", "slip-words")
  const regex = document.createElement("div")
  regex.classList.add("regex")
  slip.appendChild(regex)
  const list = document.createElement("div")
  list.classList.add("list")
  slip.appendChild(list)
  const originalOption = document.createElement("div")
  originalOption.classList.add("option", "current")
  originalOption.innerText = split[1]
  list.appendChild(originalOption)
  const newOption = document.createElement("div")
  newOption.classList.add("option")
  // newOption.innerText = "test"
  list.appendChild(newOption)
  setTimeout(() => {
    originalOption.classList.remove("current")
    newOption.classList.add("current")
    list.style.top = `-${newOption.offsetTop}px`
    addSlip(slip)

    const newOptionInput = document.querySelector("#newOptionInput")
    // newOptionInput.classList.remove("hidden")
    const originalBB = originalOption.getBoundingClientRect()
    const newBB = newOption.getBoundingClientRect()
    newOptionInput.style.top = `${newBB.top}px`
    newOptionInput.style.left = `${newBB.left}px`
    // newOptionInput.style.width = "auto"
    newOptionInput.style.height = `${originalBB.height}px`
    newOptionInput.value = ""
    newOptionInput.focus()
    newOptionInput.addEventListener("keyup", function inputKeyup(e) { inputNewOption(e, newOptionInput, newOption) })
  }, 10);
  split[1] = slip

  handleViewChange()

  for (let i = 0; i < split.length; i++) {
    selectionRange.startContainer.parentElement.insertBefore(split[i], selectionRange.startContainer)
  }
  selectionRange.startContainer.remove()
}

function inputNewOption(e, newOptionInput, newOption) {
  newOptionInput.style.width = `${newOptionInput.value.length * 20}px`
  newOption.innerText = newOptionInput.value
  handleViewChange()
  if (e.key === "Enter") {
    // newOptionInput.classList.add("hidden")
    newOptionInput.blur()
    newOptionInput.removeEventListener("keyup", inputKeyup)
  }
}

function handleViewChange() {
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
  snapshotBtn.disabled = isLinking

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

function snapshot() {
  const lines = document.querySelectorAll(".line")

  const snapshot = document.createElement("div")

  const snapshotHeading = document.createElement("h2")
  snapshotHeading.classList.add("snapshot-heading")
  snapshotHeading.innerText = `Snapshot ${numSnapshots}.`
  snapshot.appendChild(snapshotHeading)

  const snapshotText = document.createElement("div")
  snapshotText.classList.add("snapshot-text")
  let textContent = ""
  lines.forEach(line => {
    const nodes = line.childNodes
    let lineText = ""
    nodes.forEach(node => {
      if (node.nodeName === "#text") {
        lineText += node.textContent.trim()
      } else if (node.nodeName === "DIV") {
        const current = node.querySelector(".current")
        if (lineText !== "") {
          lineText += " "
        }
        lineText += current.textContent + " "
      }
    })
    textContent += lineText + "\n"
  })

  snapshotText.innerText = textContent
  snapshot.appendChild(snapshotText)

  document.querySelector(".snapshots").appendChild(snapshot)
  numSnapshots++
}