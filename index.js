import Game from "./game.js"
import { notifyDashboard, notifyPlayer, notifyLost, notifyWon, createDiv} from "./notify.js"
import { playerCount, cardCount, faces } from "./constants.js"

export var game = NaN
export var players = []
export var drawCount = 0
export var tieDrawsCount = 0
export var round = 0

export const playerGrids = document.querySelectorAll("[id^='player']")
export const drawButtons = document.querySelectorAll("[id^='draw']")
export const startButton = document.querySelector("#start_button")
export const dashboard = document.querySelector('#dashboard')

drawButtons.forEach(button => {
    button.disabled = true

    button.addEventListener('click', ()=>{
        var id = button.id.split('_')[1]
        players[id].drawCards(id)
        drawButtons[id].hidden = true
        notifyPlayer(id, players[id].cardFaces().toString())
        drawCount++
        if(drawCount == playerCount) game.getResult()
    })
})

if(startButton){
    startButton.addEventListener('click', ()=> {
        startGame()
    })
}

function startGame(){
    players.forEach(player => player.cards = [])
    drawButtons.forEach(button => button.hidden = false)
    playerGrids.forEach(player => {
        player.querySelectorAll(".card-body > div").forEach(div => div.remove())
    })
    dashboard.querySelectorAll("div").forEach(div => div.remove())
    document.querySelectorAll("[id^='tie_draw']").forEach(button => button.remove())

    round++
    drawCount = 0
    tieDrawsCount = 0
    game = new Game()
}

function auto(){
    startButton.click()
    drawButtons.forEach(button => { button.click() })
}