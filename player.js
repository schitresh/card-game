import { cardCount, faces } from "./constants.js"
import Card from "./card.js"

export default class Player{
    constructor(id){
        this.id = id
        this.name = `Player ${id+1}`
        this.cards = []
    }

    drawCards(){
        for(let i = 0; i < cardCount; i++){
            this.cards.push(new Card())
        }
    }

    drawCard(){
        this.cards = [new Card()]
        return this.cards[0].value
    }

    cardFaces(){
        return this.cards.map(card => faces[card.value])
    }

    cardValues(){
        return this.cards.map(card => card.value)
    }
}
