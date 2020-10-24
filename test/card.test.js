import chai from 'chai'
import Card from "../card.js"

describe('Card', function(){
  it('should create a card with random value', function(){
    let card = new Card()
    chai.assert.exists(card.value)
  })
  it('should create a card with given value', function(){
    let card = new Card(1)
    chai.assert.equal(card.value, 1)
  })

  it('should return face of the card', function(){
    let card = new Card(1)
    chai.assert.equal(card.face(), '2')
  })
})
