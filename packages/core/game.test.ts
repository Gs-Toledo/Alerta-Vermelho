import Game from './game';

describe('Game', () => {
    it('should return the current round', () => {
        const game = new Game();
        
        expect(game.getRound()).toBe(3);
    });
});