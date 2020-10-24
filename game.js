import { playerCount, cardCount } from "./constants.js"
import { notifyLost } from "./notify.js"

import Player from "./player.js";
import { resetLayout, activateTieBreaker } from "./index.js"

export default class Game{
    constructor(){
        this.players = []
        this.playerCards = []
        this.round = 0

        this.activePlayers = [... Array(playerCount).keys()]
        this.highCard = 0
        this.drawCount = 0

        this.initPlayers()
    }

    initPlayers(){
        for(let i = 0; i < playerCount; i++){
            var player = new Player(i)
            this.players.push(player)
            document.querySelector(`#player_${i} > .card > .card-header`).innerText = player.name
        }
    }

    newRound(){
        resetLayout()
        
        this.players.forEach(player => player.cards = [])
        this.playerCards = []
        this.round++

        this.activePlayers = [... Array(playerCount).keys()]
        this.highCard = 0
        this.drawCount = 0
    }

    getHighCard(){
        var highCard = 0

        this.activePlayers.forEach(id => {
            var currentMax = Math.max(... this.playerCards[id])
            highCard = Math.max(highCard, currentMax)
        })

        this.highCard = highCard
    }

    getResult(){
        var result = this.calResult()
        var id = result[0]
        var rule = result[1].replace(/_/g," ").toUpperCase()
        return [id, rule]
    }

    calResult(){
        var rules = ["Trail", "Sequence", "Pair", "HighCard"]
        this.players.forEach(player => this.playerCards.push(player.cardValues()))

        for(let rule of rules){
            var result = this.checkRule(`is${rule}`)
            this.getHighCard()
            console.log(result)
            if(result != -1) return [result, rule]
        }

        this.tieBreaker()
        return [-1, ""]
    }

    checkRule(rule){
        var ruleResult = []
        this.activePlayers.forEach(id => {
            var applyRule = eval(`this.${rule}(this.playerCards[${id}])`)
            ruleResult.push(applyRule)
        })
        console.log(ruleResult)
        return this.checkResult(ruleResult)
    }

    checkResult(ruleResult){
        var count = ruleResult.filter(Boolean).length
        if(count != 0) this.removePlayers(ruleResult)
        if(this.activePlayers.length == 1) return this.activePlayers[0]
        return -1
    }

    removePlayers(ruleResult){
        var newPlayers = []
        for(let i = 0; i < ruleResult.length; i++){
            if(ruleResult[i] == true) newPlayers.push(this.activePlayers[i])
            else notifyLost(this.activePlayers[i])
        }
        this.activePlayers = newPlayers
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
        if(currentHigh == this.highCard) return true
        return false
    }

    tieBreaker(){
        activateTieBreaker()
        this.DrawCount = 0
    }

    getTieResult(){
        this.DrawCount = 0
        this.getHighCard()

        return this.checkRule("isHighCard")
    }
}
