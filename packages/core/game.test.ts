import Game from './game';

describe('Game', () => {
    it('should instantiate the game', () => {
        const game = new Game();

        expect(game).toBeInstanceOf(Game);
    });
});