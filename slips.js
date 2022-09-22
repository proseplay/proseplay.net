const slips = document.querySelectorAll(".slip")
const showRegexButton = document.querySelector(".showRegexButton")

let isMouseDown = false
let mouse = {"x": 0, "y": 0}
let draggedList = null

function setupSlips() {
  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)

  slips.forEach(slip => {
    const currentOption = slip.querySelector(".current")
    currentOption.addEventListener("mouseover", handleMouseOver)
    currentOption.addEventListener("mouseout", handleMouseOut)
    currentOption.addEventListener("mousedown", handleMouseDown)
  })
}

function handleMouseOver(e) {
  if (!isMouseDown) {
    e.currentTarget.parentElement.parentElement.classList.toggle("hover", true)
  }
}

function handleMouseOut(e) {
  if (!isMouseDown) {
    e.currentTarget.parentElement.parentElement.classList.toggle("hover", false)
  }
}

function handleMouseDown(e) {
  e.preventDefault()
  isMouseDown = true
  mouse.x = e.clientX
  mouse.y = e.clientY
  draggedList = e.currentTarget.parentElement
  draggedList.parentElement.classList.toggle("hover", true)
}

function handleMouseMove(e) {
  if (!isMouseDown) return
  
  e.preventDefault()
  let slipType = draggedList.parentElement.classList.contains("slip-words") ? "words" : "lines"
  let draggedListPos
  if (slipType === "words") {
    draggedListPos = parseInt(getComputedStyle(draggedList).getPropertyValue("top").replace("px", ""))
    draggedListPos -= (mouse.y - e.clientY)
    draggedList.style.top = `${draggedListPos}px`
    mouse.y = e.clientY
  } else {
    draggedListPos = parseInt(getComputedStyle(draggedList).getPropertyValue("left").replace("px", ""))
    draggedListPos -= (mouse.x - e.clientX)
    draggedList.style.left = `${draggedListPos}px`
    mouse.x = e.clientX
  }

  const listOptions = draggedList.querySelectorAll(".option")
  const targetOption = getNearestOption(listOptions, slipType, draggedListPos)
  listOptions.forEach(option => option.classList.toggle("current", false))
  targetOption.classList.toggle("current", true)
  targetOption.parentElement.parentElement.style.width = `${targetOption.offsetWidth}px`
  // if (slipType === "lines") {
  //   targetOption.parentElement.parentElement.style.height = `${targetOption.offsetHeight}px`
  // }
}

function handleMouseUp(e) {
  if (!isMouseDown) return
  isMouseDown = false
  
  let slipType = draggedList.parentElement.classList.contains("slip-words") ? "words" : "lines"
  let draggedListPos
  if (slipType === "words") {
    draggedListPos = parseInt(getComputedStyle(draggedList).getPropertyValue("top").replace("px", ""))
  } else {
    draggedListPos = parseInt(getComputedStyle(draggedList).getPropertyValue("left").replace("px", ""))
  }
  const listOptions = draggedList.querySelectorAll(".option")
  const targetOption = getNearestOption(listOptions, slipType, draggedListPos)

  // set top
  if (slipType === "words") {
    draggedList.style.top = `-${targetOption.offsetTop}px`
  } else {
    draggedList.style.left = `-${targetOption.offsetLeft}px`
  }

  // cancel hover
  draggedList.parentElement.classList.toggle("hover", false)

  // remove stuff from current option
  const currentOption = draggedList.querySelector(".current")
  currentOption.classList.toggle("current", false)
  currentOption.removeEventListener("mouseover", handleMouseOver)
  currentOption.removeEventListener("mouseout", handleMouseOut)
  currentOption.removeEventListener("mousedown", handleMouseDown)

  // set new current option
  targetOption.classList.toggle("current", true)
  targetOption.addEventListener("mouseover", handleMouseOver)
  targetOption.addEventListener("mouseout", handleMouseOut)
  targetOption.addEventListener("mousedown", handleMouseDown)

  // account for regex
  if (showRegexButton.checked) {
    targetOption.parentElement.parentElement.style.width = "auto"
    console.log(targetOption.parentElement.parentElement)
  }
}

function getNearestOption(listOptions, slipType, draggedListPos) {
  let minDist = Infinity
  let targetOption = null
  listOptions.forEach(option => {
    let dist
    if (slipType === "words") {
      dist = Math.abs(draggedListPos + option.offsetTop)
    } else {
      dist = Math.abs(draggedListPos + option.offsetLeft)
    }

    if (dist < minDist) {
      minDist = dist
      targetOption = option
    }
  })
  return targetOption
}

export { setupSlips }