import chai from 'chai'
import Game from "../game.js"

function createWinner(game, inputCards){
  game.players.forEach(player => {
    let i = 0
    player.cards.forEach(card => {
      card.value = i
      i += 2
    })
  })

  for(let i = 0; i < game.players[0].cards.length; i++){
    game.players[1].cards[i] = inputCards[i]
  }
}

describe('Game', function(){
  describe('Rules', function(){
    before(function(){
      this.game = new Game()
    })

    describe('Trail Rule', function(){
      it('should return true', function(){
        chai.assert.equal(this.game.isTrail([1,1,1]), true)
      })

      it('should return false', function(){
        chai.assert.equal(this.game.isTrail([1,2,3]), false)
      })
    })

    describe('Sequence Rule', function(){
      it('should return true', function(){
        chai.assert.equal(this.game.isSequence([1,2,3]), true)
      })

      it('should return false', function(){
        chai.assert.equal(this.game.isSequence([1,1,2]), false)
      })
    })

    describe('Pair Rule', function(){
      it('should return true', function(){
        chai.assert.equal(this.game.isPair([1,1,2]), true)
      })

      it('should return false', function(){
        chai.assert.equal(this.game.isPair([1,2,3]), false)
      })
    })
  })

  describe('Get Result', function(){
    this.beforeEach(function(){
      this.game = new Game()
      this.game.players.forEach(player => player.drawCards())
    })

    this.afterEach(function(){
      let result = this.game.getResult()
      chai.assert.equal(result[0], 1)
    })

    it('should return player with trail', function(){
      createWinner(this.game, [1,1,1])
    })

    it('should return player with sequence', function(){
      createWinner(this.game, [1,2,3])
    })

    it('should return player with trail', function(){
      createWinner(this.game, [1,1,1])
    })
  })
})
