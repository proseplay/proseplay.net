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
  let draggedListTop = parseInt(getComputedStyle(draggedList).getPropertyValue("top").replace("px", ""))
  draggedListTop -= (mouse.y - e.clientY)
  draggedList.style.top = `${draggedListTop}px`
  mouse.y = e.clientY

  const listOptions = draggedList.querySelectorAll(".option")
  const targetOption = getNearestOption(listOptions, draggedListTop)
  listOptions.forEach(option => option.classList.toggle("current", false))
  targetOption.classList.toggle("current", true)
  targetOption.parentElement.parentElement.style.width = `${targetOption.offsetWidth}px`
}

function handleMouseUp(e) {
  if (!isMouseDown) return
  isMouseDown = false
  
  const draggedListTop = parseInt(getComputedStyle(draggedList).getPropertyValue("top").replace("px", ""))
  const listOptions = draggedList.querySelectorAll(".option")
  const targetOption = getNearestOption(listOptions, draggedListTop)

  // set top
  draggedList.style.top = `-${targetOption.offsetTop}px`

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

function getNearestOption(listOptions, draggedListTop) {
  let minDist = Infinity
  let targetOption = null
  listOptions.forEach(option => {
    const dist = Math.abs(draggedListTop + option.offsetTop)
    if (dist < minDist) {
      minDist = dist
      targetOption = option
    }
  })
  return targetOption
}

export { setupSlips }