import { playerCount, cardCount, faces } from "./constants.js"
import { Player } from "./player.js";
import { Card } from "./card.js";
import { notifyDashboard, notifyPlayer, notifyLost, notifyWon, createDiv} from "./notify.js"

class Game{
    constructor(){
        drawButtons.forEach(button => { button.disabled = false })
        startButton.disabled = true

        if(round == 1) this.initPlayers()

        this.playerCards = []
        this.activePlayers = [... Array(playerCount).keys()]
        this.highCard = 0
    }

    initPlayers(){
        for(let i = 0; i < playerCount; i++){
            var player = new Player(i)
            players.push(player)
            document.querySelector(`#player_${i} > .card > .card-header`).innerText = player.name
        }
    }
    getHighCard(){
        var highCard = 0

        this.activePlayers.forEach(index => {
            var currentMax = Math.max(... this.playerCards[index])
            highCard = Math.max(highCard, currentMax)
        })

        this.highCard = highCard
    }

    getResult(){
        var result = this.calResult()
        var index = result[0]
        var rule = result[1].replace(/_/g," ").toUpperCase()

        if(index != -1) notifyWon(index, rule, round)
    }

    calResult(){
        var rules = ["Trail", "Sequence", "Pair", "HighCard"]
        players.forEach(player => this.playerCards.push(player.cardValues()))

        for(let rule of rules){
            var result = this.checkRule(`is_${rule}`)
            this.gethighCard()
            console.log(result)
            if(result != -1) return [result, rule]
        }

        this.gameDraw()
        return [-1, ""]
    }

    checkRule(rule){
        var ruleResult = []
        this.activePlayers.forEach(index => {
            var applyRule = eval(`this.${rule}(this.playerCards[${index}])`)
            ruleResult.push(applyRule)
        })
        console.log(ruleResult)
        return this.checkResult(ruleResult)
    }

    checkResult(ruleResult){
        var count = ruleResult.filter(Boolean).length
        if(count != 0) this.activePlayers = this.removePlayers(ruleResult)
        if(this.activePlayers.length == 1) return this.activePlayers[0]
        return -1
    }

    removePlayers(ruleResult){
        var newPlayers = []
        for(let i = 0; i < ruleResult.length; i++){
            if(ruleResult[i] == true) newPlayers.push(this.activePlayers[i])
            else notifyLost(this.activePlayers[i])
        }
        return newPlayers
    }

    isTrail(cards){
        cards = new Set(cards)
        if(cards.size == 1) return true
        return false
    }

    isSequence(cards){
        cards.sort()
        for(let i = 0; i < cards.length; i++){
            if(cards[i] - cards[0] != i) return false
        }
        return true
    }

    isPair(cards){
        cards = new Set(cards)
        if(cards.size < cardCount) return true
        return false
    }

    isHighCard(cards){
        var currentHigh = Math.max(... cards)
        console.log(this.highCard)
        console.log(currentHigh)
        if(currentHigh == this.highCard) return true
        return false
    }

    gameDraw(){
        this.activateTieBreaker()

        var tieDraws = document.querySelectorAll("[id^='tie_draw']")

        tieDraws.forEach(button => {
            button.addEventListener('click', ()=>{
                var id = button.id.split('_')[2]
                this.playerCards[id] = [players[id].drawCard(id)]
                console.log(this.playerCards[id][0])
                playerGrids[id].querySelector(`#tie_cards_${id}`).textContent += `${faces[this.playerCards[id][0]]}, `

                tieDrawsCount++
                button.disabled = true

                if(tieDrawsCount == this.activePlayers.length){
                    tieDrawsCount = 0
                    this.gethighCard()

                    var result = this.checkRule("isHighCard")

                    if(result != -1) notifyWon(result, "Tie Breaker High Card", round)
                    else tieDraws.forEach(button => button.disabled = false)
                }
            })
        })
    }

    activateTieBreaker(){
        notifyDashboard("TIE BREAKER", "red")
        notifyDashboard("Draw Tie Cards Until Winner", "red")

        this.activePlayers.forEach(index => {
            var button = document.createElement("button")
            button.textContent = "Tie Draw"
            button.setAttribute("class", "btn btn-danger")
            button.setAttribute("id", `tie_draw_${index}`)

            var div = document.createElement("div")
            div.setAttribute("id",`tie_cards_${index}`)

            var player = playerGrids[index].querySelector('.card-body')
            player.appendChild(button)
            player.appendChild(div)
        })
    }
}

var game = NaN
var players = []
var drawCount = 0
var tieDrawsCount = 0
var round = 0

const playerGrids = document.querySelectorAll("[id^='player']")
const drawButtons = document.querySelectorAll("[id^='draw']")
const startButton = document.querySelector("#start_button")
const dashboard = document.querySelector('#dashboard')

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

startButton.addEventListener('click', ()=> {
    startGame()
})

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