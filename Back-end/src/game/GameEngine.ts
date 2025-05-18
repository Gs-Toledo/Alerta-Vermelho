import { Player } from "./Player";
import { City } from "./City";

export class GameEngine {
  players: Player[] = [];
  cities: City[] = [];

  constructor() {
    this.initializeCities();
  }

  initializeCities() {
    this.cities.push(new City("São Paulo"));
    this.cities.push(new City("Rio de Janeiro"));
  }

  addPlayer(name: string) {
    const player = new Player(name);
    this.players.push(player);
  }
}
