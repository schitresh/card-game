import { playerCount, cardCount, faces } from "./constants.js"
import { notifyDashboard, notifyPlayer, notifyLost, notifyWon, createDiv} from "./notify.js"

import Game from "./game.js"

export var game = NaN

export const playerGrids = document.querySelectorAll("[id^='player']")
export const drawButtons = document.querySelectorAll("[id^='draw']")

export const startButton = document.querySelector("#start_button")
export const dashboard = document.querySelector("#dashboard")
export const statistics = document.querySelector("#statistics")

export function resetLayout(){
    playerGrids.forEach(player => {
        player.querySelectorAll(".card-body > div").forEach(div => div.remove())
        player.querySelectorAll("[id^='tie_draw']").forEach(button => button.remove())
    })
    drawButtons.forEach(button => button.hidden = false)
    dashboard.querySelectorAll("div").forEach(div => div.remove())
}

export function enableButtons(buttons){
    buttons.forEach(button => button.disabled = false)
}
export function disableButtons(buttons){
    buttons.forEach(button => button.disabled = true)
}

export function activateTieBreaker(){
    activateTieLayout()
    var tieDrawButtons = document.querySelectorAll("[id^='tie_draw']")

    tieDrawButtons.forEach(button => {
        button.addEventListener('click', ()=>{
            button.disabled = true
            var id = button.id.split('_')[2]
            game.playerCards[id] = [game.players[id].drawCard(id)]
            playerGrids[id].querySelector(`#tie_cards_${id}`).textContent += `${faces[game.playerCards[id][0]]}, `

            game.DrawCount++

            if(game.DrawCount == game.activePlayers.length){
                var id = game.getTieResult()
                if(id == -1) enableButtons(tieDrawButtons)
                else notifyWon(id, "Tie Breaker High Card", game.round)
                game.lostRoundPlayers.forEach(player => notifyLost(player))
            }
        })
    })
}
export function activateTieLayout(){
    notifyDashboard("TIE BREAKER", "red")
    notifyDashboard("Draw Tie Cards Until Winner", "red")

    game.activePlayers.forEach(id => {
        var button = document.createElement("button")
        button.textContent = "Tie Draw"
        button.setAttribute("class", "btn btn-danger")
        button.setAttribute("id", `tie_draw_${id}`)

        var div = document.createElement("div")
        div.setAttribute("id",`tie_cards_${id}`)

        var player = playerGrids[id].querySelector('.card-body')
        player.appendChild(button)
        player.appendChild(div)
    })
}

disableButtons(drawButtons)

drawButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        button.hidden = true
        var id = button.id.split('_')[1]
        game.players[id].drawCards(id)
        notifyPlayer(id, game.players[id].cardFaces().toString())

        game.drawCount++
        if(game.drawCount == playerCount){
            var result = game.getResult()
            if(result[0] != -1) notifyWon(result[0], result[1], game.round)
            game.lostRoundPlayers.forEach(player => notifyLost(player))
        }
    })
})

if(startButton){
    startButton.addEventListener('click', ()=> {
        if(game) game.newRound()
        else{
            game = new Game()
            enableButtons(drawButtons)
            startButton.disabled = true
            game.players.forEach(player => playerGrids[player.id].querySelector(".card-header").innerText = player.name)
        }
    })
}