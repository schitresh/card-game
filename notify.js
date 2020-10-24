import { playerGrids, startButton, dashboard, statistics } from "./index.js"

export function createDiv(display, color=NaN){
    var div = document.createElement("div")
    var text = document.createTextNode(display)
    div.appendChild(text)
    if(color) div.style.color = color
    return div
}

export function notifyDashboard(display, color=NaN){
    dashboard.appendChild(createDiv(display, color))
}

export function notifyPlayer(id, display, color=NaN){
    var div = createDiv(display, color)
    var player = playerGrids[id].querySelector('.card-body')
    player.appendChild(div)
}

export function notifyLost(id){
    notifyPlayer(id, "LOST!", "red")
}

export function notifyWon(id, rule, round){
    notifyPlayer(id, "WINNER!!", "green")
    notifyDashboard(`Player ${id+1} Won by ${rule}`)
    statistics.appendChild(createDiv(`Round ${round}: Player ${id}`))
    startButton.disabled = false
}