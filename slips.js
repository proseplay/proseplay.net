const slips = document.querySelectorAll(".slip")
const showRegexButton = document.querySelector(".showRegexButton")
const generateButton = document.querySelector(".generateButton")

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

  generateButton.addEventListener("click", generate)
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
  const slipType = draggedList.parentElement.classList.contains("slip-words") ? "words" : "lines"
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
  
  const slipType = draggedList.parentElement.classList.contains("slip-words") ? "words" : "lines"
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

function generate() {
  slips.forEach(slip => {
    const options = slip.querySelectorAll(".option")
    const chosenOption = options[Math.floor(Math.random() * options.length)]
    options.forEach(option => {
      option.classList.toggle("current", false)
      option.removeEventListener("mouseover", handleMouseOver)
      option.removeEventListener("mouseout", handleMouseOut)
      option.removeEventListener("mousedown", handleMouseDown)
    })
    chosenOption.classList.toggle("current", true)
    chosenOption.addEventListener("mouseover", handleMouseOver)
    chosenOption.addEventListener("mouseout", handleMouseOut)
    chosenOption.addEventListener("mousedown", handleMouseDown)

    const slipType = slip.classList.contains("slip-words") ? "words" : "lines"
    const list = slip.querySelector(".list")
    if (slipType === "words") {
      list.style.top = `-${chosenOption.offsetTop}px`
    } else {
      list.style.left = `-${chosenOption.offsetLeft}px`
    }

    if (showRegexButton.checked) {
      slip.style.width = "auto"
    } else {
      slip.style.width = `${chosenOption.offsetWidth}px`
    }
  })
}

export { setupSlips }