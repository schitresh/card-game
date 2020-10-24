import chai from 'chai'
import { cardCount, faces } from "../constants.js"
import Player from "../player.js"

describe('Player', function(){
  this.beforeEach(function(){
    this.player = new Player(1)
  })

  it('should create a player with given id', function(){
    chai.assert.equal(this.player.id, 1)
  })

  it('should draw cardCount number of cards', function(){
    this.player.drawCards()
    chai.assert.equal(this.player.cards.length, cardCount)
  })

  it('should draw a single card', function(){
    this.player.drawCard()
    chai.assert.equal(this.player.cards.length, 1)
  })

  it('should return card values', function(){
    this.player.drawCards()
    chai.assert.isArray(this.player.cardValues())
  })

  it('should return card faces', function(){
    this.player.drawCard()
    let cardFace = this.player.cardFaces()[0]
    chai.assert.equal(cardFace, faces[this.player.cards[0].value])
  })
})
