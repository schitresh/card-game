export function createDiv(display, color=NaN){
    var div = document.createElement("div")
    var text = document.createTextNode(display)
    div.appendChild(text)
    if(color) div.style.color = color
    return div
}

export function notifyDashboard(display, color=NaN){
    var dashboard = document.querySelector('#dashboard')
    dashboard.appendChild(createDiv(display, color))
}

export function notifyPlayer(index, display, color=NaN){
    var div = createDiv(display, color)
    var player_grid = document.querySelector(`#player_${index}`)
    var player = player_grid.querySelector('.card-body')
    player.appendChild(div)
}

export function notifyLost(index){
    notifyPlayer(index, "LOST!", "red")
}

export function notifyWon(index, rule, round){
    notifyPlayer(index, "WINNER!!", "green")
    notifyDashboard(`Player ${index} Won by ${rule}`)
    document.querySelector("#statistics").appendChild(createDiv(`Round ${round}: Player ${index}`))
    start_button.disabled = false
}